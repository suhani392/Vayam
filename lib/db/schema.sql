-- ============================================================================
-- VAYAM CIVIC INTELLIGENCE ENGINE — DATABASE SCHEMA & INITIAL DATA
-- Database: Supabase PostgreSQL (Project: ihkyjgwggejoynmioemk)
-- Target: SQL Editor (https://supabase.com/dashboard/project/ihkyjgwggejoynmioemk/sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Citizen socio-economic profile indicators)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  state_code VARCHAR(10) NOT NULL DEFAULT 'MH',
  state_name TEXT NOT NULL DEFAULT 'Maharashtra',
  education_level TEXT NOT NULL DEFAULT 'secondary',
  employment_status TEXT NOT NULL DEFAULT 'student',
  annual_income_inr NUMERIC(12, 2) DEFAULT NULL,
  is_kisan BOOLEAN DEFAULT FALSE,
  is_pwd BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. KNOWLEDGE RECORDS TABLE (Verified Indian Government Knowledge Dataset)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_records (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_summary TEXT,
  authority_name TEXT NOT NULL,
  authority_level TEXT NOT NULL DEFAULT 'CENTRAL',
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
  last_verified DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. CIVIC NOTIFICATIONS TABLE (Proactive life milestone reminders)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.civic_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
  read BOOLEAN DEFAULT FALSE,
  target_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to knowledge records
DROP POLICY IF EXISTS "Allow public read access to knowledge records" ON public.knowledge_records;
CREATE POLICY "Allow public read access to knowledge records"
  ON public.knowledge_records FOR SELECT USING (true);

-- Allow public access for profile management
DROP POLICY IF EXISTS "Allow public full access to profiles" ON public.profiles;
CREATE POLICY "Allow public full access to profiles"
  ON public.profiles FOR ALL USING (true);

-- Allow public access for notifications
DROP POLICY IF EXISTS "Allow public full access to notifications" ON public.civic_notifications;
CREATE POLICY "Allow public full access to notifications"
  ON public.civic_notifications FOR ALL USING (true);

-- ----------------------------------------------------------------------------
-- 5. INITIAL SEED DATA (Canonical Government Knowledge Records)
-- ----------------------------------------------------------------------------
INSERT INTO public.knowledge_records (id, title, category, type, description, eligibility_summary, authority_name, authority_level, source_name, source_url, verification_status, last_verified)
VALUES
(
  'pm-usp-csss-scholarship',
  'PM-USP Central Sector Scheme of Scholarship for College and University Students',
  'education',
  'SCHOLARSHIP',
  'Financial assistance for meritorious students from low-income families pursuing higher education in colleges and universities.',
  'Class 12 passed above 80th percentile, annual household income below Rs 4,50,000.',
  'Department of Higher Education, Ministry of Education',
  'CENTRAL',
  'National Scholarship Portal (NSP)',
  'https://scholarships.gov.in',
  'VERIFIED',
  '2026-02-01'
),
(
  'nmmss-merit-scholarship',
  'National Means-cum-Merit Scholarship Scheme (NMMSS)',
  'education',
  'SCHOLARSHIP',
  'Scholarship to arrest dropout rate of meritorious students at class VIII and encourage them to continue study at secondary stage.',
  'Class 8 passed with minimum 55% marks, parental annual income not exceeding Rs 3,50,000.',
  'Department of School Education & Literacy, Ministry of Education',
  'CENTRAL',
  'National Scholarship Portal (NSP)',
  'https://scholarships.gov.in',
  'VERIFIED',
  '2026-01-15'
),
(
  'nvsp-voter-portal',
  'Election Commission of India — Voter Registration Portal (NVSP)',
  'rights',
  'SERVICE',
  'Official portal for Indian citizens to apply for new voter ID card (Form 6), update address, or track electoral roll status.',
  'Indian citizen who has reached age 18 years on or before qualifying date.',
  'Election Commission of India (ECI)',
  'CENTRAL',
  'National Voters Service Portal',
  'https://voters.eci.gov.in',
  'VERIFIED',
  '2026-02-05'
),
(
  'sarathi-driving-licence',
  'Parivahan Sarathi — Learner and Driving Licence Application',
  'services',
  'SERVICE',
  'Online application portal for issuance of Learner Licence and Permanent Motor Vehicle Driving Licence across Indian RTOs.',
  'Age 18+ years for light motor vehicles; medical fitness certificate.',
  'Ministry of Road Transport and Highways (MoRTH)',
  'CENTRAL',
  'Parivahan Sewa Portal',
  'https://sarathi.parivahan.gov.in',
  'VERIFIED',
  '2026-01-20'
),
(
  'pm-kisan-scheme',
  'PM-KISAN Pradhan Mantri Kisan Samman Nidhi',
  'agriculture',
  'SCHEME',
  'Income support scheme of Rs 6,000 per year in three equal installments to all landholding farmer families across India.',
  'Landholding farmer family with valid land records; e-KYC verified; excluded institutional landholders.',
  'Ministry of Agriculture & Farmers Welfare',
  'CENTRAL',
  'PM-KISAN Official Portal',
  'https://pmkisan.gov.in',
  'VERIFIED',
  '2026-02-01'
),
(
  'pm-internship-scheme',
  'PM Internship Scheme in Top 500 Companies',
  'education',
  'SCHEME',
  '12-month internship opportunities for youth in top 500 companies with monthly stipend of Rs 5,000 and one-time assistance of Rs 6,000.',
  'Age 21-24 years, passed Class 10/12/Diploma/ITI/Degree, not currently in full-time employment.',
  'Ministry of Corporate Affairs (MCA)',
  'CENTRAL',
  'PM Internship Portal',
  'https://pminternship.mca.gov.in',
  'VERIFIED',
  '2026-02-02'
),
(
  'ignoaps-pension-scheme',
  'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
  'pension',
  'SCHEME',
  'Monthly social security pension for senior citizens belonging to Below Poverty Line (BPL) households.',
  'Age 60 years and above belonging to BPL household as per state guidelines.',
  'Ministry of Rural Development',
  'CENTRAL',
  'NSAP Portal',
  'https://nsap.nic.in',
  'VERIFIED',
  '2026-01-10'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  source_url = EXCLUDED.source_url,
  verification_status = EXCLUDED.verification_status,
  last_verified = EXCLUDED.last_verified;
