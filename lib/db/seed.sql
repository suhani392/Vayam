-- ============================================================
-- VAYAM — COMPLETE DATABASE SEED SCRIPT
-- PostgreSQL / Supabase
-- Run this in Supabase SQL Editor to populate all Vayam tables
-- ============================================================

-- ADMIN CIVIC INTELLIGENCE TABLES
CREATE TABLE IF NOT EXISTS public.monitored_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    organization varchar(255) NOT NULL,
    authority_type varchar(100) NOT NULL,
    url text NOT NULL,
    source_type varchar(100) NOT NULL,
    jurisdiction varchar(100) DEFAULT 'Central',
    state varchar(100),
    category varchar(100) NOT NULL,
    active boolean DEFAULT true,
    scan_frequency varchar(50) DEFAULT 'daily',
    last_scanned_at timestamptz,
    last_changed_at timestamptz,
    last_content_hash text,
    reliability_level varchar(50) DEFAULT 'HIGH',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.civic_update_findings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid REFERENCES public.monitored_sources(id) ON DELETE SET NULL,
    finding_type varchar(50) NOT NULL,
    domain varchar(50) NOT NULL,
    title varchar(255) NOT NULL,
    summary text NOT NULL,
    change_summary text NOT NULL,
    affected_fields jsonb DEFAULT '[]'::jsonb,
    previous_values jsonb DEFAULT '{}'::jsonb,
    proposed_values jsonb DEFAULT '{}'::jsonb,
    eligibility_changes jsonb DEFAULT '[]'::jsonb,
    effective_date date,
    expiry_date date,
    jurisdiction varchar(100) DEFAULT 'Central',
    confidence integer CHECK (confidence >= 0 AND confidence <= 100),
    source_metadata jsonb DEFAULT '{}'::jsonb,
    evidence jsonb DEFAULT '[]'::jsonb,
    status varchar(50) DEFAULT 'PENDING_REVIEW',
    requires_human_review boolean DEFAULT true,
    reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    rejection_reason text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.civic_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id uuid REFERENCES public.civic_update_findings(id) ON DELETE SET NULL,
    target_table varchar(100) NOT NULL,
    target_record_id uuid,
    action varchar(50) NOT NULL,
    previous_data jsonb,
    applied_data jsonb,
    approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- INITIAL SEED SOURCES FOR MONITORING
INSERT INTO public.monitored_sources (id, name, organization, authority_type, url, source_type, jurisdiction, category, active)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'National Scholarship Portal (NSP)', 'Ministry of Education, GoI', 'CENTRAL', 'https://scholarships.gov.in/', 'SCHEME_PORTAL', 'Central', 'Education', true),
  ('s1000000-0000-0000-0000-000000000002', 'PM-JAY Health Portal', 'National Health Authority (NHA)', 'CENTRAL', 'https://pmjay.gov.in/', 'SCHEME_PORTAL', 'Central', 'Government Scheme', true),
  ('s1000000-0000-0000-0000-000000000003', 'Department of Justice Legal Aid', 'Ministry of Law and Justice, GoI', 'CENTRAL', 'https://doj.gov.in/', 'LEGISLATIVE', 'Central', 'Legal / Legislative', true),
  ('s1000000-0000-0000-0000-000000000004', 'National Consumer Helpline (NCH)', 'Ministry of Consumer Affairs, GoI', 'CENTRAL', 'https://consumerhelpline.gov.in/', 'PUBLIC_SERVICE', 'Central', 'Public Service', true)
