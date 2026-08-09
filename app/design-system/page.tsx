"use client";

/**
 * app/design-system/page.tsx
 *
 * Updated Vayam Phase 3 Design System & Component Library Showcase.
 * Interactive playground demonstrating all 17 component categories built in Phase 3.
 */

import React, { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_CONFIG } from "@/config/app";

/* Import UI Primitive Components */
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  DestructiveButton,
  IconButton,
} from "@/components/ui/button";
import {
  TextInput,
  SearchInput,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  DateInput,
} from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge, StatusBadge, CategoryBadge, SourceBadge } from "@/components/ui/badge";
import { Alert, InfoAlert, SuccessAlert, WarningAlert, ErrorAlert } from "@/components/ui/alert";
import { Dialog, ConfirmationDialog } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

/* Import Civic Components */
import {
  ProfileAvatar,
  LanguageSelector,
  ThemeSwitcher,
  OfficialSourceBadge,
  DeadlineIndicator,
  EligibilityBadge,
  EligibilitySummary,
  RelevanceIndicator,
} from "@/components/civic";

/* Import Scheme Components */
import {
  SchemeCard,
  SchemeMeta,
  BenefitChip,
  BenefitItem,
  DocumentRequirement,
} from "@/components/schemes";

/* Import Service Components */
import {
  ServiceCard,
  ServiceJourney,
  ServiceStatus,
} from "@/components/services";

/* Import Timeline Components */
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineEvent,
  TimelineMarker,
} from "@/components/timeline";

/* Import Vayam Journey / Life Ribbon Components */
import {
  VayamJourney,
  CurrentPosition,
  JourneyCard,
  JourneyListFallback,
} from "@/components/orbit";

/* Import Assistant Components */
import {
  AssistantButton,
  AssistantInput,
  ChatMessage,
  TypingIndicator,
  VoiceButton,
  SuggestedPrompt,
  AssistantPanel,
} from "@/components/assistant";

/* Import Layout Components */
import { NavItem, NavSection, Breadcrumb, PageHeader, SectionHeader } from "@/components/layout";

/* Import Feedback Components */
import {
  Skeleton,
  LoadingIndicator,
  EmptyState,
  ErrorState,
  NotFoundState,
} from "@/components/feedback";

/* Icons */
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Languages,
  User,
  GraduationCap,
  Award,
  Landmark,
  FileText,
  Clock,
  ArrowRight,
  Info,
  SlidersHorizontal,
  FolderOpen,
  Coins,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-b border-border-subtle">
      <div className="mb-6">
        <h2 className="text-h2 font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-body-sm text-muted-foreground mt-1 max-w-3xl">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

interface ChatMessageData {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sourceName?: string;
}

