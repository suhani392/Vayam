"use client";

/**
 * app/assistant/page.tsx
 *
 * Full Page Vayam AI Civic Assistant Experience.
 * Phase 9: Multilingual page header.
 */

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { VayamAssistant } from "@/components/assistant/vayam-assistant";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function AssistantPage() {
  const { t } = useLanguage();

  return (
    <PageContainer width="wide">
      <PageHeader
        badge={
          <span className="badge badge-accent gap-1">
            <Sparkles size={12} /> {t("nav.assistant")}
          </span>
        }
        title={t("assistant.greeting")}
        description={t("assistant.subtitle")}
      />

      <div className="h-[calc(100vh-240px)] min-h-[600px] mb-8">
        <VayamAssistant isFullPage={true} />
      </div>
    </PageContainer>
  );
}