ON CONFLICT (id) DO NOTHING;
CREATE TABLE IF NOT EXISTS public.legal_acts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    act_number varchar(50),                     -- e.g., 'Act No. 35 of 2019'
    title varchar(255) NOT NULL,                -- e.g., 'The Consumer Protection Act, 2019'
    short_title varchar(100),                   -- e.g., 'CPA 2019'
    category varchar(100),                      -- e.g., 'consumer_rights', 'property_rent'
    enactment_year integer NOT NULL,            -- e.g., 2019
    ministry varchar(200),                      -- e.g., 'Ministry of Consumer Affairs'
    jurisdiction varchar(50) DEFAULT 'Central', -- 'Central' or 'State'
    official_gazette_url text,
    summary text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legal_rights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    act_id uuid REFERENCES public.legal_acts(id) ON DELETE CASCADE,
    category varchar(100),                      -- e.g., 'consumer_rights', 'property_rent'
    section_number varchar(50),                 -- e.g., 'Section 35'
    right_title varchar(255) NOT NULL,          -- e.g., 'Right to File Consumer Complaint'
    legal_text text NOT NULL,                   -- Statutory text snippet
    plain_language_explanation text NOT NULL,   -- Plain language explanation
    penalty_or_remedy text,                     -- Prescribed remedy or penalty
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legal_topics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug varchar(100) UNIQUE NOT NULL,
    title varchar(250) NOT NULL,
    category varchar(100) NOT NULL,
    plain_language_summary text NOT NULL,
    applicable_acts text[] DEFAULT '{}',
    act_id uuid REFERENCES public.legal_acts(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legal_situations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id uuid REFERENCES public.legal_topics(id) ON DELETE CASCADE,
    title varchar(300) NOT NULL,
    situation_patterns text[] DEFAULT '{}',
    legal_considerations text[] DEFAULT '{}',
    rights_granted text[] DEFAULT '{}',
    evidence_to_preserve text[] DEFAULT '{}',
    practical_steps jsonb DEFAULT '[]'::jsonb,
    official_helplines jsonb DEFAULT '[]'::jsonb,
    official_sources jsonb DEFAULT '[]'::jsonb,
    last_verified timestamptz DEFAULT now(),
    disclaimer text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legal_situation_rights (
    situation_id uuid REFERENCES public.legal_situations(id) ON DELETE CASCADE,
    right_id uuid REFERENCES public.legal_rights(id) ON DELETE CASCADE,
    PRIMARY KEY (situation_id, right_id)
);

CREATE TABLE IF NOT EXISTS public.education_careers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug varchar(100) UNIQUE NOT NULL,
    title varchar(200) NOT NULL,
    category varchar(100) NOT NULL,
    short_description text,
    icon varchar(100),
    demand_level varchar(50),
    avg_starting_salary_inr numeric(15,2),
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education_pathways (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id uuid REFERENCES public.education_careers(id) ON DELETE CASCADE,
    path_code varchar(50) NOT NULL,
    title varchar(250) NOT NULL,
    starting_education_level varchar(100) NOT NULL,
    required_stream varchar(100),
    degree_qualification varchar(200) NOT NULL,
    duration_years numeric(3,1) NOT NULL,
    entrance_exams text[] DEFAULT '{}',
    key_skills text[] DEFAULT '{}',
    steps jsonb DEFAULT '[]'::jsonb,
    alternative_routes text[] DEFAULT '{}',
    official_sources jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY & PUBLIC READ POLICIES
ALTER TABLE public.legal_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_pathways ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read legal_topics" ON public.legal_topics FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read legal_situations" ON public.legal_situations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read education_careers" ON public.education_careers FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read education_pathways" ON public.education_pathways FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 1. KNOWLEDGE SOURCES
INSERT INTO public.knowledge_sources (id, name, url, source_type, authority_level, verification_status, last_verified, trust_score, risk_level)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ministry of Education, GoI', 'https://www.education.gov.in/', 'OFFICIAL_MINISTRY', 'CENTRAL', 'VERIFIED', NOW(), 98.0, 'LOW'),
  ('a1000000-0000-0000-0000-000000000002', 'Ministry of Agriculture & Farmers Welfare', 'https://pmkisan.gov.in/', 'OFFICIAL_MINISTRY', 'CENTRAL', 'VERIFIED', NOW(), 99.0, 'LOW'),
  ('a1000000-0000-0000-0000-000000000003', 'National Health Authority (NHA)', 'https://pmjay.gov.in/', 'OFFICIAL_AUTHORITY', 'CENTRAL', 'VERIFIED', NOW(), 99.0, 'LOW'),
  ('a1000000-0000-0000-0000-000000000004', 'Ministry of Housing and Urban Affairs', 'https://pmaymis.gov.in/', 'OFFICIAL_MINISTRY', 'CENTRAL', 'VERIFIED', NOW(), 97.0, 'LOW'),
  ('a1000000-0000-0000-0000-000000000005', 'Ministry of Rural Development', 'https://nrega.nic.in/', 'OFFICIAL_MINISTRY', 'CENTRAL', 'VERIFIED', NOW(), 96.0, 'LOW'),
  ('a1000000-0000-0000-0000-000000000006', 'Ministry of Micro, Small and Medium Enterprises', 'https://msme.gov.in/', 'OFFICIAL_MINISTRY', 'CENTRAL', 'VERIFIED', NOW(), 95.0, 'LOW')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  verification_status = EXCLUDED.verification_status;

-- 2. KNOWLEDGE ITEMS (SCHEMES & SERVICES)
INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000001'::uuid,
  'pm-kisan-samman-nidhi',
  'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
  'Direct income support of ₹6,000 per year for all landholding farmer families across India.',
  'Central sector scheme providing ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of landholding farmer families.',
  c.id,
  'Ministry of Agriculture & Farmers Welfare, GoI',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'Sprout',
  ARRAY['farmers', 'agriculture', 'income support', 'pm-kisan', 'direct benefit transfer'],
  '{"min_age": 18, "max_annual_income": 800000, "benefit_amount_inr": 6000}'::jsonb,
  'Landholding farmer families with cultivable land in their name. Excludes institutional landholders, income taxpayers, and high government salary recipients.',
  'Apply on PM-KISAN Portal',
  'https://pmkisan.gov.in/'
FROM public.categories c WHERE c.slug = 'agriculture'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000002'::uuid,
  'ayushman-bharat-pm-jay',
  'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
  'Health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
  'World’s largest health insurance scheme fully financed by government, providing cash-free coverage of up to ₹5,000,000 per family per year for empanelled public and private hospitals.',
  c.id,
  'National Health Authority, Ministry of Health and Family Welfare, GoI',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'HeartPulse',
  ARRAY['health', 'health cover', 'ayushman bharat', 'hospitalization', 'free treatment'],
  '{"min_age": 0, "max_annual_income": 500000, "benefit_amount_inr": 500000}'::jsonb,
  'Low-income households identified under Socio-Economic Caste Census (SECC) data or state specific health cover schemes.',
  'Check Eligibility on PM-JAY Portal',
  'https://pmjay.gov.in/'
FROM public.categories c WHERE c.slug = 'health'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000003'::uuid,
  'pmay-housing-for-all',
  'Pradhan Mantri Awas Yojana (PMAY) - Housing for All',
  'Financial assistance and interest subsidy up to ₹2.67 Lakh for building or purchasing first pucca house.',
  'Comprehensive housing scheme providing interest subsidies and direct financial assistance for EWS, LIG, and MIG families to construct or purchase affordable housing.',
  c.id,
  'Ministry of Housing and Urban Affairs / Ministry of Rural Development',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'Home',
  ARRAY['housing', 'pmay', 'home loan', 'interest subsidy', 'pucca house'],
  '{"min_age": 21, "max_age": 70, "max_annual_income": 1800000, "benefit_amount_inr": 267000}'::jsonb,
  'Indian citizens who do not own a pucca house anywhere in India. Income categories: EWS, LIG, and MIG.',
  'Apply on PMAY Portal',
  'https://pmaymis.gov.in/'
FROM public.categories c WHERE c.slug = 'housing'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000004'::uuid,
  'pm-usp-csss-scholarship',
  'PM-USP Central Sector Scheme of Scholarship for College Students (CSSS)',
  'Financial assistance of ₹12,000–₹20,000 per year for college and university students.',
  'Central sector scholarship awarded to meritorious students scoring above 80th percentile in Class XII board exams and pursuing higher education.',
  c.id,
  'Department of Higher Education, Ministry of Education, GoI',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'GraduationCap',
  ARRAY['scholarship', 'college', 'higher education', 'students', 'pm-usp'],
  '{"min_age": 17, "max_age": 25, "max_annual_income": 450000, "benefit_amount_inr": 12000, "education_level": "undergraduate"}'::jsonb,
  'Students pursuing regular degree courses with family income below ₹4.5 Lakh per annum and 80th percentile in Class 12.',
  'Apply on NSP Portal',
  'https://scholarships.gov.in/'
FROM public.categories c WHERE c.slug = 'education'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000005'::uuid,
  'sukanya-samriddhi-yojana',
  'Sukanya Samriddhi Yojana (SSY)',
  'High-interest small deposit scheme for girl child education and marriage with tax exemption.',
  'Government-backed savings scheme for girl children offering high compound interest rate (8.2%) and Section 80C tax exemption.',
  c.id,
  'Ministry of Finance, Government of India',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'PiggyBank',
  ARRAY['girl child', 'savings', 'tax exemption', 'sukanya samriddhi', 'post office'],
  '{"min_age": 0, "max_age": 10, "benefit_amount_inr": 150000}'::jsonb,
  'Parents or legal guardians of a girl child below 10 years of age (max 2 girl children per family).',
  'Open SSY Account at Bank / Post Office',
  'https://www.indiapost.gov.in/'
FROM public.categories c WHERE c.slug = 'finance'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

INSERT INTO public.knowledge_items (
  id, slug, title, short_description, description, category_id, authority_name, status, verification_status, icon, tags, metadata, eligibility_summary, action_label, action_url
)
SELECT
  'b1000000-0000-0000-0000-000000000006'::uuid,
  'mgnrega-job-guarantee',
  'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Scheme)',
  '100 days of guaranteed wage employment per year for adult members of rural households.',
  'Rights-based wage employment scheme providing at least 100 days of guaranteed manual work per financial year to rural households.',
  c.id,
  'Ministry of Rural Development, GoI',
  'PUBLISHED'::content_status,
  'VERIFIED'::verification_status,
  'Briefcase',
  ARRAY['mgnrega', 'rural employment', 'wage guarantee', 'job card'],
  '{"min_age": 18, "max_annual_income": 300000}'::jsonb,
  'Adult members (18+ years) of any rural household willing to do public work-related unskilled manual labor.',
  'Apply for MGNREGA Job Card',
  'https://nrega.nic.in/'
FROM public.categories c WHERE c.slug = 'employment'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;


-- 3. ELIGIBILITY RULE SETS & RULES
INSERT INTO public.eligibility_rule_sets (id, knowledge_item_id, name, description, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'PM-KISAN Rules', 'Standard landholding and income tax rules', true),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Ayushman Bharat Rules', 'SECC and state beneficiary criteria', true),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'CSSS Rules', 'Age, income, and merit percentage criteria', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.eligibility_rules (id, rule_set_id, rule_order, rule_type, conditions, explanation, is_required)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 1, 'AGE', '{"min_age": 18}'::jsonb, 'Applicant must be at least 18 years old.', true),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 1, 'INCOME', '{"max_annual_income_inr": 500000}'::jsonb, 'Household income must be under ₹5 Lakh per year.', true),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 1, 'STUDENT_STATUS', '{"is_student": true}'::jsonb, 'Must be enrolled as a student.', true)
ON CONFLICT (id) DO NOTHING;


-- 4. MILESTONES & MILESTONE KNOWLEDGE ITEMS
INSERT INTO public.milestones (id, slug, title, description, category_id, age_min, age_max, trigger_config, action_label, action_url, display_order, is_active)
SELECT
  'e1000000-0000-0000-0000-000000000001'::uuid,
  'turning-18-adult-citizenship',
  'Turning 18: Adult Citizen Registration',
  'Voter ID registration, PAN card application, driving license, and adult banking rights.',
  c.id,
  18, 19,
  '{"event": "BIRTHDAY_18"}'::jsonb,
  'View 18th Year Civic Checklist',
  '/milestones/turning-18',
  1, true
FROM public.categories c WHERE c.slug = 'identity'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

INSERT INTO public.milestones (id, slug, title, description, category_id, age_min, age_max, trigger_config, action_label, action_url, display_order, is_active)
SELECT
  'e1000000-0000-0000-0000-000000000002'::uuid,
  'higher-education-admissions',
  'Higher Education & College Admissions',
  'Explore degree admissions, merit scholarships, education loan subsidies, and student welfare.',
  c.id,
  17, 24,
  '{"event": "EDUCATION_COLLEGE"}'::jsonb,
  'Explore College Opportunities',
  '/milestones/college',
  2, true
FROM public.categories c WHERE c.slug = 'education'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

INSERT INTO public.milestones (id, slug, title, description, category_id, age_min, age_max, trigger_config, action_label, action_url, display_order, is_active)
SELECT
  'e1000000-0000-0000-0000-000000000003'::uuid,
  'entering-workforce-first-job',
  'Entering Workforce & Starting First Job',
  'EPF/UAN activation, income tax filing setup, labor law protections, and skill training.',
  c.id,
  21, 30,
  '{"event": "EMPLOYMENT_START"}'::jsonb,
  'View First Job Checklist',
  '/milestones/first-job',
  3, true
FROM public.categories c WHERE c.slug = 'employment'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

INSERT INTO public.milestones (id, slug, title, description, category_id, age_min, age_max, trigger_config, action_label, action_url, display_order, is_active)
SELECT
  'e1000000-0000-0000-0000-000000000004'::uuid,
  'senior-citizen-pension-benefits',
  'Senior Citizen Rights & Pension Benefits',
  'Indira Gandhi National Old Age Pension, Railway/Air concessions, Ayushman Vaya Vandana card, and tax rebates.',
  c.id,
  60, 100,
  '{"event": "AGE_60"}'::jsonb,
  'View Senior Citizen Benefits',
  '/milestones/senior-citizen',
  4, true
FROM public.categories c WHERE c.slug = 'social-welfare'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- LINK MILESTONES TO KNOWLEDGE ITEMS
INSERT INTO public.milestone_knowledge_items (milestone_id, knowledge_item_id, priority)
VALUES
  ('e1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 1),
  ('e1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 1)
ON CONFLICT (milestone_id, knowledge_item_id) DO NOTHING;


-- 5. LEGAL TOPICS & LEGAL SITUATIONS (KNOW YOUR RIGHTS)
INSERT INTO public.legal_topics (id, slug, title, category, plain_language_summary, applicable_acts)
VALUES
  (
    'f1000000-0000-0000-0000-000000000001',
    'financial-disputes-money-recovery',
    'Financial Disputes & Money Recovery',
    'financial_disputes',
    'Legal rights and procedures for recovering unpaid debts, friend loans, bounced cheques, and unauthorized bank deductions.',
    ARRAY['Negotiable Instruments Act 1881', 'Indian Contract Act 1872', 'Consumer Protection Act 2019']
  ),
  (
    'f1000000-0000-0000-0000-000000000002',
    'consumer-rights-defective-goods',
    'Consumer Rights & Defective Products',
    'consumer_rights',
    'Protections against defective products, unfair trade practices, non-fulfillment of warranty, and refusal of refunds.',
    ARRAY['Consumer Protection Act 2019', 'E-Commerce Rules 2020']
  ),
  (
    'f1000000-0000-0000-0000-000000000003',
    'tenancy-landlord-tenant-rights',
    'Tenancy & Tenant Rights',
    'tenancy_renting',
    'Rights regarding security deposit return, illegal eviction without notice, rent hikes, and property maintenance.',
    ARRAY['Model Tenancy Act 2021', 'State Rent Control Acts']
  ),
  (
    'f1000000-0000-0000-0000-000000000004',
    'cyber-fraud-online-cheating',
    'Cyber Fraud & UPI Online Scams',
    'cyber_fraud',
    'Action steps for reporting financial phishing, unauthorized UPI transactions, SIM swap fraud, and fake loan apps.',
    ARRAY['Information Technology Act 2000', 'RBI Fraud Reporting Circulars', 'Indian Penal Code / BNS']
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  plain_language_summary = EXCLUDED.plain_language_summary;

INSERT INTO public.legal_situations (
  id, topic_id, title, situation_patterns, legal_considerations, rights_granted, evidence_to_preserve, practical_steps, official_helplines, official_sources, disclaimer
)
VALUES
  (
    'f2000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'Unpaid Personal Loan to Friend or Relative',
    ARRAY['borrowed money', 'friend not returning money', 'unpaid personal loan', 'cheque bounce', 'hand loan'],
    ARRAY[
      'Written promissory note or chat record serves as enforceable contract under Indian Contract Act 1872.',
      'Cheque dishonor allows criminal proceedings under Section 138 of Negotiable Instruments Act within 30 days of notice.',
      'Statute of limitation for money recovery suit is 3 years from due date.'
    ],
    ARRAY[
      'Right to issue legal notice through advocate demanding repayment within 15 days.',
      'Right to file Summary Suit under Order 37 of Civil Procedure Code (CPC).',
      'Right to file criminal complaint if fraudulent intent existed at outset.'
    ],
    ARRAY[
      'Bank statement showing outgoing fund transfer / UPI transaction reference.',
      'WhatsApp/SMS messages acknowledging debt and promising repayment.',
      'Original dishonored cheque and bank return memo (if applicable).'
    ],
    '[{"step_number": 1, "action": "Send written reminder via registered post/WhatsApp requesting repayment date."}, {"step_number": 2, "action": "Issue formal legal notice via legal counsel giving 15 days notice period."}, {"step_number": 3, "action": "File summary suit or Section 138 complaint if unfulfilled."}]'::jsonb,
    '[{"name": "National Consumer Helpline", "phone": "1915"}, {"name": "Legal Aid Services Authority", "phone": "15100"}]'::jsonb,
    '[{"title": "Department of Justice - Legal Aid", "url": "https://doj.gov.in/"}]'::jsonb,
    'This information is for civic educational purposes and does not constitute formal legal counsel.'
  ),
  (
    'f2000000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000002',
    'Defective Product Sold & Store Refuses Refund',
    ARRAY['defective product', 'store refuses refund', 'damaged item', 'warranty claim rejected', 'bad product'],
    ARRAY[
      'Under Consumer Protection Act 2019, sellers and manufacturers are liable for product defects and service deficiency.',
      'E-commerce platforms must provide mandatory return/replacement policy disclosures.'
    ],
    ARRAY[
      'Right to full refund, replacement, or repair free of charge.',
      'Right to claim compensation for inconvenience and mental agony in Consumer Forum.'
    ],
    ARRAY[
      'Original purchase invoice or online order receipt.',
      'Photos/videos showing product defect or damage upon opening.',
      'Email communication with seller/customer support.'
    ],
    '[{"step_number": 1, "action": "Register complaint on National Consumer Helpline portal (NCH) or call 1915."}, {"step_number": 2, "action": "Send written notice to seller giving 7 days to resolve."}, {"step_number": 3, "action": "File online consumer grievance on e-Daakhil portal."}]'::jsonb,
    '[{"name": "National Consumer Helpline", "phone": "1915"}]'::jsonb,
    '[{"title": "e-Daakhil Consumer Grievance Portal", "url": "https://edaakhil.nic.in/"}]'::jsonb,
    'Educational information provided by Vayam.'
  )
ON CONFLICT (id) DO NOTHING;


-- 6. EDUCATION CAREERS & PATHWAYS
INSERT INTO public.education_careers (id, slug, title, category, short_description, icon, demand_level, avg_starting_salary_inr)
VALUES
  (
    'f3000000-0000-0000-0000-000000000001',
    'software-engineer-developer',
    'Software Engineer & Full Stack Developer',
    'Technology & IT',
    'Design, code, build, and deploy software applications, cloud services, and mobile applications.',
    'Code',
    'VERY_HIGH',
    600000.00
  ),
  (
    'f3000000-0000-0000-0000-000000000002',
    'civil-services-ias-ips',
    'Civil Services Officer (IAS / IPS / IFS)',
    'Public Administration & Government',
    'Serve in key administrative, law enforcement, and diplomatic leadership roles across central and state government departments.',
    'ShieldCheck',
    'HIGH',
    800000.00
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description;

INSERT INTO public.education_pathways (
  id, career_id, path_code, title, starting_education_level, required_stream, degree_qualification, duration_years, entrance_exams, key_skills, steps, alternative_routes
)
VALUES
  (
    'f4000000-0000-0000-0000-000000000001',
    'f3000000-0000-0000-0000-000000000001',
    'btech-computer-science',
    'Standard Engineering Route (B.Tech / B.E. in CS)',
    'secondary',
    'Science (PCM)',
    'B.Tech / B.E. in Computer Science or IT',
    4.0,
    ARRAY['JEE Main', 'JEE Advanced', 'MHT-CET', 'BITSAT'],
    ARRAY['Data Structures & Algorithms', 'JavaScript/TypeScript', 'Python', 'Database Design (SQL)', 'Git'],
    '[{"step_number": 1, "title": "Complete Class 12 with Physics, Chemistry & Math (min 75%)"}, {"step_number": 2, "title": "Appear for JEE Main / State Entrance Exams"}, {"step_number": 3, "title": "Complete 4-Year B.Tech Computer Science Degree"}, {"step_number": 4, "title": "Build Portfolio Projects & Secure Internships"}]'::jsonb,
    ARRAY['BCA -> MCA Degree Route', 'Self-taught Coding Bootcamp & Open Source Route']
  ),
  (
    'f4000000-0000-0000-0000-000000000002',
    'f3000000-0000-0000-0000-000000000002',
    'upsc-civil-services-route',
    'UPSC Civil Services Examination Route',
    'undergraduate',
    'Any Stream (Arts, Science, Commerce, Engineering)',
    'Bachelor Degree in any discipline from recognized university',
    3.0,
    ARRAY['UPSC Civil Services Examination (Prelims & Mains)'],
    ARRAY['General Studies', 'Public Policy Analysis', 'Indian Constitution', 'Essay Writing', 'Ethics'],
    '[{"step_number": 1, "title": "Complete Bachelor Degree in any discipline"}, {"step_number": 2, "title": "Prepare NCERT books and current affairs for 1-2 years"}, {"step_number": 3, "title": "Clear UPSC CSE Prelims Examination"}, {"step_number": 4, "title": "Clear UPSC CSE Mains & Personality Interview"}]'::jsonb,
    ARRAY['State Public Service Commission (State PSC / MPSC / UPPSC) Route']
  )
ON CONFLICT (id) DO NOTHING;
