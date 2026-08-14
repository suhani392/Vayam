-- ============================================================
-- VAYAM — CIVIC INTELLIGENCE DATABASE
-- PostgreSQL / Supabase
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";


-- ============================================================
-- 1. ENUMS
-- ============================================================

do $$ begin
    create type user_role as enum (
        'citizen',
        'admin',
        'reviewer'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type source_type as enum (
        'OFFICIAL_GOVERNMENT',
        'OFFICIAL_MINISTRY',
        'OFFICIAL_STATE_GOVERNMENT',
        'OFFICIAL_AUTHORITY',
        'OFFICIAL_DOCUMENT',
        'SECONDARY_REFERENCE',
        'DEMO'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type verification_status as enum (
        'VERIFIED',
        'UNVERIFIED',
        'EXPIRED',
        'REQUIRES_REVIEW',
        'DEMO'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type authority_level as enum (
        'CENTRAL',
        'STATE',
        'LOCAL',
        'STATUTORY',
        'OTHER'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type content_status as enum (
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type recommendation_bucket as enum (
        'NOW',
        'NEXT',
        'LATER'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type notification_type as enum (
        'MILESTONE',
        'SCHEME',
        'SERVICE',
        'DEADLINE',
        'REMINDER',
        'SYSTEM'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type notification_status as enum (
        'UNREAD',
        'READ',
        'DISMISSED'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type milestone_status as enum (
        'UPCOMING',
        'CURRENT',
        'COMPLETED',
        'MISSED'
    );
exception
    when duplicate_object then null;
end $$;


do $$ begin
    create type eligibility_status as enum (
        'ELIGIBLE',
        'NOT_ELIGIBLE',
        'REQUIRES_VERIFICATION',
        'UNKNOWN'
    );
exception
    when duplicate_object then null;
end $$;


-- ============================================================
-- 2. STATES
-- ============================================================

create table if not exists states (
    id uuid primary key default gen_random_uuid(),

    code varchar(10) unique not null,
    name varchar(100) not null,

    is_union_territory boolean default false,
    is_active boolean default true,

    created_at timestamptz default now()
);


-- ============================================================
-- 3. CATEGORIES
-- ============================================================

create table if not exists categories (
    id uuid primary key default gen_random_uuid(),

    slug varchar(100) unique not null,
    name varchar(150) not null,

    description text,

    icon varchar(100),
    color varchar(30),

    display_order integer default 0,

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 4. USER PROFILES
-- ============================================================

create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    full_name varchar(200),
    date_of_birth date,

    state_id uuid references states(id),

    district varchar(150),
    city varchar(150),

    education_level varchar(100),

    employment_status varchar(100),

    occupation varchar(150),

    annual_income_inr numeric(15,2),

    is_student boolean default false,

    gender varchar(50),

    preferred_language varchar(20) default 'en',

    avatar_url text,

    role user_role default 'citizen',

    onboarding_completed boolean default false,

    profile_completion integer default 0
        check (profile_completion between 0 and 100),

    is_demo_user boolean default false,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 5. USER PREFERENCES
-- ============================================================

create table if not exists user_preferences (
    user_id uuid primary key references profiles(id) on delete cascade,

    theme varchar(20) default 'system',

    language varchar(20) default 'en',

    voice_enabled boolean default true,

    notifications_enabled boolean default true,

    milestone_notifications boolean default true,

    deadline_notifications boolean default true,

    recommendation_notifications boolean default true,

    email_notifications boolean default false,

    push_notifications boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 6. USER INTERESTS
-- ============================================================

create table if not exists user_interests (
    user_id uuid references profiles(id) on delete cascade,
    category_id uuid references categories(id) on delete cascade,

    created_at timestamptz default now(),

    primary key (user_id, category_id)
);


-- ============================================================
-- 7. KNOWLEDGE SOURCES
-- ============================================================

create table if not exists knowledge_sources (
    id uuid primary key default gen_random_uuid(),

    name varchar(300) not null,

    url text not null,

    source_type source_type not null,

    authority_level authority_level not null,

    verification_status verification_status default 'UNVERIFIED',

    last_verified timestamptz,

    verified_by uuid references profiles(id),

    review_due timestamptz,

    notes text,

    trust_score numeric(5,2)
        check (trust_score between 0 and 100),

    risk_level varchar(30),

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 8. KNOWLEDGE ITEMS
-- ============================================================

create table if not exists knowledge_items (
    id uuid primary key default gen_random_uuid(),

    slug varchar(200) unique not null,

    title varchar(500) not null,

    short_description text,

    description text,

    category_id uuid references categories(id),

    authority_name varchar(300),

    status content_status default 'DRAFT',

    verification_status verification_status default 'UNVERIFIED',

    icon varchar(100),

    image_url text,

    tags text[] default '{}',

    -- Flexible metadata for future expansion
    metadata jsonb default '{}'::jsonb,

    -- Human-readable eligibility explanation
    eligibility_summary text,

    -- Documents required
    required_documents jsonb default '[]'::jsonb,

    -- Application/action information
    action_label varchar(150),

    action_url text,

    deadline timestamptz,

    effective_from date,

    effective_until date,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 9. KNOWLEDGE ITEM ↔ SOURCES
-- ============================================================

create table if not exists knowledge_item_sources (
    knowledge_item_id uuid references knowledge_items(id) on delete cascade,

    source_id uuid references knowledge_sources(id) on delete cascade,

    is_primary boolean default false,

    created_at timestamptz default now(),

    primary key (knowledge_item_id, source_id)
);


-- ============================================================
-- 10. KNOWLEDGE ITEM ↔ CATEGORIES
-- ============================================================

create table if not exists knowledge_item_categories (
    knowledge_item_id uuid references knowledge_items(id) on delete cascade,

    category_id uuid references categories(id) on delete cascade,

    primary key (knowledge_item_id, category_id)
);


-- ============================================================
-- 11. ELIGIBILITY RULE SETS
-- ============================================================

create table if not exists eligibility_rule_sets (
    id uuid primary key default gen_random_uuid(),

    knowledge_item_id uuid not null
        references knowledge_items(id) on delete cascade,

    name varchar(300),

    description text,

    version integer default 1,

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 12. ELIGIBILITY RULES
-- ============================================================

create table if not exists eligibility_rules (
    id uuid primary key default gen_random_uuid(),

    rule_set_id uuid not null
        references eligibility_rule_sets(id) on delete cascade,

    rule_order integer default 0,

    rule_type varchar(100) not null,

    -- Flexible rule definition
    conditions jsonb not null default '{}'::jsonb,

    -- What this rule means to the user
    explanation text,

    is_required boolean default true,

    created_at timestamptz default now()
);


-- ============================================================
-- 13. MILESTONES
-- ============================================================

create table if not exists milestones (
    id uuid primary key default gen_random_uuid(),

    slug varchar(200) unique not null,

    title varchar(300) not null,

    description text,

    category_id uuid references categories(id),

    age_min integer,

    age_max integer,

    -- Flexible trigger logic
    trigger_config jsonb default '{}'::jsonb,

    action_label varchar(150),

    action_url text,

    icon varchar(100),

    display_order integer default 0,

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 14. MILESTONE ↔ KNOWLEDGE ITEMS
-- ============================================================

create table if not exists milestone_knowledge_items (
    milestone_id uuid references milestones(id) on delete cascade,

    knowledge_item_id uuid references knowledge_items(id) on delete cascade,

    priority integer default 0,

    primary key (milestone_id, knowledge_item_id)
);


-- ============================================================
-- 15. USER MILESTONES
-- ============================================================

create table if not exists user_milestones (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references profiles(id) on delete cascade,

    milestone_id uuid not null
        references milestones(id) on delete cascade,

    status milestone_status not null,

    target_date date,

    days_remaining integer,

    completed_at timestamptz,

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    unique (user_id, milestone_id)
);


-- ============================================================
-- 16. USER RECOMMENDATIONS
-- ============================================================

create table if not exists user_recommendations (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references profiles(id) on delete cascade,

    knowledge_item_id uuid not null
        references knowledge_items(id) on delete cascade,

    bucket recommendation_bucket not null,

    eligibility_status eligibility_status not null,

    relevance_score numeric(5,2)
        check (relevance_score between 0 and 100),

    urgency_score numeric(5,2)
        check (urgency_score between 0 and 100),

    reasons jsonb default '[]'::jsonb,

    missing_fields text[] default '{}',

    calculated_at timestamptz default now(),

    expires_at timestamptz,

    is_dismissed boolean default false,

    created_at timestamptz default now()
);


-- ============================================================
-- 17. SAVED ITEMS
-- ============================================================

create table if not exists saved_items (
    user_id uuid references profiles(id) on delete cascade,

    knowledge_item_id uuid
        references knowledge_items(id) on delete cascade,

    created_at timestamptz default now(),

    primary key (user_id, knowledge_item_id)
);


-- ============================================================
-- 18. NOTIFICATIONS
-- ============================================================

create table if not exists notifications (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references profiles(id) on delete cascade,

    type notification_type not null,

    status notification_status default 'UNREAD',

    title varchar(300) not null,

    message text not null,

    knowledge_item_id uuid
        references knowledge_items(id) on delete set null,

    milestone_id uuid
        references milestones(id) on delete set null,

    action_url text,

    scheduled_for timestamptz,

    read_at timestamptz,

    dismissed_at timestamptz,

    created_at timestamptz default now()
);


-- ============================================================
-- 19. AI CONVERSATIONS
-- ============================================================

create table if not exists ai_conversations (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references profiles(id) on delete cascade,

    title varchar(300),

    language varchar(20) default 'en',

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


-- ============================================================
-- 20. AI MESSAGES
-- ============================================================

create table if not exists ai_messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null
        references ai_conversations(id) on delete cascade,

    role varchar(30) not null
        check (role in ('user', 'assistant', 'system')),

    content text not null,

    language varchar(20),

    -- Useful for auditability
    knowledge_item_ids uuid[] default '{}',

    source_ids uuid[] default '{}',

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now()
);


-- ============================================================
-- 21. USER SEARCH HISTORY
-- ============================================================

create table if not exists search_history (
    id uuid primary key default gen_random_uuid(),

    user_id uuid
        references profiles(id) on delete cascade,

    query text not null,

    language varchar(20),

    results_count integer default 0,

    created_at timestamptz default now()
);


-- ============================================================
-- 22. USER FEEDBACK
-- ============================================================

create table if not exists feedback (
    id uuid primary key default gen_random_uuid(),

    user_id uuid
        references profiles(id) on delete set null,

    knowledge_item_id uuid
        references knowledge_items(id) on delete set null,

    conversation_id uuid
        references ai_conversations(id) on delete set null,

    rating integer
        check (rating between 1 and 5),

    feedback_text text,

    feedback_type varchar(100),

    created_at timestamptz default now()
);


-- ============================================================
-- 23. USER ACTIONS / ANALYTICS
-- ============================================================

create table if not exists user_actions (
    id uuid primary key default gen_random_uuid(),

    user_id uuid
        references profiles(id) on delete cascade,

    action_type varchar(100) not null,

    knowledge_item_id uuid
        references knowledge_items(id) on delete set null,

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now()
);


-- ============================================================
-- 24. INDEXES
-- ============================================================

create index if not exists idx_profiles_state
    on profiles(state_id);

create index if not exists idx_profiles_dob
    on profiles(date_of_birth);

create index if not exists idx_profiles_education
    on profiles(education_level);

create index if not exists idx_profiles_student
    on profiles(is_student);


create index if not exists idx_knowledge_items_category
    on knowledge_items(category_id);

create index if not exists idx_knowledge_items_status
    on knowledge_items(status);

create index if not exists idx_knowledge_items_verification
    on knowledge_items(verification_status);

create index if not exists idx_knowledge_items_deadline
    on knowledge_items(deadline);

create index if not exists idx_knowledge_items_tags
    on knowledge_items using gin(tags);

create index if not exists idx_knowledge_items_title_search
    on knowledge_items using gin(title gin_trgm_ops);


create index if not exists idx_sources_verification
    on knowledge_sources(verification_status);

create index if not exists idx_sources_review_due
    on knowledge_sources(review_due);


create index if not exists idx_ruleset_item
    on eligibility_rule_sets(knowledge_item_id);

create index if not exists idx_rules_conditions
    on eligibility_rules using gin(conditions);


create index if not exists idx_user_recommendations_user
    on user_recommendations(user_id);

create index if not exists idx_user_recommendations_bucket
    on user_recommendations(user_id, bucket);

create index if not exists idx_user_milestones_user
    on user_milestones(user_id);

create index if not exists idx_notifications_user
    on notifications(user_id, status);

create index if not exists idx_notifications_scheduled
    on notifications(scheduled_for);

create index if not exists idx_ai_conversations_user
    on ai_conversations(user_id);

create index if not exists idx_ai_messages_conversation
    on ai_messages(conversation_id);

create index if not exists idx_search_history_user
    on search_history(user_id);


-- ============================================================
-- 25. UPDATED_AT FUNCTION
-- ============================================================

create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


-- ============================================================
-- 26. UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
before update on profiles
for each row execute function update_updated_at();


drop trigger if exists preferences_updated_at on user_preferences;
create trigger preferences_updated_at
before update on user_preferences
for each row execute function update_updated_at();


drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at
before update on categories
for each row execute function update_updated_at();


drop trigger if exists sources_updated_at on knowledge_sources;
create trigger sources_updated_at
before update on knowledge_sources
for each row execute function update_updated_at();


drop trigger if exists knowledge_updated_at on knowledge_items;
create trigger knowledge_updated_at
before update on knowledge_items
for each row execute function update_updated_at();


drop trigger if exists rulesets_updated_at on eligibility_rule_sets;
create trigger rulesets_updated_at
before update on eligibility_rule_sets
for each row execute function update_updated_at();


drop trigger if exists milestones_updated_at on milestones;
create trigger milestones_updated_at
before update on milestones
for each row execute function update_updated_at();


drop trigger if exists conversations_updated_at on ai_conversations;
create trigger conversations_updated_at
before update on ai_conversations
for each row execute function update_updated_at();


-- ============================================================
-- 27. AUTO-CREATE PROFILE AFTER SUPABASE AUTH SIGNUP
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into profiles (
        id,
        full_name
    )
    values (
        new.id,
        coalesce(
            new.raw_user_meta_data ->> 'full_name',
            new.raw_user_meta_data ->> 'name'
        )
    )
    on conflict (id) do nothing;

    insert into user_preferences (
        user_id
    )
    values (
        new.id
    )
    on conflict (user_id) do nothing;

    return new;

end;
$$;


drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function handle_new_user();


-- ============================================================
-- 28. ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table user_preferences enable row level security;
alter table user_interests enable row level security;
alter table saved_items enable row level security;
alter table notifications enable row level security;
alter table user_milestones enable row level security;
alter table user_recommendations enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table search_history enable row level security;
alter table feedback enable row level security;
alter table user_actions enable row level security;


-- ============================================================
-- 29. PROFILE POLICIES
-- ============================================================

drop policy if exists "Users can view own profile" on profiles;

create policy "Users can view own profile"
on profiles
for select
using (auth.uid() = id);


drop policy if exists "Users can create own profile" on profiles;

create policy "Users can create own profile"
on profiles
for insert
with check (auth.uid() = id);


drop policy if exists "Users can update own profile" on profiles;

create policy "Users can update own profile"
on profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);


-- ============================================================
-- 30. USER PREFERENCES POLICIES
-- ============================================================

create policy "Users can manage own preferences"
on user_preferences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 31. USER INTEREST POLICIES
-- ============================================================

create policy "Users can manage own interests"
on user_interests
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 32. SAVED ITEMS POLICIES
-- ============================================================

create policy "Users can manage saved items"
on saved_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 33. NOTIFICATION POLICIES
-- ============================================================

create policy "Users can view own notifications"
on notifications
for select
using (auth.uid() = user_id);


create policy "Users can update own notifications"
on notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 34. USER MILESTONE POLICIES
-- ============================================================

create policy "Users can view own milestones"
on user_milestones
for select
using (auth.uid() = user_id);


-- ============================================================
-- 35. USER RECOMMENDATION POLICIES
-- ============================================================

create policy "Users can view own recommendations"
on user_recommendations
for select
using (auth.uid() = user_id);


create policy "Users can update own recommendations"
on user_recommendations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 36. AI CONVERSATION POLICIES
-- ============================================================

create policy "Users can manage own conversations"
on ai_conversations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "Users can access own messages"
on ai_messages
for all
using (
    exists (
        select 1
        from ai_conversations c
        where c.id = ai_messages.conversation_id
        and c.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from ai_conversations c
        where c.id = ai_messages.conversation_id
        and c.user_id = auth.uid()
    )
);


-- ============================================================
-- 37. SEARCH HISTORY
-- ============================================================

create policy "Users can manage own search history"
on search_history
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- 38. FEEDBACK
-- ============================================================

create policy "Users can create feedback"
on feedback
for insert
with check (
    auth.uid() = user_id
);


create policy "Users can view own feedback"
on feedback
for select
using (auth.uid() = user_id);


-- ============================================================
-- 39. USER ACTIONS
-- ============================================================

create policy "Users can create own actions"
on user_actions
for insert
with check (auth.uid() = user_id);


create policy "Users can view own actions"
on user_actions
for select
using (auth.uid() = user_id);


-- ============================================================
-- 40. PUBLIC KNOWLEDGE READ ACCESS
-- ============================================================

alter table states enable row level security;
alter table categories enable row level security;
alter table knowledge_sources enable row level security;
alter table knowledge_items enable row level security;
alter table knowledge_item_sources enable row level security;
alter table knowledge_item_categories enable row level security;
alter table eligibility_rule_sets enable row level security;
alter table eligibility_rules enable row level security;
alter table milestones enable row level security;
alter table milestone_knowledge_items enable row level security;


create policy "Public can view active states"
on states
for select
using (is_active = true);


create policy "Public can view active categories"
on categories
for select
using (is_active = true);


create policy "Public can view verified sources"
on knowledge_sources
for select
using (
    verification_status in ('VERIFIED', 'DEMO')
);


create policy "Public can view published knowledge"
on knowledge_items
for select
using (
    status = 'PUBLISHED'
    and verification_status in ('VERIFIED', 'DEMO')
);


create policy "Public can view knowledge sources mapping"
on knowledge_item_sources
for select
using (
    exists (
        select 1
        from knowledge_items k
        where k.id = knowledge_item_sources.knowledge_item_id
        and k.status = 'PUBLISHED'
        and k.verification_status in ('VERIFIED', 'DEMO')
    )
);


create policy "Public can view knowledge categories"
on knowledge_item_categories
for select
using (true);


create policy "Public can view active rulesets"
on eligibility_rule_sets
for select
using (is_active = true);


create policy "Public can view eligibility rules"
on eligibility_rules
for select
using (
    exists (
        select 1
        from eligibility_rule_sets rs
        where rs.id = eligibility_rules.rule_set_id
        and rs.is_active = true
    )
);


create policy "Public can view active milestones"
on milestones
for select
using (is_active = true);


create policy "Public can view milestone mappings"
on milestone_knowledge_items
for select
using (true);


-- ============================================================
-- 41. SEED CATEGORIES
-- ============================================================

insert into categories (slug, name, description, display_order)
values
('education', 'Education', 'Education, scholarships, admissions and learning opportunities', 1),
('finance', 'Finance', 'Financial assistance, loans, subsidies and benefits', 2),
('rights', 'Rights', 'Citizen rights, laws and legal awareness', 3),
('services', 'Government Services', 'Government certificates, registrations and services', 4),
('employment', 'Employment', 'Jobs, careers, employment schemes and skill development', 5),
('health', 'Health', 'Public healthcare schemes and health benefits', 6),
('identity', 'Identity & Documents', 'Identity documents, registrations and updates', 7),
('housing', 'Housing', 'Housing schemes and assistance', 8),
('agriculture', 'Agriculture', 'Farmer schemes and agricultural support', 9),
('social-welfare', 'Social Welfare', 'Social security and welfare programs', 10)
on conflict (slug) do nothing;


-- ============================================================
-- 42. COMMON INDIAN STATES / UTs
-- ============================================================

insert into states (code, name, is_union_territory)
values
('AP', 'Andhra Pradesh', false),
('AR', 'Arunachal Pradesh', false),
('AS', 'Assam', false),
('BR', 'Bihar', false),
('CG', 'Chhattisgarh', false),
('GA', 'Goa', false),
('GJ', 'Gujarat', false),
('HR', 'Haryana', false),
('HP', 'Himachal Pradesh', false),
('JH', 'Jharkhand', false),
('KA', 'Karnataka', false),
('KL', 'Kerala', false),
('MP', 'Madhya Pradesh', false),
('MH', 'Maharashtra', false),
('MN', 'Manipur', false),
('ML', 'Meghalaya', false),
('MZ', 'Mizoram', false),
('NL', 'Nagaland', false),
('OD', 'Odisha', false),
('PB', 'Punjab', false),
('RJ', 'Rajasthan', false),
('SK', 'Sikkim', false),
('TN', 'Tamil Nadu', false),
('TS', 'Telangana', false),
('TR', 'Tripura', false),
('UP', 'Uttar Pradesh', false),
('UK', 'Uttarakhand', false),
('WB', 'West Bengal', false),
('AN', 'Andaman and Nicobar Islands', true),
('CH', 'Chandigarh', true),
('DN', 'Dadra and Nagar Haveli and Daman and Diu', true),
('DL', 'Delhi', true),
('JK', 'Jammu and Kashmir', true),
('LA', 'Ladakh', true),
('LD', 'Lakshadweep', true),
('PY', 'Puducherry', true)
on conflict (code) do nothing;


-- ============================================================
-- 43. EDUCATION PATHFINDER TABLES
-- ============================================================

create table if not exists education_careers (
    id uuid primary key default gen_random_uuid(),
    slug varchar(100) unique not null,
    title varchar(200) not null,
    category varchar(100) not null,
    short_description text,
    icon varchar(100),
    demand_level varchar(50),
    avg_starting_salary_inr numeric(15,2),
    created_at timestamptz default now()
);

create table if not exists education_pathways (
    id uuid primary key default gen_random_uuid(),
    career_id uuid references education_careers(id) on delete cascade,
    path_code varchar(50) not null,
    title varchar(250) not null,
    starting_education_level varchar(100) not null,
    required_stream varchar(100),
    degree_qualification varchar(200) not null,
    duration_years numeric(3,1) not null,
    entrance_exams text[] default '{}',
    key_skills text[] default '{}',
    steps jsonb default '[]'::jsonb,
    alternative_routes text[] default '{}',
    official_sources jsonb default '[]'::jsonb,
    created_at timestamptz default now()
);

-- ============================================================
-- 44. KNOW YOUR RIGHTS TABLES
-- ============================================================

create table if not exists legal_topics (
    id uuid primary key default gen_random_uuid(),
    slug varchar(100) unique not null,
    title varchar(250) not null,
    category varchar(100) not null,
    plain_language_summary text not null,
    applicable_acts text[] default '{}',
    created_at timestamptz default now()
);

create table if not exists legal_situations (
    id uuid primary key default gen_random_uuid(),
    topic_id uuid references legal_topics(id) on delete cascade,
    title varchar(300) not null,
    situation_patterns text[] default '{}',
    legal_considerations text[] default '{}',
    rights_granted text[] default '{}',
    evidence_to_preserve text[] default '{}',
    practical_steps jsonb default '[]'::jsonb,
    official_helplines jsonb default '[]'::jsonb,
    official_sources jsonb default '[]'::jsonb,
    last_verified timestamptz default now(),
    disclaimer text,
    created_at timestamptz default now()
);

-- ============================================================
-- DONE
-- ============================================================

