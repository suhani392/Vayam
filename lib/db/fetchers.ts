/**
 * lib/db/fetchers.ts
 *
 * Dynamic Supabase Database Query Layer for Vayam.
 * Fetches schemes, milestones, legal rights, and education pathways directly from
 * Supabase PostgreSQL tables. Integrates fallback to local datasets if DB returns empty
 * or if offline, ensuring high availability.
 */

import { supabase } from "./supabase";
import type { DbKnowledgeItem, DbMilestone, DbCategory } from "@/types/db";
import { setDbLegalSituations, setDbRightsCategories } from "@/data/rights";
import { setDbEducationRegistry } from "@/data/education";
import type { LegalCategoryMeta, RightsCategory, LegalAct, LegalRight } from "@/types/rights";

/**
 * Fetch all categories directly from Supabase DB.
 */
export async function fetchDbCategories(): Promise<DbCategory[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as DbCategory[];
  } catch (err) {
    console.warn("fetchDbCategories error:", err);
    return [];
  }
}

/**
 * Fetch knowledge items directly from Supabase DB.
 */
export async function fetchDbKnowledgeItems(categorySlug?: string): Promise<any[]> {
  try {
    // 1. Fetch categories to build ID -> Slug map
    const { data: categories } = await supabase.from("categories").select("id, slug, name");
    const categoryMap = new Map<string, { slug: string; name: string }>();
    if (categories) {
      categories.forEach((cat) => categoryMap.set(cat.id, { slug: cat.slug, name: cat.name }));
    }

    // 2. Query knowledge_items
    let query = supabase.from("knowledge_items").select("*");

    if (categorySlug && categories) {
      const foundCat = categories.find((c) => c.slug === categorySlug);
      if (foundCat) {
        query = query.eq("category_id", foundCat.id);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Vayam Supabase Sync] Error fetching knowledge_items:", error.message);
      return [];
    }
    if (!data || data.length === 0) {
      console.warn("[Vayam Supabase Sync] knowledge_items table returned 0 rows.");
      return [];
    }

    // 3. Attach category info
    const enrichedData = data.map((item) => ({
      ...item,
      category_rel: item.category_id ? categoryMap.get(item.category_id) : undefined,
    }));

    console.log(`[Vayam Supabase Sync] Successfully loaded ${enrichedData.length} records from Supabase database!`, enrichedData);
    return enrichedData;
  } catch (err) {
    console.error("[Vayam Supabase Sync] Exception fetching knowledge_items:", err);
    return [];
  }
}

/**
 * Fetch milestones directly from Supabase DB.
 */
export async function fetchDbMilestones(): Promise<DbMilestone[]> {
  try {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }
    console.log(`[Vayam Supabase Sync] Loaded ${data.length} milestones from Supabase DB!`);
    return data as DbMilestone[];
  } catch (err) {
    console.warn("fetchDbMilestones error:", err);
    return [];
  }
}

/**
 * Fetch legal topics and situations directly from Supabase DB.
 */
export async function fetchDbLegalSituations(): Promise<any[]> {
  try {
    const { data: categories } = await supabase.from("categories").select("*");
    const { data: topics } = await supabase.from("legal_topics").select("*");
    const { data: situations, error } = await supabase.from("legal_situations").select("*");
    const { data: acts } = await supabase.from("legal_acts").select("*");
    const { data: rights } = await supabase.from("legal_rights").select("*");

    // Map acts by ID for quick lookup
    const actMap = new Map<string, any>();
    if (acts) {
      acts.forEach((a) => actMap.set(a.id, a));
    }

    // Populate Rights Categories dynamically from Supabase DB (excluding redundant 'rights' category)
    if (categories && categories.length > 0) {
      const mappedCats: LegalCategoryMeta[] = categories
        .filter((c) => c.slug !== "rights" && c.id !== "rights" && c.name.toLowerCase() !== "rights")
        .map((c) => ({
          id: (c.slug || c.id) as RightsCategory,
          title: c.name,
          description: c.description || "",
          iconName: c.icon || "Scale",
          sampleQueries: [],
        }));
      setDbRightsCategories(mappedCats);
    } else {
      setDbRightsCategories([]);
    }

    if (error || !situations || situations.length === 0) {
      setDbLegalSituations([]);
      return [];
    }

    const topicMap = new Map<string, any>();
    if (topics) {
      topics.forEach((t) => topicMap.set(t.id, t));
    }

    const mappedSituations: any[] = situations.map((s) => {
      const topic = s.topic_id ? topicMap.get(s.topic_id) : undefined;
      const linkedAct = topic?.act_id ? actMap.get(topic.act_id) : undefined;

      const mergedActs = [...(topic?.applicable_acts || [])];
      if (linkedAct && !mergedActs.includes(linkedAct.title)) {
        mergedActs.unshift(`${linkedAct.title} (${linkedAct.act_number || linkedAct.enactment_year})`);
      }

      return {
        id: s.id,
        topicId: s.topic_id || "general",
        title: s.title,
        category: (topic?.category || "money_payments") as any,
        situationPatterns: s.situation_patterns || [],
        summary: topic?.plain_language_summary || s.title,
        applicableActs: mergedActs,
        legalConsiderations: s.legal_considerations || [],
        rightsGranted: s.rights_granted || [],
        evidenceToPreserve: s.evidence_to_preserve || [],
        practicalSteps: Array.isArray(s.practical_steps)
          ? s.practical_steps.map((p: any, idx: number) => ({
              stepNumber: p.step_number || idx + 1,
              title: p.title || `Step ${idx + 1}`,
              description: p.action || p.description || "",
            }))
          : [],
        officialHelplines: Array.isArray(s.official_helplines)
          ? s.official_helplines.map((h: any) => ({
              name: h.name || "Helpline",
              contactNumber: h.phone || h.contactNumber || "1915",
              description: h.description || "Official Helpline",
            }))
          : [],
        officialSources: Array.isArray(s.official_sources)
          ? s.official_sources.map((src: any) => ({
              title: src.title || "Official Portal",
              authority: src.authority || "Government Authority",
              url: src.url || "#",
              lastVerified: src.lastVerified || "2026-08-09",
            }))
          : [],
        lastVerified: s.last_verified ? s.last_verified.substring(0, 10) : "2026-08-09",
        disclaimer: s.disclaimer || "Educational guidance provided by Vayam.",
        status: "INFORMATION_AVAILABLE" as const,
      };
    });

    setDbLegalSituations(mappedSituations);
    console.log(`[Vayam Supabase Sync] Loaded ${mappedSituations.length} legal situations from Supabase DB!`);
    return mappedSituations;
  } catch (err) {
    console.warn("fetchDbLegalSituations error:", err);
    setDbLegalSituations([]);
    return [];
  }
}