export default function DesignSystemPage() {
  /* Interactive state for preview controls */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOrbitId, setSelectedOrbitId] = useState("1");
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      role: "assistant",
      content:
        "Namaste Suhani! I am Vayam Assistant. How can I help you find eligible schemes, services, or civic rights today?",
      timestamp: "10:30 AM",
      sourceName: "Ministry of Finance",
    },
  ]);

  const handleSendMessage = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg, timestamp: "Just now" },
      {
        role: "assistant",
        content: `I've analyzed your query regarding "${msg}". Based on your age (18) and residence (Maharashtra), you match 2 central government education scholarships.`,
        timestamp: "Just now",
        sourceName: "National Scholarship Portal",
      },
    ]);
  };

  const orbitNodes = [
    { id: "1", title: "Education", subtitle: "2 Scholarships", count: 2, category: "education", icon: <GraduationCap size={16} /> },
    { id: "2", title: "Benefits", subtitle: "PM-JAY Health", count: 1, category: "benefits", icon: <CheckCircle2 size={16} /> },
    { id: "3", title: "Finance", subtitle: "PM-Kisan Aid", count: 1, category: "finance", icon: <Coins size={16} /> },
    { id: "4", title: "Career", subtitle: "Job Registrations", count: 1, category: "career", icon: <Briefcase size={16} /> },
    { id: "5", title: "Services", subtitle: "Certificates", count: 2, category: "services", icon: <FileText size={16} /> },
    { id: "6", title: "Rights", subtitle: "Voter ID Right", count: 1, category: "rights", icon: <Landmark size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background motif-bg">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-h3 font-extrabold text-foreground">{APP_CONFIG.name}</span>
            <span className="font-devanagari text-body-sm text-muted-foreground">वयम्</span>
            <span className="badge badge-saffron ml-2">UI Component Library</span>
            <span className="badge badge-muted">Phase 3</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle showLabel />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* ── Hero / Page Header ── */}
        <PageHeader
          badge={<span className="badge badge-saffron">Phase 03 Component Library</span>}
          title="Vayam UI Component Showcase"
          description="A comprehensive library of reusable, accessible, theme-aware presentation components built for India's civic intelligence platform."
          actions={
            <div className="flex items-center gap-3">
              <AssistantButton onClick={() => setIsAssistantOpen(true)} />
            </div>
          }
        />

        {/* 1. TYPOGRAPHY */}
        <Section
          title="1. Typography & Weight Hierarchy"
          subtitle="Humanist sans-serif typography with strict weight assignments (W300–W800) and Devanagari script support."
        >
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border-subtle space-y-3">
              <span className="text-label text-accent uppercase tracking-widest font-bold">Greeting Style</span>
              <p className="text-greeting font-bold text-foreground">Namaste, Suhani 👋</p>
              <p className="text-metric font-extrabold text-accent">37 days · ₹6,000 / yr</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border-subtle">
                <span className="text-caption text-muted-foreground uppercase font-bold">English (Latin)</span>
                <p className="text-body text-foreground mt-1">
                  Vayam helps citizens discover government schemes, services, and rights relevant to their life stage.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border-subtle">
                <span className="text-caption text-muted-foreground uppercase font-bold">Devanagari (Hindi & Marathi)</span>
                <p className="font-devanagari text-body text-foreground mt-1">
                  नमस्ते! वयम् मध्ये आपले स्वागत आहे. आपल्या जीवन टप्प्यानुसार शासकीय योजना शोधा.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 2. BUTTONS */}
        <Section
          title="2. Button Variants & States"
          subtitle="Refined rounded buttons with primary, secondary, outline, ghost, destructive, accent, and icon states."
        >
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <PrimaryButton leftIcon={<Sparkles size={16} />}>Primary Saffron</PrimaryButton>
              <SecondaryButton>Secondary Warm</SecondaryButton>
              <OutlineButton>Outline Refined</OutlineButton>
              <GhostButton>Ghost Button</GhostButton>
              <DestructiveButton>Destructive Action</DestructiveButton>
              <Button variant="accent">Accent Indigo</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton size="sm">Small (sm)</PrimaryButton>
              <PrimaryButton size="md">Medium (md)</PrimaryButton>
              <PrimaryButton size="lg">Large (lg)</PrimaryButton>
              <PrimaryButton isLoading>Loading State</PrimaryButton>
              <PrimaryButton disabled>Disabled State</PrimaryButton>
              <IconButton icon={<Filter size={16} />} aria-label="Filter options" />
              <IconButton icon={<Search size={16} />} variant="outline" aria-label="Search" />
            </div>
          </div>
        </Section>

        {/* 3. INPUTS */}
        <Section
          title="3. Form Control Inputs"
          subtitle="Accessible form controls: TextInput, SearchInput, TextArea, Select, Checkbox, Radio, Toggle, DateInput."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput label="Full Name" placeholder="e.g. Suhani Sharma" helperText="Enter your legal name as on Aadhaar" />
            <SearchInput
              label="Search Schemes"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="Search by keyword, department..."
            />
            <Select
              label="State of Residence"
              options={[
                { value: "MH", label: "Maharashtra" },
                { value: "DL", label: "Delhi (NCT)" },
                { value: "KA", label: "Karnataka" },
                { value: "UP", label: "Uttar Pradesh" },
              ]}
            />
            <DateInput label="Date of Birth" />
            <TextArea label="Additional Notes" placeholder="Mention any specific requirements..." />
            <div className="space-y-4 pt-2">
              <Checkbox label="I consent to offline eligibility verification" helperText="Your data remains on your device." />
              <div className="flex gap-4">
                <Radio name="gender" label="Male" />
                <Radio name="gender" label="Female" defaultChecked />
                <Radio name="gender" label="Other" />
              </div>
              <Toggle checked={toggleState} onChange={setToggleState} label="Enable SMS notifications" />
            </div>
          </div>
        </Section>

        {/* 4. CARDS */}
        <Section
          title="4. Paper Card System"
          subtitle="Composable Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter with Vayam paper elevation."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Paper Card</CardTitle>
                <CardDescription>Standard static card container for information panels.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground">Content inside default card with subtle borders and paper feel.</p>
              </CardContent>
              <CardFooter>
                <span className="text-caption text-muted-foreground">Footer Note</span>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover lifting card with subtle shadow feedback.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground">Hover over this card to observe gentle translateY elevation.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>Explore</Button>
              </CardFooter>
            </Card>

            <Card variant="milestone">
              <CardHeader>
                <CardTitle>Milestone Card</CardTitle>
                <CardDescription>Featured highlight card with top accent bar.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground">Top saffron-to-purple gradient line indicator for key events.</p>
              </CardContent>
              <CardFooter>
                <span className="badge badge-saffron">Featured Milestone</span>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* 5. BADGES */}
        <Section
          title="5. Badges & Status Indicators"
          subtitle="Accessibility compliant badges using both text AND icon."
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="likely-eligible" />
              <StatusBadge status="needs-verification" />
              <StatusBadge status="not-eligible" />
              <StatusBadge status="upcoming" />
              <StatusBadge status="verified" />
              <StatusBadge status="official" />
              <StatusBadge status="deadline" />
              <StatusBadge status="saved" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge category="education" />
              <CategoryBadge category="agriculture" />
              <CategoryBadge category="social_welfare" />
              <CategoryBadge category="health" />
              <SourceBadge verified sourceName="Ministry of Finance, GoI" />
            </div>
          </div>
        </Section>

        {/* 6. ALERTS */}
        <Section
          title="6. Calm Alerts"
          subtitle="Reassuring, non-intrusive government alert banners."
        >
          <div className="space-y-3 max-w-3xl">
            <InfoAlert title="Profile Updated">
              Your age (18 years) has been recorded. Matching higher education schemes are now highlighted.
            </InfoAlert>
            <SuccessAlert title="Eligibility Verified">
              You match all criteria for the Post-Matric Scholarship Scheme 2026.
            </SuccessAlert>
            <WarningAlert title="Application Deadline Approaching">
              PM-Kisan instalment registration closes on August 31, 2026.
            </WarningAlert>
            <ErrorAlert title="Verification Required">
              Income certificate copy is missing from your profile attachments.
            </ErrorAlert>
          </div>
        </Section>

        {/* 7. DIALOGS & TOOLTIPS */}
        <Section
          title="7. Dialogs, Modals & Tooltips"
          subtitle="Keyboard accessible, focus trapped, ESC closeable dialogs and tooltips."
        >
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton onClick={() => setIsDialogOpen(true)}>
              Open Standard Modal
            </PrimaryButton>
            <OutlineButton onClick={() => setIsConfirmOpen(true)}>
              Open Confirmation Dialog
            </OutlineButton>
            <Tooltip content="Deterministic civic intelligence calculation date" position="top">
              <Button variant="secondary" leftIcon={<Info size={14} />}>
                Hover for Tooltip
              </Button>
            </Tooltip>
          </div>

          {/* Dialog Component Instance */}
          <Dialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Scheme Details Modal"
            description="Detailed breakdown of eligibility and application steps."
            footer={
              <PrimaryButton onClick={() => setIsDialogOpen(false)}>
                Close Modal
              </PrimaryButton>
            }
          >
            <p className="text-body-sm text-foreground">
              This modal is fully accessible with ESC key support, focus trap, and body scroll lock.
            </p>
            <InfoAlert title="Data Privacy">
              Your inputs are calculated locally. No personal data is transmitted to external servers.
            </InfoAlert>
          </Dialog>

          {/* Confirmation Dialog Instance */}
          <ConfirmationDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => setIsConfirmOpen(false)}
            title="Confirm Profile Update"
            description="Are you sure you want to update your socio-economic indicators?"
            confirmLabel="Update Profile"
          />
        </Section>

        {/* 8. TABS & DROPDOWNS */}
        <Section
          title="8. Tabs & Dropdown Popovers"
          subtitle="WAI-ARIA compliant tab panels and action dropdown menus."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-label text-muted-foreground uppercase mb-3">Tab List & Panels</p>
              <Tabs defaultValue="all">
                <TabList>
                  <Tab value="all">All Schemes (4)</Tab>
                  <Tab value="eligible">Eligible (2)</Tab>
                  <Tab value="saved">Saved (1)</Tab>
                </TabList>
                <TabPanel value="all" className="p-4 bg-card rounded-2xl border border-border-subtle">
                  <p className="text-body-sm text-foreground">Displaying all 4 verified schemes for your profile.</p>
                </TabPanel>
                <TabPanel value="eligible" className="p-4 bg-card rounded-2xl border border-border-subtle">
                  <p className="text-body-sm text-foreground">Displaying 2 schemes where eligibility is verified.</p>
                </TabPanel>
                <TabPanel value="saved" className="p-4 bg-card rounded-2xl border border-border-subtle">
                  <p className="text-body-sm text-foreground">1 scheme saved to your bookmarked list.</p>
                </TabPanel>
              </Tabs>
            </div>

            <div>
              <p className="text-label text-muted-foreground uppercase mb-3">Dropdown Popovers</p>
              <div className="flex gap-4">
                <Dropdown
                  trigger={<Button variant="outline" leftIcon={<SlidersHorizontal size={14} />}>Sort & Filter</Button>}
                >
                  <DropdownItem icon={<Clock size={14} />}>Sort by Deadline</DropdownItem>
                  <DropdownItem icon={<Sparkles size={14} />}>Sort by Relevance</DropdownItem>
                  <DropdownItem icon={<FolderOpen size={14} />}>Filter by Category</DropdownItem>
                </Dropdown>

                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </Section>

        {/* 9. NAVIGATION ELEMENTS */}
        <Section
          title="9. Navigation Building Blocks"
          subtitle="NavItem, NavSection, Breadcrumb, PageHeader, SectionHeader."
        >
          <div className="space-y-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Design System", href: "/design-system" },
                { label: "Components" },
              ]}
            />
            <SectionHeader
              title="Civic Recommendations"
              subtitle="Top welfare opportunities matching your profile"
              action={<Button size="sm" variant="outline">View All</Button>}
            />
            <div className="max-w-xs bg-card p-3 rounded-2xl border border-border-subtle">
              <NavSection title="Main Navigation">
                <NavItem href="#" label="Dashboard" icon={<User size={16} />} active />
                <NavItem href="#" label="Explore Schemes" icon={<Globe size={16} />} badge={<span className="badge badge-saffron">4</span>} />
                <NavItem href="#" label="My Rights" icon={<Landmark size={16} />} />
              </NavSection>
            </div>
          </div>
        </Section>

        {/* 10. CIVIC COMPONENTS */}
        <Section
          title="10. Civic Intelligence Components"
          subtitle="ProfileAvatar, LanguageSelector, ThemeSwitcher, OfficialSourceBadge, DeadlineIndicator, EligibilityBadge, RelevanceIndicator."
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <ProfileAvatar name="Suhani Sharma" size="sm" statusDot="active" />
              <ProfileAvatar name="Suhani Sharma" size="md" statusDot="active" />
              <ProfileAvatar name="Suhani Sharma" size="lg" statusDot="active" />
              <ProfileAvatar name="Suhani Sharma" size="xl" statusDot="active" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <OfficialSourceBadge sourceName="Ministry of Agriculture" lastVerifiedDate="Aug 2026" />
              <DeadlineIndicator daysRemaining={12} />
              <EligibilityBadge status="eligible" />
              <RelevanceIndicator level="high" />
            </div>

            <EligibilitySummary
              status="requires_verification"
              reasons={[
                "Age criterion (18–25) met",
                "Domicile state (Maharashtra) verified",
              ]}
              missingFields={["Annual Household Income"]}
            />
          </div>
        </Section>

        {/* 11. SCHEME COMPONENTS */}
        <Section
          title="11. Government Scheme Components"
          subtitle="SchemeCard, SchemeMeta, BenefitChip, DocumentRequirement."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SchemeCard
              id="pm-kisan"
              name="Pradhan Mantri Kisan Samman Nidhi"
              summary="Financial assistance of ₹6,000 per year to small and marginal farmers across India."
              category="agriculture"
              benefitSummary="₹6,000 / year in three equal instalments"
              benefitAmountInr={6000}
              eligibilityStatus="eligible"
              daysRemaining={24}
              department="Ministry of Agriculture & Farmers Welfare"
            />

            <div className="space-y-4">
              <SchemeMeta level="central" department="Ministry of Agriculture" stateCode="IN-MH" />
              <BenefitItem title="Direct Benefit Transfer" description="Transferred directly into verified Aadhar-linked bank account" />
              <DocumentRequirement
                documents={[
                  { id: "1", name: "Aadhaar Card", status: "verified" },
                  { id: "2", name: "Land Holding Certificate", status: "pending" },
                  { id: "3", name: "Bank Passbook", status: "required" },
                ]}
              />
            </div>
          </div>
        </Section>

        {/* 12. SERVICE COMPONENTS */}
        <Section
          title="12. Government Service Workflow Components"
          subtitle="ServiceCard, ServiceJourney, ServiceStatus."
        >
          <div className="space-y-6">
            <ServiceJourney
              steps={[
                { id: "1", title: "Eligibility", description: "Verified", state: "completed" },
                { id: "2", title: "Documents", description: "Uploaded", state: "completed" },
                { id: "3", title: "Application", description: "In Progress", state: "current" },
                { id: "4", title: "Review", description: "Dept Processing", state: "upcoming" },
                { id: "5", title: "Completion", description: "Certificate Issued", state: "upcoming" },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ServiceCard
                id="srv-1"
                name="Income & Domicile Certificate Renewal"
                summary="Digital state portal application for official residence & income proof."
                category="social_welfare"
                department="Revenue Department, Govt of Maharashtra"
                processingTimeDays={7}
              />
              <ServiceStatus status="under_review" applicationId="MH-2026-884192" submittedDate="08 Aug 2026" />
            </div>
          </div>
        </Section>

        {/* 13. TIMELINE COMPONENTS */}
        <Section
          title="13. Civic Timeline Components"
          subtitle="Timeline, TimelineItem, TimelineConnector, TimelineEvent, TimelineMarker."
        >
          <Timeline className="max-w-2xl">
            <TimelineItem>
              <TimelineMarker type="completed" />
              <TimelineEvent
                title="Age 18 Milestone Reached"
                description="Adult civic rights unlocked: Voter registration, PAN card, adult higher education scholarships."
                date="15 July 2026"
                category="life_event"
                type="completed"
              />
            </TimelineItem>

            <TimelineItem>
              <TimelineMarker type="current" />
              <TimelineEvent
                title="Voter ID Card Online Registration Window"
                description="Apply on Election Commission portal (NVSP) for upcoming municipal elections."
                date="01 Aug – 31 Aug 2026"
                category="civic_action"
                type="current"
                requiresAction
              />
            </TimelineItem>

            <TimelineItem>
              <TimelineMarker type="upcoming" />
              <TimelineEvent
                title="Post-Matric Scholarship Deadline"
                description="Annual submission window closes for State Higher Education Department."
                date="30 Sept 2026"
                category="deadline"
                type="upcoming"
              />
            </TimelineItem>
          </Timeline>
        </Section>

        {/* 14. YOUR VAYAM — LIFE RIBBON */}
        <Section
          title="14. YOUR VAYAM — Life Ribbon Component"
          subtitle="VayamJourney, CurrentPosition, JourneyCard, JourneyListFallback representing a person's civic journey through life."
        >
          <div className="space-y-6">
            <VayamJourney
              currentPosition={{ name: "Suhani", age: 18, lifeStage: "Young Adult" }}
              items={[
                {
                  id: "1",
                  title: "Post-Matric Scholarship Scheme 2026",
                  category: "education",
                  description: "Financial assistance for higher education courses in Maharashtra colleges.",
                  count: 2,
                  icon: <GraduationCap size={16} />,
                  relevance: 95,
                  status: "high",
                },
                {
                  id: "2",
                  title: "Voter ID Card Online Registration",
                  category: "rights",
                  description: "Age 18 milestone reached. Register on NVSP portal for municipal elections.",
                  count: 1,
                  icon: <Landmark size={16} />,
                  relevance: 90,
                  status: "high",
                },
                {
                  id: "3",
                  title: "Ayushman Bharat Health Coverage",
                  category: "benefits",
                  description: "₹5 Lakh annual health insurance coverage per household.",
                  count: 1,
                  icon: <CheckCircle2 size={16} />,
                  relevance: 75,
                  status: "high",
                },
                {
                  id: "4",
                  title: "Income & Domicile Certificate Renewal",
                  category: "services",
                  description: "Digital state portal application for official revenue certificate.",
                  count: 2,
                  icon: <FileText size={16} />,
                  relevance: 65,
                  status: "medium",
                },
                {
                  id: "5",
                  title: "Pradhan Mantri Kisan Samman Nidhi",
                  category: "finance",
                  description: "Direct bank transfer of ₹6,000 per year in three equal instalments.",
                  count: 1,
                  icon: <Coins size={16} />,
                  relevance: 55,
                  status: "medium",
                },
                {
                  id: "6",
                  title: "National Career Service Job Registration",
                  category: "career",
                  description: "Upcoming employment exchange registration for youth.",
                  count: 1,
                  icon: <Briefcase size={16} />,
                  relevance: 45,
                  status: "low",
                  isUpcoming: true,
                },
              ]}
              selectedItemId={selectedOrbitId}
              onItemSelect={setSelectedOrbitId}
            />
            <JourneyListFallback
              items={[
                {
                  id: "1",
                  title: "Post-Matric Scholarship Scheme 2026",
                  category: "education",
                  description: "Financial assistance for higher education courses in Maharashtra colleges.",
                  count: 2,
                  icon: <GraduationCap size={16} />,
                  relevance: 95,
                  status: "high",
                },
                {
                  id: "2",
                  title: "Voter ID Card Online Registration",
                  category: "rights",
                  description: "Age 18 milestone reached. Register on NVSP portal for municipal elections.",
                  count: 1,
                  icon: <Landmark size={16} />,
                  relevance: 90,
                  status: "high",
                },
              ]}
              selectedItemId={selectedOrbitId}
              onItemClick={setSelectedOrbitId}
            />
          </div>
        </Section>

        {/* 15. ASSISTANT UI COMPONENTS */}
        <Section
          title="15. Presentation AI Assistant Components"
          subtitle="AssistantButton, AssistantInput, ChatMessage, TypingIndicator, VoiceButton, SuggestedPrompt, AssistantPanel."
        >
          <div className="space-y-4 max-w-2xl bg-card p-6 rounded-3xl border border-border-subtle">
            <div className="flex flex-wrap gap-2">
              <SuggestedPrompt prompt="Am I eligible for PM-Kisan?" onClick={handleSendMessage} />
              <SuggestedPrompt prompt="How do I get an Income Certificate?" onClick={handleSendMessage} />
            </div>

            <div className="space-y-4 py-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} {...m} />
              ))}
              <TypingIndicator />
            </div>

            <AssistantInput onSend={handleSendMessage} />
          </div>

          {/* Slide-over Assistant Panel */}
          <AssistantPanel isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)}>
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} {...m} />
              ))}
            </div>
            <div className="pt-4 border-t border-border-subtle mt-4">
              <AssistantInput onSend={handleSendMessage} />
            </div>
          </AssistantPanel>
        </Section>

        {/* 16. FEEDBACK & LOADING STATES */}
        <Section
          title="16. Loading, Empty & Error States"
          subtitle="Human-friendly, reassuring state indicators for async data."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-card rounded-2xl border border-border-subtle space-y-3">
                <p className="text-caption font-bold text-muted-foreground uppercase">Skeleton Loader</p>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" />
              </div>

              <div className="p-4 bg-card rounded-2xl border border-border-subtle flex items-center justify-center">
                <LoadingIndicator />
              </div>

              <div className="p-4 bg-card rounded-2xl border border-border-subtle flex items-center justify-center">
                <NotFoundState />
              </div>
            </div>

            <EmptyState />
            <ErrorState onRetry={() => alert("Retrying data fetch...")} />
          </div>
        </Section>

      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border-subtle py-10 mt-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p className="text-h4 font-bold text-foreground">{APP_CONFIG.name} — Component Library</p>
          <p className="text-caption text-muted-foreground">
            Phase 3 Component Architecture Complete · Ready for Phase 4 Feature Integration
          </p>
        </div>
      </footer>
    </div>
  );
}
