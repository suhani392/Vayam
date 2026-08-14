# VAYAM — CIVIC INTELLIGENCE & VERIFIED KNOWLEDGE PLATFORM
## Executive Project Architecture & System Documentation Report

---

## 1. Project Overview & Identity

**Project Name**: VAYAM (वयम्) — Civic Intelligence & Knowledge Update System  
**Tagline**: Empowering Indian Citizens with Verified Rights, Schemes, Statutory Laws & Educational Pathways.

### Vision
Vayam is a state-of-the-art civic intelligence platform designed to bridge the gap between complex Indian government administration and citizens. It delivers personalized recommendations for central and state government schemes, statutory legal rights, legislative acts, career pathways, and smart financial lifestyle planning.

Crucially, Vayam introduces a **Lifestyle Planner & Asset Affordability Suite** (calculating safe house/car purchase caps based on income, smart banking loan leverage strategies, and government scheme/tax subsidy matching) alongside a **Strict 5-Layer Autonomous Source Monitoring & Human-in-the-Loop Verification Pipeline** that continuously scans official Indian government web portals, analyzes policy changes using AI, deterministically validates proposed database updates, and requires administrator review before any update enters the live production knowledge base.

---

## 2. Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend Framework** | Next.js 16.3 (App Router with Turbopack), React 19, TypeScript |
| **Styling & UI System** | Custom Vanilla CSS Design System, CSS Variables, Theme Tokens (Light/Dark glassmorphism, Saffron & Emerald palette), Lucide Icons |
| **Backend & Database** | Supabase (PostgreSQL, Supabase Auth, Row Level Security Policies, PostgREST API) |
| **AI & Intelligence Engine** | Groq AI API (`llama-3.3-70b-versatile` LLM model for 9-part civic situation analysis & policy change extraction) |
| **Source Monitoring / Crawler** | Python 3, Scrapy Framework, Custom Content Normalizers, MD5/SHA256 Content Hashing |
| **Language & Localisation** | Multi-language engine (English, Hindi, regional support, Voice Assistant integration) |

---

## 3. System Architecture & The 5-Layer Pipeline

Vayam enforces a strict separation of concerns across 5 distinct operational layers.

