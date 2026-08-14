"use client";

/**
 * app/assistant/page.tsx
 *
 * Full Page Vayam AI Civic Assistant Experience.
 * Phase 9: Multilingual page header.
 */

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { VayamAssistant } from "@/components/assistant/vayam-assistant";

export default function AssistantPage() {
  return (
    <PageContainer width="wide" className="h-[calc(100vh-70px)] !py-3 !space-y-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 h-full flex flex-col">
        <VayamAssistant className="flex-1 min-h-0" isFullPage={true} />
      </div>
    </PageContainer>
  );
}
