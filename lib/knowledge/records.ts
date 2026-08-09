/**
 * lib/knowledge/records.ts
 *
 * Official Vayam Real Verified Knowledge Dataset (Phase 6C).
 * Contains 25 structured, canonical Indian government knowledge records across Education,
 * Services, Finance, Benefits, Rights, and Career.
 *
 * Rules:
 * - Zero fabricated URLs, rules, or scheme names.
 * - Records supported by official guidelines are marked VERIFIED with lastVerified "2026-08-09".
 * - Records with ambiguous or state-dependent variations are marked REQUIRES_REVIEW.
 */

import type { KnowledgeRecord } from "./types";

export const KNOWLEDGE_RECORDS: KnowledgeRecord[] = [
  // =========================================================================
  // CATEGORY: EDUCATION (5 Records)
  // =========================================================================

  {
    id: "pm-usp-csss-scholarship",
    type: "SCHOLARSHIP",
    title: "PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)",
    shortDescription: "Financial assistance for meritorious students from low-income families pursuing regular higher education courses.",
    fullDescription: "Central sector scholarship provided by the Ministry of Education to meritorious students who are above the 80th percentile in Class XII board exams and pursuing regular college or university courses.",
    category: "education",
    keywords: ["csss", "pm-usp", "scholarship", "ministry of education", "higher education", "merit", "college"],
    authority: {
      name: "Ministry of Education, Government of India",
      level: "CENTRAL",
      department: "Department of Higher Education",
    },
    minAge: 17,
    maxAge: 25,
    eligibleEducationLevels: ["undergraduate", "postgraduate"],
    eligibleEmploymentStatuses: ["student"],
    maxAnnualIncomeInr: 450000,
    benefits: [
      "₹12,000 per annum at graduation level for first 3 years",
      "₹20,000 per annum at post-graduation level",
    ],
    benefitAmountInr: 12000,
    application: {
      method: "ONLINE",
      officialUrl: "https://www.education.gov.in/",
      portalName: "National Scholarship Portal (NSP)",
      steps: [
        "Register on National Scholarship Portal with Aadhaar/One-Time Password",
        "Select PM-USP CSSS scheme and enter Class XII roll number and board name",
        "Upload income certificate and bank passbook details",
        "Submit online application for institute verification",
      ],
      documentsRequired: [
        { id: "doc-c12", name: "Class XII Marksheet / Board Pass Certificate", required: true },
        { id: "doc-inc", name: "Family Income Certificate (below ₹4.5 Lakh/year)", required: true },
        { id: "doc-aadh", name: "Aadhaar Card / Aadhaar Enrolment ID", required: true },
        { id: "doc-bank", name: "Bank Account Passbook (Linked with Aadhaar)", required: true },
      ],
    },
    timing: {
      deadline: "2026-10-31",
      deadlineType: "RECURRING",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Department of Higher Education, Ministry of Education, GoI",
      url: "https://www.education.gov.in/",
      authority: "Ministry of Education",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "nmmss-merit-scholarship",
    type: "SCHOLARSHIP",
    title: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    shortDescription: "Centrally sponsored scholarship awarded to meritorious students of economically weaker sections to arrest dropout at Class VIII.",
    fullDescription: "Provides financial incentive to eligible secondary school students studying in government and government-aided schools to continue their education up to Class XII.",
    category: "education",
    keywords: ["nmmss", "merit scholarship", "class 8", "ministry of education", "school education"],
    authority: {
      name: "Ministry of Education, Government of India",
      level: "CENTRAL",
      department: "Department of School Education and Literacy",
    },
    minAge: 12,
    maxAge: 16,
    eligibleEducationLevels: ["secondary"],
    eligibleEmploymentStatuses: ["student"],
    benefits: [
      "₹12,000 per annum (₹1,000 per month) for Classes IX to XII",
    ],
    benefitAmountInr: 12000,
    application: {
      method: "ONLINE",
      officialUrl: "https://www.education.gov.in/",
      portalName: "National Scholarship Portal (NSP)",
      documentsRequired: [
        { id: "doc-inc", name: "Income Certificate issued by Competent Authority", required: true },
        { id: "doc-mark", name: "Class VII / VIII Marksheet", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Department of School Education & Literacy, Ministry of Education",
      url: "https://www.education.gov.in/",
      authority: "Ministry of Education",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "REQUIRES_REVIEW", // Marked review due to state quota & selection test variance
    },
    status: "ACTIVE",
  },

  {
    id: "mh-open-merit-junior-college",
    type: "SCHOLARSHIP",
    title: "Open Merit Scholarships in Junior College",
    shortDescription: "State scholarship awarded by Maharashtra Directorate of Higher Education to SSC top scorers entering Junior College (Classes 11–12).",
    fullDescription: "Government of Maharashtra scholarship providing merit awards to students scoring 60% or above in SSC exams on their first attempt.",
    category: "education",
    keywords: ["mahadbt", "junior college", "open merit", "class 11", "class 12", "maharashtra", "ssc"],
    authority: {
      name: "Directorate of Higher Education, Govt of Maharashtra",
      level: "STATE",
      department: "Higher Education Department",
      stateCode: "MH",
    },
    minAge: 15,
    maxAge: 19,
    eligibleEducationLevels: ["higher_secondary"],
    eligibleEmploymentStatuses: ["student"],
    benefits: [
      "₹50 per month (₹500 per academic year) for 10 months in Classes 11 and 12",
    ],
    benefitAmountInr: 500,
    application: {
      method: "ONLINE",
      officialUrl: "https://mahadbt.maharashtra.gov.in/",
      portalName: "MahaDBT State Portal",
      steps: [
        "Register on MahaDBT portal",
        "Fill DHE Open Merit Junior College application",
        "Upload SSC Marksheet and college admission receipt",
      ],
      documentsRequired: [
        { id: "doc-ssc", name: "SSC Marksheet (Minimum 60% marks in first attempt)", required: true },
        { id: "doc-adm", name: "Junior College Admission Receipt", required: true },
        { id: "doc-dom", name: "Domicile Certificate of Maharashtra", required: true },
      ],
    },
    timing: {
      deadline: "2026-10-31",
      deadlineType: "FIXED_DATE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "MahaDBT Portal, Government of Maharashtra",
      url: "https://mahadbt.maharashtra.gov.in/",
      authority: "Government of Maharashtra",
      sourceType: "OFFICIAL_STATE_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "mh-state-open-merit-degree",
    type: "SCHOLARSHIP",
    title: "State Government Open Merit Scholarship",
    shortDescription: "Scholarship for meritorious Maharashtra students studying undergraduate degree courses in Arts, Commerce, Science, or Law.",
    fullDescription: "State merit scholarship awarded to Maharashtra domicile students securing at least 60% in Class 12 exams and pursuing degree courses.",
    category: "education",
    keywords: ["open merit", "mahadbt", "degree", "undergraduate", "maharashtra", "dhe"],
    authority: {
      name: "Directorate of Higher Education, Govt of Maharashtra",
      level: "STATE",
      department: "Higher Education Department",
      stateCode: "MH",
    },
    minAge: 17,
    maxAge: 25,
    eligibleEducationLevels: ["undergraduate"],
    eligibleEmploymentStatuses: ["student"],
    benefits: [
      "₹100 per month (₹1,000 per academic year) for duration of degree course",
    ],
    benefitAmountInr: 1000,
    application: {
      method: "ONLINE",
      officialUrl: "https://mahadbt.maharashtra.gov.in/",
      portalName: "MahaDBT State Portal",
      documentsRequired: [
        { id: "doc-hsc", name: "HSC / Class 12 Marksheet (Minimum 60%)", required: true },
        { id: "doc-dom", name: "Maharashtra Domicile Certificate", required: true },
        { id: "doc-bon", name: "College Bonafide Certificate", required: true },
      ],
    },
    timing: {
      deadline: "2026-10-31",
      deadlineType: "FIXED_DATE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "MahaDBT Portal, Government of Maharashtra",
      url: "https://mahadbt.maharashtra.gov.in/",
      authority: "Government of Maharashtra",
      sourceType: "OFFICIAL_STATE_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "mh-rajarshi-shahu-reimbursement",
    type: "SCHOLARSHIP",
    title: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Scheme",
    shortDescription: "50% tuition and exam fee reimbursement for economically backward class (EBC) students in Maharashtra higher education.",
    fullDescription: "Maharashtra state welfare scheme providing tuition fee subsidy to EBC students with annual family income up to ₹8 Lakh pursuing recognized degree/diploma courses.",
    category: "education",
    keywords: ["ebc", "shahu maharaj", "fee reimbursement", "mahadbt", "higher education", "maharashtra"],
    authority: {
      name: "Directorate of Higher Education, Govt of Maharashtra",
      level: "STATE",
      department: "Higher Education Department",
      stateCode: "MH",
    },
    minAge: 17,
    maxAge: 30,
    eligibleEducationLevels: ["undergraduate", "postgraduate", "diploma"],
    eligibleEmploymentStatuses: ["student"],
    maxAnnualIncomeInr: 800000,
    benefits: [
      "50% reimbursement of tuition fees and examination fees",
    ],
    benefitAmountInr: 30000,
    application: {
      method: "ONLINE",
      officialUrl: "https://mahadbt.maharashtra.gov.in/",
      portalName: "MahaDBT State Portal",
      documentsRequired: [
        { id: "doc-inc", name: "Income Certificate issued by Tehsildar (up to ₹8 Lakh)", required: true },
        { id: "doc-dom", name: "Domicile Certificate of Maharashtra", required: true },
        { id: "doc-cap", name: "CAP Allotment Letter (for professional courses)", required: true },
      ],
    },
    timing: {
      deadline: "2026-10-31",
      deadlineType: "FIXED_DATE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "MahaDBT Portal, Government of Maharashtra",
      url: "https://mahadbt.maharashtra.gov.in/",
      authority: "Government of Maharashtra",
      sourceType: "OFFICIAL_STATE_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  // =========================================================================
  // CATEGORY: SERVICES (5 Records)
  // =========================================================================

  {
    id: "morth-learners-licence",
    type: "SERVICE",
    title: "Apply for Learner's Driving Licence",
    shortDescription: "Online application service for obtaining a Learner's Driving Licence (LL) for motor vehicles via Parivahan Sarathi.",
    fullDescription: "Official Sarathi service under Ministry of Road Transport and Highways enabling citizens aged 16+ (for gearless 50cc) or 18+ (for light motor vehicles) to apply and take online LL tests.",
    category: "services",
    keywords: ["learner licence", "parivahan", "driving licence", "morth", "rto", "sarathi"],
    authority: {
      name: "Ministry of Road Transport and Highways (MoRTH)",
      level: "CENTRAL",
      department: "Road Transport Division",
    },
    minAge: 16,
    maxAge: 80,
    benefits: [
      "Official 6-month valid Learner's Driving Licence",
      "Online contactless test facility in participating states",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://parivahan.gov.in/",
      portalName: "Parivahan Sarathi Portal",
      steps: [
        "Select State on Parivahan Sarathi website",
        "Fill LL application form and upload DOB & address proof",
        "Pay application fee online and book/take online LL test slot",
      ],
      documentsRequired: [
        { id: "doc-dob", name: "Proof of Date of Birth (Aadhaar / School Certificate / Birth Cert)", required: true },
        { id: "doc-addr", name: "Proof of Address (Aadhaar / Passport / Utility Bill)", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: false,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of Road Transport and Highways (MoRTH)",
      url: "https://parivahan.gov.in/",
      authority: "Ministry of Road Transport and Highways",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "morth-permanent-driving-licence",
    type: "SERVICE",
    title: "Apply for Permanent Driving Licence",
    shortDescription: "Service for booking RTO driving test slot and obtaining a permanent Driving Licence after holding a Learner's Licence for 30 days.",
    fullDescription: "Official Parivahan service for citizens holding a valid Learner's Licence for at least 30 days to apply for a permanent Driving Licence.",
    category: "services",
    keywords: ["driving licence", "dl test", "parivahan", "rto", "sarathi", "morth"],
    authority: {
      name: "Ministry of Road Transport and Highways (MoRTH)",
      level: "CENTRAL",
      department: "Road Transport Division",
    },
    minAge: 18,
    maxAge: 80,
    benefits: [
      "Official Smart-card Permanent Driving Licence valid nationwide",
    ],
    application: {
      method: "BOTH",
      officialUrl: "https://parivahan.gov.in/",
      portalName: "Parivahan Sarathi Portal",
      steps: [
        "Log in with Learner's Licence Number on Sarathi portal",
        "Book physical driving test slot at designated RTO track",
        "Appear for driving skill test with vehicle",
      ],
      documentsRequired: [
        { id: "doc-ll", name: "Valid Learner's Licence (held for minimum 30 days)", required: true },
        { id: "doc-veh", name: "Vehicle documents & insurance for test", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: false,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of Road Transport and Highways (MoRTH)",
      url: "https://parivahan.gov.in/",
      authority: "Ministry of Road Transport and Highways",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "eci-voter-form6-service",
    type: "SERVICE",
    title: "New Voter Registration — Form 6",
    shortDescription: "Official Election Commission of India service for registering new voters who have attained or are attaining 18 years of age.",
    fullDescription: "Application under Form 6 for inclusion of name in the Electoral Roll for first-time electors in India.",
    category: "rights",
    keywords: ["voter registration", "form 6", "eci", "voters portal", "elector", "epic"],
    authority: {
      name: "Election Commission of India",
      level: "CENTRAL",
      department: "Election Commission of India",
    },
    minAge: 18,
    maxAge: 100,
    benefits: [
      "Inclusion in National Electoral Roll & issue of e-EPIC / Voter ID Card",
      "Constitutional right to vote in parliamentary and assembly elections",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://voters.eci.gov.in/",
      portalName: "ECI Voters' Services Portal",
      steps: [
        "Sign up on Voters' Services Portal with mobile number",
        "Fill Form 6 details with personal info and assembly constituency",
        "Upload DOB proof and address proof",
        "Track application status using reference ID",
      ],
      documentsRequired: [
        { id: "doc-dob", name: "Date of Birth Proof (Aadhaar / Passport / Birth Cert)", required: true },
        { id: "doc-addr", name: "Address Proof (Utility Bill / Bank Passbook / Rent Agreement)", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Election Commission of India (ECI)",
      url: "https://voters.eci.gov.in/",
      authority: "Election Commission of India",
      sourceType: "OFFICIAL_AUTHORITY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "incometax-pan-application",
    type: "SERVICE",
    title: "Apply for Permanent Account Number (PAN)",
    shortDescription: "Online issuance of 10-digit alphanumeric Permanent Account Number (PAN) Card for financial and tax identification.",
    fullDescription: "Official Income Tax Department service via Protean/NSDL or UTIITSL for issuing Instant e-PAN or physical PAN card.",
    category: "services",
    keywords: ["pan card", "income tax", "nsdl", "e-pan", "tax", "finance"],
    authority: {
      name: "Income Tax Department, Government of India",
      level: "CENTRAL",
      department: "Central Board of Direct Taxes (CBDT)",
    },
    benefits: [
      "Official 10-digit PAN Card / Instant e-PAN",
      "Mandatory document for opening bank accounts and filing tax returns",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://www.tin-nsdl.com/",
      portalName: "Protean TIN-NSDL Portal",
      steps: [
        "Visit Protean TIN-NSDL or Income Tax e-Filing portal",
        "Select Form 49A (for Indian citizens)",
        "Authenticate using Aadhaar e-KYC or upload documents",
        "Pay processing fee and download e-PAN",
      ],
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card (for Aadhaar-based Instant e-PAN)", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: false,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Income Tax Department & Protean TIN-NSDL",
      url: "https://www.tin-nsdl.com/",
      authority: "Income Tax Department",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "passport-seva-application",
    type: "SERVICE",
    title: "Passport Application Service",
    shortDescription: "Online passport application and appointment booking service through Passport Seva Kendra (PSK).",
    fullDescription: "Official Ministry of External Affairs service for issuing Ordinary, Tatkaal, or Minor Indian Passports.",
    category: "services",
    keywords: ["passport", "passport seva", "mea", "travel", "identity"],
    authority: {
      name: "Ministry of External Affairs (MEA), Government of India",
      level: "CENTRAL",
      department: "Consular, Passport & Visa Division",
    },
    benefits: [
      "Official Indian Passport valid for international travel & identity proof",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://www.passportindia.gov.in/",
      portalName: "Passport Seva Portal",
      steps: [
        "Register on Passport Seva Portal and select nearest PSK/POPSK",
        "Fill online application form and pay fee",
        "Book appointment slot and visit PSK for document verification & biometrics",
      ],
      documentsRequired: [
        { id: "doc-proof", name: "Proof of Date of Birth & Address (Aadhaar / Voter ID)", required: true },
        { id: "doc-nonecr", name: "Non-ECR proof (Class 10 Pass Certificate, if applicable)", required: false },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: false,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Passport Seva, Ministry of External Affairs",
      url: "https://www.passportindia.gov.in/",
      authority: "Ministry of External Affairs",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  // =========================================================================
  // CATEGORY: FINANCE (4 Records)
  // =========================================================================

  {
    id: "pmjdy-jan-dhan-yojana",
    type: "FINANCIAL_SUPPORT",
    title: "Pradhan Mantri Jan-Dhan Yojana (PMJDY)",
    shortDescription: "National mission for financial inclusion providing zero-balance basic savings bank accounts with RuPay debit card and DBT support.",
    fullDescription: "Government of India flagship financial inclusion scheme ensuring access to financial services like basic savings account, remittance, credit, insurance, and pension.",
    category: "finance",
    keywords: ["pmjdy", "jan dhan", "bank account", "rupay", "financial inclusion", "dbt"],
    authority: {
      name: "Department of Financial Services, Ministry of Finance",
      level: "CENTRAL",
      department: "Department of Financial Services",
    },
    minAge: 10,
    benefits: [
      "Zero-balance basic savings bank account (BSBDA)",
      "Free RuPay debit card with ₹2 Lakh accidental insurance cover",
      "Overdraft facility up to ₹10,000 for eligible account holders",
    ],
    application: {
      method: "BOTH",
      officialUrl: "https://pmjdy.gov.in/",
      portalName: "PMJDY Official Portal",
      steps: [
        "Visit any commercial bank branch or Bank Mitra (CSP)",
        "Fill PMJDY account opening form",
        "Submit Aadhaar / official valid document for e-KYC",
      ],
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card / Voter ID / Driving Licence", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Department of Financial Services, Ministry of Finance",
      url: "https://pmjdy.gov.in/",
      authority: "Ministry of Finance",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "pmmy-mudra-yojana",
    type: "FINANCIAL_SUPPORT",
    title: "Pradhan Mantri MUDRA Yojana (PMMY)",
    shortDescription: "Collateral-free business loans up to ₹20 Lakh for non-corporate, non-farm small and micro enterprises.",
    fullDescription: "Micro Units Development and Refinance Agency (MUDRA) scheme providing business loans under Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L), and Tarun Plus (₹10L-₹20L) categories.",
    category: "finance",
    keywords: ["mudra", "business loan", "micro enterprise", "shishu", "kishore", "tarun", "pmmy"],
    authority: {
      name: "MUDRA Ltd / Department of Financial Services",
      level: "CENTRAL",
      department: "Ministry of Finance",
    },
    minAge: 18,
    maxAge: 65,
    eligibleEmploymentStatuses: ["self_employed", "unemployed"],
    benefits: [
      "Collateral-free business loans up to ₹20 Lakh",
      "MUDRA Card for working capital drawdown",
    ],
    benefitAmountInr: 2000000,
    application: {
      method: "BOTH",
      officialUrl: "https://www.mudra.org.in/",
      portalName: "Udyamimitra / MUDRA Portal",
      documentsRequired: [
        { id: "doc-id", name: "Proof of Identity & Business Address", required: true },
        { id: "doc-plan", name: "Business Plan / Quotations for machinery", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "MUDRA Ltd, Ministry of Finance",
      url: "https://www.mudra.org.in/",
      authority: "Ministry of Finance",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "apy-atal-pension-yojana",
    type: "FINANCIAL_SUPPORT",
    title: "Atal Pension Yojana (APY)",
    shortDescription: "Guaranteed monthly pension scheme of ₹1,000 to ₹5,000 per month for unorganized sector workers aged 18 to 40 years.",
    fullDescription: "Government guaranteed pension scheme administered by PFRDA ensuring minimum monthly pension starting at age 60 based on contribution.",
    category: "finance",
    keywords: ["apy", "atal pension", "pension", "pfrda", "unorganized sector", "retirement"],
    authority: {
      name: "Pension Fund Regulatory and Development Authority (PFRDA)",
      level: "CENTRAL",
      department: "Department of Financial Services",
    },
    minAge: 18,
    maxAge: 40,
    benefits: [
      "Guaranteed monthly pension between ₹1,000 and ₹5,000 from age 60",
      "Spouse pension continuation upon subscriber's death",
    ],
    benefitAmountInr: 60000,
    application: {
      method: "BOTH",
      officialUrl: "https://www.npscra.nsdl.co.in/",
      portalName: "NPS Cra / APY Portal",
      steps: [
        "Visit your bank branch where savings account is held",
        "Fill APY registration form with auto-debit consent",
        "Choose monthly pension target (₹1,000 to ₹5,000)",
      ],
      documentsRequired: [
        { id: "doc-bank", name: "Savings Bank Account details & Aadhaar", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "PFRDA / Ministry of Finance, GoI",
      url: "https://www.npscra.nsdl.co.in/",
      authority: "PFRDA",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "pm-vishwakarma-scheme",
    type: "FINANCIAL_SUPPORT",
    title: "PM Vishwakarma Scheme",
    shortDescription: "End-to-end support for traditional artisans and craftspeople including recognition, skill training, toolkits, and collateral-free credit.",
    fullDescription: "Central sector scheme for traditional artisans across 18 trades providing PM Vishwakarma Certificate, ₹15,000 toolkit incentive, and collateral-free credit up to ₹3 Lakh at 5% interest.",
    category: "finance",
    keywords: ["vishwakarma", "artisans", "craftspeople", "msme", "toolkit", "credit"],
    authority: {
      name: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      level: "CENTRAL",
      department: "Ministry of MSME",
    },
    minAge: 18,
    eligibleEmploymentStatuses: ["self_employed"],
    benefits: [
      "PM Vishwakarma Certificate & ID Card",
      "₹15,000 E-Voucher for modern toolkits",
      "Collateral-free credit up to ₹3 Lakh (Tranche 1: ₹1L, Tranche 2: ₹2L) at 5% interest",
    ],
    benefitAmountInr: 300000,
    application: {
      method: "ONLINE",
      officialUrl: "https://pmvishwakarma.gov.in/",
      portalName: "PM Vishwakarma Official Portal",
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card & mobile number linked", required: true },
        { id: "doc-bank", name: "Bank Account Passbook", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of MSME, Government of India",
      url: "https://pmvishwakarma.gov.in/",
      authority: "Ministry of MSME",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "REQUIRES_REVIEW", // Trade-specific eligibility list requires review
    },
    status: "ACTIVE",
  },

  // =========================================================================
  // CATEGORY: BENEFITS (4 Records)
  // =========================================================================

  {
    id: "pm-kisan-scheme",
    type: "FINANCIAL_SUPPORT",
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortDescription: "Income support of ₹6,000 per year in three equal instalments to landholding farmer families across India.",
    fullDescription: "Central Sector Scheme providing direct income support of ₹6,000 annually to landholding farmers subject to official exclusion criteria and mandatory eKYC.",
    category: "finance",
    keywords: ["pm-kisan", "farmer", "agriculture", "direct benefit transfer", "dbt"],
    authority: {
      name: "Department of Agriculture & Farmers Welfare, GoI",
      level: "CENTRAL",
      department: "Ministry of Agriculture and Farmers Welfare",
    },
    minAge: 18,
    maxAge: 75,
    maxAnnualIncomeInr: 800000,
    benefits: [
      "₹6,000 annual direct benefit transfer in 3 installments of ₹2,000",
    ],
    benefitAmountInr: 6000,
    application: {
      method: "BOTH",
      officialUrl: "https://pmkisan.gov.in/",
      portalName: "PM-KISAN Portal",
      steps: [
        "Register online via Farmers Corner on PM-KISAN portal or visit CSC",
        "Complete mandatory OTP/Biometric eKYC",
        "Upload land holding record details for verification by State Nodal Officer",
      ],
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card (Mandatory for eKYC)", required: true },
        { id: "doc-land", name: "Landholding ownership document (Khatauni/Record of Rights)", required: true },
        { id: "doc-bank", name: "Bank Account Passbook", required: true },
      ],
    },
    timing: {
      deadline: "2026-08-31",
      deadlineType: "RECURRING",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Department of Agriculture & Farmers Welfare, GoI",
      url: "https://pmkisan.gov.in/",
      authority: "Ministry of Agriculture",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "pmay-u-2-housing-scheme",
    type: "SCHEME",
    title: "Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U 2.0)",
    shortDescription: "Central scheme providing financial assistance to EWS/LIG/MIG urban families for building or purchasing a pucca house.",
    fullDescription: "PMAY-U 2.0 scheme under MoHUA assisting eligible urban households without a pucca house anywhere in India with interest subsidies or direct construction assistance.",
    category: "benefits",
    keywords: ["pmay-u", "pmay", "housing", "urban housing", "pucca house", "mohua"],
    authority: {
      name: "Ministry of Housing and Urban Affairs (MoHUA)",
      level: "CENTRAL",
      department: "Housing for All Division",
    },
    minAge: 18,
    benefits: [
      "Financial assistance up to ₹2.5 Lakh for house construction/purchase",
      "Interest subsidy on housing loans for eligible income groups",
    ],
    benefitAmountInr: 250000,
    application: {
      method: "ONLINE",
      officialUrl: "https://pmay-urban.gov.in/",
      portalName: "PMAY-U Portal",
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card of all family members", required: true },
        { id: "doc-inc", name: "Income Certificate / Proof of income", required: true },
        { id: "doc-house", name: "Affidavit confirming no pucca house in India", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of Housing and Urban Affairs (MoHUA)",
      url: "https://pmay-urban.gov.in/",
      authority: "Ministry of Housing and Urban Affairs",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "pmmvy-maternity-benefit",
    type: "SCHEME",
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY 2.0)",
    shortDescription: "Maternity benefit scheme providing direct cash assistance of ₹5,000 for the first living child and ₹6,000 for a second girl child.",
    fullDescription: "Centrally sponsored maternity benefit scheme under Ministry of Women and Child Development promoting health-seeking behavior and nutrition among pregnant women and lactating mothers.",
    category: "benefits",
    keywords: ["pmmvy", "maternity", "pregnant", "women", "wcd", "cash incentive"],
    authority: {
      name: "Ministry of Women and Child Development (MWCD)",
      level: "CENTRAL",
      department: "MWCD",
    },
    eligibleGenders: ["female"],
    benefits: [
      "₹5,000 in two installments for the first living child",
      "₹6,000 in single installment for the second child (if girl)",
    ],
    benefitAmountInr: 6000,
    application: {
      method: "BOTH",
      officialUrl: "https://pmmvy.gov.in/",
      portalName: "PMMVY Citizen Portal",
      steps: [
        "Register on PMMVY portal or via Anganwadi Worker (AWW) / ASHA",
        "Submit Mother and Child Protection (MCP) Card details",
      ],
      documentsRequired: [
        { id: "doc-mcp", name: "Mother and Child Protection (MCP) Card", required: true },
        { id: "doc-aadh", name: "Aadhaar Card of Mother", required: true },
        { id: "doc-bank", name: "Aadhaar-seeded Bank Account Passbook", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of Women and Child Development (MWCD)",
      url: "https://pmmvy.gov.in/",
      authority: "Ministry of Women and Child Development",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "ignaps-senior-pension",
    type: "SCHEME",
    title: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    shortDescription: "Monthly financial pension for senior citizens aged 60+ belonging to below poverty line (BPL) households.",
    fullDescription: "Central pension scheme under NSAP providing financial support to elderly citizens living below the poverty line (BPL). Central contribution: ₹200/month (ages 60-79) and ₹500/month (age 80+), supplemented by state funds.",
    category: "benefits",
    keywords: ["ignaps", "senior citizen", "pension", "nsap", "bpl", "old age"],
    authority: {
      name: "Ministry of Rural Development / NSAP",
      level: "CENTRAL",
      department: "National Social Assistance Programme",
    },
    minAge: 60,
    maxAge: 100,
    maxAnnualIncomeInr: 120000,
    benefits: [
      "Monthly pension of ₹1,000 to ₹1,500 transferred directly to bank account (Central + State combined)",
    ],
    benefitAmountInr: 18000,
    application: {
      method: "BOTH",
      officialUrl: "https://nsap.nic.in/",
      portalName: "NSAP Official Portal",
      documentsRequired: [
        { id: "doc-age", name: "Proof of Age (Aadhaar / Voter ID / Birth Certificate)", required: true },
        { id: "doc-bpl", name: "BPL Ration Card / Household BPL Certificate", required: true },
        { id: "doc-bank", name: "Aadhaar-linked Bank Account Passbook", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "National Social Assistance Programme (NSAP), Ministry of Rural Development",
      url: "https://nsap.nic.in/",
      authority: "Ministry of Rural Development",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  // =========================================================================
  // CATEGORY: RIGHTS (4 Records)
  // =========================================================================

  {
    id: "rti-right-to-information",
    type: "RIGHT",
    title: "Right to Information (RTI) Framework",
    shortDescription: "Constitutional and statutory right allowing Indian citizens to request information from public authorities.",
    fullDescription: "Under the Right to Information Act 2005, citizens can submit RTI applications to any public authority to inspect government records, work, and obtain certified copies.",
    category: "rights",
    keywords: ["rti", "right to information", "dopt", "transparency", "governance", "public authority"],
    authority: {
      name: "Department of Personnel and Training (DoPT), GoI",
      level: "CENTRAL",
      department: "DoPT",
    },
    minAge: 18,
    benefits: [
      "Statutory right to receive requested information within 30 days",
      "Online RTI application and first appeal facility for Central Ministries",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://rtionline.gov.in/",
      portalName: "RTI Online Portal",
      steps: [
        "Visit RTI Online portal and click Submit Request",
        "Select Public Authority (Ministry/Department)",
        "Type application text and pay nominal ₹10 fee online",
      ],
      documentsRequired: [],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "RTI Online, DoPT, Government of India",
      url: "https://rtionline.gov.in/",
      authority: "Department of Personnel and Training",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "free-legal-aid-nalsa",
    type: "RIGHT",
    title: "Free Legal Aid Services (NALSA)",
    shortDescription: "Free legal services and court representation for women, children, SC/ST, custody persons, and eligible low-income citizens.",
    fullDescription: "Under Legal Services Authorities Act 1987, NALSA and State Legal Services Authorities (SLSA) provide free advocate representation and legal assistance to eligible citizens.",
    category: "rights",
    keywords: ["legal aid", "nalsa", "free lawyer", "justice", "rights", "slsa"],
    authority: {
      name: "National Legal Services Authority (NALSA)",
      level: "STATUTORY",
      department: "NALSA",
    },
    benefits: [
      "Free lawyer representation in court proceedings",
      "Exemption from court fees and legal process expenses",
    ],
    application: {
      method: "BOTH",
      officialUrl: "https://nalsa.gov.in/",
      portalName: "NALSA Official Portal",
      documentsRequired: [
        { id: "doc-id", name: "Proof of Identity", required: true },
        { id: "doc-elig", name: "Category proof (Income certificate / SC/ST cert / Gender)", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "National Legal Services Authority (NALSA)",
      url: "https://nalsa.gov.in/",
      authority: "National Legal Services Authority",
      sourceType: "OFFICIAL_AUTHORITY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "cybercrime-reporting-helpline",
    type: "RIGHT",
    title: "National Cyber Crime Reporting & Helpline 1930",
    shortDescription: "Official citizen portal and emergency helpline 1930 for reporting cyber fraud, financial scams, and cyber crimes.",
    fullDescription: "Initiative of Ministry of Home Affairs (I4C) enabling immediate reporting of financial cyber fraud to freeze stolen funds, and reporting cyber offenses.",
    category: "rights",
    keywords: ["cybercrime", "helpline 1930", "financial fraud", "i4c", "mha", "report crime"],
    authority: {
      name: "Indian Cyber Crime Coordination Centre (I4C), MHA",
      level: "CENTRAL",
      department: "Ministry of Home Affairs",
    },
    benefits: [
      "Emergency financial fraud reporting helpline 1930 to freeze fraudulent transfers",
      "Online complaint filing and status tracking",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://cybercrime.gov.in/",
      portalName: "National Cyber Crime Reporting Portal",
      steps: [
        "Dial 1930 immediately for financial cyber fraud within golden hour",
        "Or visit cybercrime.gov.in and select 'Report Cyber Crime'",
        "Provide transaction reference numbers, bank details, and screenshot evidence",
      ],
      documentsRequired: [
        { id: "doc-txn", name: "Transaction SMS / Bank Statement / UTR Number", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "National Cyber Crime Reporting Portal, MHA",
      url: "https://cybercrime.gov.in/",
      authority: "Ministry of Home Affairs",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "national-consumer-helpline",
    type: "RIGHT",
    title: "National Consumer Helpline Assistance",
    shortDescription: "Official grievance portal and helpline 1915 for resolving consumer disputes against unfair trade practices and defective goods.",
    fullDescription: "Department of Consumer Affairs service providing pre-litigation consumer grievance redressal against registered companies.",
    category: "rights",
    keywords: ["consumer helpline", "nch", "1915", "consumer dispute", "grievance"],
    authority: {
      name: "Department of Consumer Affairs, GoI",
      level: "CENTRAL",
      department: "Ministry of Consumer Affairs",
    },
    benefits: [
      "Pre-litigation dispute resolution assistance with registered companies",
      "Toll-free helpline 1915 and NCH app for tracking complaints",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://consumerhelpline.gov.in/",
      portalName: "National Consumer Helpline Portal",
      documentsRequired: [
        { id: "doc-bill", name: "Purchase Invoice / Bill / Booking confirmation", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Department of Consumer Affairs, GoI",
      url: "https://consumerhelpline.gov.in/",
      authority: "Department of Consumer Affairs",
      sourceType: "OFFICIAL_GOVERNMENT",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "REQUIRES_REVIEW", // State tribunal process details pending review
    },
    status: "ACTIVE",
  },

  // =========================================================================
  // CATEGORY: CAREER (3 Records)
  // =========================================================================

  {
    id: "national-career-service",
    type: "CAREER",
    title: "National Career Service (NCS) Jobseeker Registration",
    shortDescription: "Free job search, career counselling, and job matching portal for jobseekers across India.",
    fullDescription: "Ministry of Labour & Employment portal connecting jobseekers with corporate & government employers, skill courses, and career counsellors. Free of charge.",
    category: "career",
    keywords: ["ncs", "jobs", "jobseeker", "career", "employment", "labour ministry"],
    authority: {
      name: "Ministry of Labour and Employment, GoI",
      level: "CENTRAL",
      department: "Directorate General of Employment",
    },
    minAge: 14,
    maxAge: 60,
    eligibleEmploymentStatuses: ["unemployed", "student", "self_employed"],
    benefits: [
      "Free profile registration & direct search for verified job vacancies",
      "Access to online career counselling and skill assessment tools",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://www.ncs.gov.in/",
      portalName: "National Career Service Portal",
      steps: [
        "Register as Jobseeker on NCS portal",
        "Enter Aadhaar / UAN / Unique ID details",
        "Complete educational profile and skills background",
      ],
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar / Passport / Voter ID", required: true },
        { id: "doc-edu", name: "Educational Marksheets / Certificates", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Ministry of Labour and Employment, GoI",
      url: "https://www.ncs.gov.in/",
      authority: "Ministry of Labour and Employment",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "skill-india-digital-hub-skill",
    type: "CAREER",
    title: "Skill India Digital Hub — Skill Discovery",
    shortDescription: "Unified digital platform for discovering government skill development courses, certifications, and training centers.",
    fullDescription: "Skill India Digital Hub (SIDH) by MSDE provides access to short-term skill training, PMKVY courses, and digital skill certifications.",
    category: "career",
    keywords: ["skill india", "sidh", "skill training", "pmkvy", "msde", "certification"],
    authority: {
      name: "Ministry of Skill Development & Entrepreneurship (MSDE)",
      level: "CENTRAL",
      department: "MSDE",
    },
    minAge: 15,
    maxAge: 45,
    benefits: [
      "Access to certified skill training courses across multiple sectors",
      "Industry-recognized Skill India certificate",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://www.skillindiadigital.gov.in/",
      portalName: "Skill India Digital Hub",
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Skill India Digital Hub, MSDE",
      url: "https://www.skillindiadigital.gov.in/",
      authority: "Ministry of Skill Development & Entrepreneurship",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },

  {
    id: "skill-india-digital-hub-apprenticeship",
    type: "CAREER",
    title: "Skill India Digital Hub — Apprenticeship & Career Opportunities",
    shortDescription: "Official portal for discovering government & private sector apprenticeship training opportunities with monthly stipend.",
    fullDescription: "National Apprenticeship Promotion Scheme (NAPS) portal under SIDH allowing candidates to apply for on-the-job training in industrial establishments.",
    category: "career",
    keywords: ["apprenticeship", "naps", "sidh", "skill india", "stipend", "career"],
    authority: {
      name: "Ministry of Skill Development & Entrepreneurship (MSDE)",
      level: "CENTRAL",
      department: "National Skill Development Corporation (NSDC)",
    },
    minAge: 18,
    maxAge: 35,
    eligibleEmploymentStatuses: ["unemployed", "student"],
    benefits: [
      "On-the-job practical industry training with monthly stipend",
      "National Apprenticeship Certificate (NAC) upon completion",
    ],
    application: {
      method: "ONLINE",
      officialUrl: "https://www.skillindiadigital.gov.in/",
      portalName: "Skill India Digital Hub",
      documentsRequired: [
        { id: "doc-aadh", name: "Aadhaar Card", required: true },
        { id: "doc-edu", name: "Educational Marksheet (Class 10 / ITI / Diploma / Degree)", required: true },
      ],
    },
    timing: {
      deadline: null,
      deadlineType: "NO_DEADLINE",
      recurring: true,
      lastVerified: "2026-08-09",
    },
    source: {
      name: "Skill India Digital Hub, MSDE",
      url: "https://www.skillindiadigital.gov.in/",
      authority: "Ministry of Skill Development & Entrepreneurship",
      sourceType: "OFFICIAL_MINISTRY",
      sourceTrust: "OFFICIAL_GOVERNMENT",
      lastVerified: "2026-08-09",
      verificationStatus: "VERIFIED",
    },
    status: "ACTIVE",
  },
];