```
                    ┌──────────────────────────────┐
                    │   OFFICIAL GOVERNMENT        │
                    │        SOURCES               │
                    │                              │
                    │ Ministries • Departments     │
                    │ India Code • State Portals   │
                    │ Notifications • PDFs         │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 1 — SOURCE INTELLIGENCE (Vayam Sentinel)                         │
│ • Scrapy & Python Crawlers                                             │
│ • Registered Official Sources (knowledge_sources & monitored_sources) │
│ • Normalizes HTML/PDF text & computes source_snapshots content hashes │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 2 — CIVIC INTELLIGENCE (Vayam Analyst — Groq AI)                 │
│ • Understood detected text changes                                     │
│ • Extracts structured proposals (domain, old vs new, effective dates)  │
│ • Collects exact evidence excerpts & source metadata                  │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 3 — DETERMINISTIC VALIDATION (Vayam Validator — System Code)    │
│ • Pure non-AI deterministic code checks                                │
│ • Authority Level Check (Levels 3–5 required: Central/Ministry/State)  │
│ • Schema validation, target DB record existence, duplicate/conflict check│
│ • Filters out generic bulletins (GENERIC_TEXT_FILTERED)                │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 4 — HUMAN VERIFICATION (Admin Control Center UI)                 │
│ • Staging Review Queue (/admin/review/[id])                            │
│ • Displays 5-layer pipeline status indicators                          │
│ • Side-by-side Old vs Proposed database diffs                          │
│ • Action buttons: APPROVE | REJECT | NEEDS INVESTIGATION               │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 5 — VERIFIED KNOWLEDGE (Database Writer & Supabase DB)           │
│ • Transactionally updates knowledge_items, legal_acts, legal_rights    │
│ • Writes immutable version audit history (update_history)              │
│ • Live Vayam citizen engines instantly serve updated verified facts    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Complete Application Page Map

### Citizen Portal

| Route Path | Page Title | Core Purpose & Functionality |
| :--- | :--- | :--- |
| `/` | **Vayam Home** | Hero section, quick search, featured schemes, legal rights overview, and AI assistant launcher. |
| `/explore` | **Explore Schemes & Services** | Dynamic multi-factor database search & filtering for central & state schemes with state/income/category filters. |
| `/rights` | **Know Your Rights** | Legal situation analysis engine. Enter plain-language scenarios to get relevant governing acts and statutory rights. |
| `/rights/category/[category]` | **Category Rights & Acts** | Category-specific view displaying legal rights and statutory acts belonging strictly to the selected domain. |
| `/education` | **Education Pathfinder** | Career and qualification mapping engine connecting educational background to government exams and career steps. |
| `/timeline` | **Civic Timeline & Milestones** | Age-based and life-event milestone tracker (birth, voter ID, higher education, employment, retirement). |
| `/assistant` | **Civic AI Assistant** | Interactive AI layer for conversational queries on government procedures, rights, and schemes. |
| `/lifestyle` | **Lifestyle Planner** | Smart asset affordability & loan optimizer engine. Calculates safe house/car purchase caps based on income (28/36 & 20/4/10 rules), models smart banking leverage strategies (1 extra EMI/year, overdraft accounts), and matches government subsidies (PMAY, EV incentives, tax relief). |
| `/profile` | **Citizen Profile & Customization** | Interactive profile editor for state, income, category, gender, and student status to personalize scheme recommendations. |

### Administrator Portal

| Route Path | Page Title | Core Purpose & Functionality |
| :--- | :--- | :--- |
| `/admin` | **Admin Dashboard** | Real-time database metrics, 5-layer scan controls, pending review queue, flagged investigation queue, live production records browser, and audit activity timeline. |
| `/admin/sources` | **Monitored Source Registry** | Registry manager for official government web portals, ministry sites, and legislative feeds with active/inactive toggles and single-source scan triggers. |
| `/admin/review/[id]` | **Proposal Evidence Review** | Evidence-first review screen displaying Sentinel snapshot date, Groq Analyst breakdown, Validator check list, and side-by-side diffs with APPROVE / REJECT / INVESTIGATE actions. |

---

## 5. API Routes Index

| API Endpoint | HTTP Method | Purpose & Functionality |
| :--- | :--- | :--- |
| `/api/ai/chat` | `POST` | Executes Groq AI model (`llama-3.3-70b-versatile`) for conversational civic assistant queries. |
| `/api/admin/auth/check` | `POST` | Validates admin email (`admin@gmail.com`) and session credentials against Supabase Auth. |
| `/api/admin/scan` | `POST` | Executes the 5-layer pipeline: Sentinel crawl $\rightarrow$ Analyst Groq diff extraction $\rightarrow$ Validator checks $\rightarrow$ Staging insert. |
| `/api/admin/sources` | `GET`, `POST`, `PUT` | Fetches, adds, and modifies official government sources in `knowledge_sources` & `monitored_sources` database tables. |
| `/api/admin/findings` | `GET`, `POST` | Fetches pending proposals and executes admin decisions (`APPROVE` via `db-writer.ts`, `REJECT`, `INVESTIGATE`). |

---

## 6. Database Schema & Data Model

Vayam operates on a structured PostgreSQL database hosted on Supabase:

### Core Tables Summary
1. **`profiles`**: User profiles storing age, state, annual income, caste category, gender, and student status.
2. **`user_preferences`**: System settings including theme, language, and notification flags.
3. **`categories`**: Taxonomy categories (Education, Agriculture, Healthcare, Housing, Employment, Consumer Protection, Legal Aid).
4. **`knowledge_items`**: Verified schemes and government services.
5. **`legal_topics` & `legal_situations`**: Everyday legal scenarios linked to governing laws.
6. **`legal_acts`**: Statutory acts passed by Indian Parliament or State Assemblies.
7. **`legal_rights`**: Explicit section rights granted to citizens under specific acts.
8. **`education_careers` & `education_pathways`**: Qualification-to-career progression steps.

### Staging & Intelligence Pipeline Tables
9. **`monitored_sources` & `knowledge_sources`**: Registry of official government URLs, authority levels (1–5), and scan frequencies.
10. **`source_snapshots`**: Immutable historical text snapshots and content hashes.
11. **`civic_update_findings`**: Staging review queue for AI-extracted proposals awaiting admin review.
12. **`update_history` & `civic_audit_logs`**: Permanent transactional audit logs of all approved or rejected updates.

---

## 7. User Experience & Application Workflow

### Citizen Workflow
1. **Onboarding / Profile Customization**: The citizen sets their location (e.g. Maharashtra), annual income (e.g. ₹2.5 Lakhs), and student/employment status on `/profile`.
2. **Personalized Recommendation**: Vayam's rule engine evaluates the profile against `knowledge_items` eligibility criteria, highlighting eligible schemes.
3. **Legal Situation Resolver**: On `/rights`, the citizen describes a scenario in plain language (e.g. *"Landlord refused security deposit refund"*). Vayam returns relevant sections of the *Rent Control Act* and *Consumer Protection Act*.

### Administrator Workflow
1. **Source Monitoring**: The administrator clicks **Run Scan** on the Admin Dashboard or configures recurring scans in `/admin/sources`.
2. **Sentinel & Analyst Pipeline**: Sentinel crawls official portals, computes hashes, and Groq Analyst extracts structured policy updates.
3. **Validator Filtering**: System code checks source authority ($\ge 3$), schema match, and filters out generic placeholders.
4. **Human-in-the-Loop Review**: On `/admin/review/[id]`, the admin inspects original text evidence and side-by-side diffs.
5. **Transactional Database Write**: Clicking **APPROVE** invokes `db-writer.ts`, updating `knowledge_items` in Supabase and recording an entry in `update_history`.

---

## 8. Summary & Conclusion

Vayam delivers a state-of-the-art civic intelligence architecture. By pairing **Groq AI semantic extraction** with **deterministic validation** and **mandatory administrator verification**, Vayam guarantees that citizens receive accurate, verified, and timely civic knowledge without ever exposing them to unverified AI hallucinations.

*Report compiled and verified for Vayam Codebase.*
