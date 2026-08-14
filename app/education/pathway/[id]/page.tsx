"use client";

/**
 * app/education/pathway/[id]/page.tsx
 *
 * Dedicated Career Pathway Detail Route.
 */

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { getEducationProfessionBySlug } from "@/lib/education/engine";
import { EducationPathwayView } from "@/components/education/education-pathway-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DedicatedPathwayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const profession = getEducationProfessionBySlug(id);

  if (!profession) {
    return (
      <PageContainer width="standard">
        <div className="text-center py-16 space-y-4">
          <h2 className="text-h2 font-bold text-foreground">Profession Pathway Not Found</h2>
          <p className="text-body-sm text-muted-foreground">The requested career route could not be located.</p>
          <Link href={"/education" as any} className="btn btn-primary btn-sm rounded-xl font-bold">
            Back to Education Pathfinder
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="standard">
      <div className="mb-6">
        <button
          onClick={() => router.push("/education" as any)}
          className="btn btn-outline btn-xs rounded-xl gap-2 font-bold cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Education Pathfinder
        </button>
      </div>

      <EducationPathwayView profession={profession} />
    </PageContainer>
  );
}