/**
 * Fetch all legal acts directly from Supabase DB.
 */
export async function fetchDbLegalActs(): Promise<LegalAct[]> {
  try {
    const { data, error } = await supabase.from("legal_acts").select("*");
    if (error || !data) return [];
    return data.map((a) => ({
      id: a.id,
      actNumber: a.act_number || "",
      title: a.title,
      shortTitle: a.short_title || "",
      enactmentYear: a.enactment_year || 2020,
      ministry: a.ministry || "Government of India",
      jurisdiction: a.jurisdiction || "Central",
      summary: a.summary || "",
      category: a.category || undefined,
    }));
  } catch (err) {
    console.warn("fetchDbLegalActs error:", err);
    return [];
  }
}

/**
 * Fetch all legal rights directly from Supabase DB.
 */
export async function fetchDbLegalRights(): Promise<LegalRight[]> {
  try {
    const { data, error } = await supabase.from("legal_rights").select("*");
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      actId: r.act_id,
      sectionNumber: r.section_number || "",
      rightTitle: r.right_title,
      legalText: r.legal_text || "",
      plainLanguageExplanation: r.plain_language_explanation || "",
      penaltyOrRemedy: r.penalty_or_remedy || "",
      category: r.category || undefined,
    }));
  } catch (err) {
    console.warn("fetchDbLegalRights error:", err);
    return [];
  }
}

/**
 * Fetch education careers and pathways directly from Supabase DB.
 */
export async function fetchDbEducationPathways(): Promise<any[]> {
  try {
    const { data: careers } = await supabase.from("education_careers").select("*");
    const { data: pathways, error } = await supabase.from("education_pathways").select("*");

    if (!careers || careers.length === 0) {
      setDbEducationRegistry([]);
      return [];
    }

    const pathwaysMap = new Map<string, any[]>();
    if (pathways) {
      pathways.forEach((p) => {
        const existing = pathwaysMap.get(p.career_id) || [];
        existing.push({
          id: p.id,
          pathCode: (p.path_code || "PATH_A") as any,
          title: p.title,
          startingEducationLevel: p.starting_education_level,
          requiredStream: (p.required_stream || "any") as any,
          degreeQualification: p.degree_qualification,
          durationYears: p.duration_years || 3,
          entranceExams: (p.entrance_exams || []).map((examName: string) => ({
            name: examName,
            fullName: examName,
            conductingBody: "National Testing Agency",
            websiteUrl: "https://nta.ac.in",
            description: `National entrance examination for ${p.title}.`,
            eligibility: `Requires ${p.starting_education_level}.`,
          })),
          entryRequirements: [],
          keySkills: p.key_skills || [],
          steps: Array.isArray(p.steps)
            ? p.steps.map((st: any, idx: number) => ({
                stepNumber: st.step_number || idx + 1,
                stageName: st.title || `Stage ${idx + 1}`,
                description: st.description || st.title || "",
                type: "degree" as const,
              }))
            : [],
          alternativeRoutes: p.alternative_routes || [],
          officialSources: Array.isArray(p.official_sources) ? p.official_sources : [],
        });
        pathwaysMap.set(p.career_id, existing);
      });
    }

    const mappedProfessions: any[] = careers.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: (c.category || "technology") as any,
      shortDescription: c.short_description || "",
      iconName: c.icon || "Code",
      demandLevel: (c.demand_level === "VERY_HIGH" ? "Very High" : "High") as any,
      avgStartingSalaryInr: `₹${Number(c.avg_starting_salary_inr || 600000).toLocaleString("en-IN")} / year`,
      suitableStreams: ["science", "any"] as any,
      pathways: pathwaysMap.get(c.id) || [],
    }));

    setDbEducationRegistry(mappedProfessions);
    console.log(`[Vayam Supabase Sync] Loaded ${mappedProfessions.length} education careers from Supabase DB!`);
    return mappedProfessions;
  } catch (err) {
    console.warn("fetchDbEducationPathways error:", err);
    setDbEducationRegistry([]);
    return [];
  }
}
