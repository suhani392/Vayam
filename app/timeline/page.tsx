"use client";

/**
 * app/timeline/page.tsx
 *
 * Full Page Vayam Smart Civic Timeline Experience.
 * Phase 10: Renders SmartTimeline with life event derivation, 18th birthday countdown,
 * NOW / NEXT / LATER classification, and profile selector.
 */

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { SmartTimeline } from "@/components/timeline/smart-timeline";
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, Sparkles } from "lucide-react";

export default function TimelinePage() {
  const { t } = useLanguage();

  return (
    <PageContainer width="standard">
      <PageHeader
        badge={
          <span className="badge badge-accent gap-1">
            <Sparkles size={12} /> {t("nav.timeline")}
          </span>
        }
        title={t("nav.timeline")}
        description={t("nav.timeline.desc")}
      />

      <div className="mb-12">
        <SmartTimeline />
      </div>
    </PageContainer>
  );
}
