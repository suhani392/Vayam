/**
 * app/api/ai/timeline/route.ts
 *
 * Server API route for Groq AI Civic Identity & Document Timeline Analysis.
 * Reads database records dynamically from KnowledgeRepository (Supabase DB).
 * Runs deterministically (temperature: 0) to output exact, consistent civic milestones:
 * Voter ID, Driving Licence, Passport, Aadhaar, PAN Card, Electoral Candidacy, Senior Citizen ID.
 */

import { NextResponse } from "next/server";
import { KnowledgeRepository } from "@/lib/knowledge/repository";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in server environment." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { profile } = body;

    if (!profile || !profile.dateOfBirth) {
      return NextResponse.json({ error: "Profile with Date of Birth is required." }, { status: 400 });
    }

    // Compute exact age
    const dob = new Date(profile.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Fetch dynamic database records from Supabase DB
    await KnowledgeRepository.syncWithDatabase();
    const dbRecords = KnowledgeRepository.getAllKnowledgeRecords();
    const dbSummary = dbRecords.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.shortDescription || r.fullDescription || "",
      officialUrl: r.application?.officialUrl || "/explore",
    }));

    const systemPrompt = `You are the Vayam Official Civic Identity & Document Timeline Engine.
Your task is to produce a 100% consistent, deterministic civic milestone roadmap for an Indian citizen based on their profile.

CRITICAL RULES:
1. Base all recommendations ONLY on official identity cards, government registrations, licences, passports, and constitutional milestones.
2. DO NOT include general financial investment schemes, corporate scholarships, or welfare subsidies (e.g. Sukanya Samriddhi Yojana SSY, PM-USP CSSS, etc. belong on the Explore page, NOT on Timeline).
3. STRICT GENDER RULE: Citizen's gender is '${profile.gender || "not_set"}'. If gender is 'male', NEVER output female-only schemes or girl child programs (such as Sukanya Samriddhi Yojana).
4. DO NOT use any emoji characters in titles or descriptions. Use clean text titles only.
5. Set 'actionUrl' to the direct official government portal URL (e.g., 'https://voters.eci.gov.in' for Voter ID, 'https://sarathi.parivahan.gov.in' for Driving Licence, 'https://myaadhaar.uidai.gov.in' for Aadhaar, 'https://www.passportindia.gov.in' for Passport, 'https://eportal.incometax.gov.in' for PAN Card). DO NOT return internal routes.
6. Be 100% deterministic and consistent (temperature 0).

Categorize items strictly into:
- "now": Active identity documents & registrations available right now for age ${age}.
- "next": Upcoming near-term identity milestones in 1-3 years (e.g., turning 18 for Voter ID Form 6 / Driving Licence, turning 21 for local body election candidacy if age is 18-20).
- "later": Future identity milestones 3+ years away (e.g., turning 25 for MP/MLA election candidacy, turning 60 for Senior Citizen Card).

Return ONLY valid JSON matching this schema:
{
  "aiSummary": "Deterministic summary of official identity documents & civic milestones for age ${age}",
  "now": [
    {
      "id": "doc_id",
      "title": "Title",
      "description": "Clear description of civic identity requirement",
      "category": "Official Identity / Licence / Registration",
      "actionLabel": "Apply / Verify",
      "actionUrl": "/explore"
    }
  ],
  "next": [
    {
      "id": "doc_id",
      "title": "Title",
      "description": "Clear description of near-term upcoming milestone",
      "category": "Upcoming Milestone",
      "actionLabel": "Learn More",
      "actionUrl": "/explore"
    }
  ],
  "later": [
    {
      "id": "doc_id",
      "title": "Title",
      "description": "Clear description of future milestone",
      "category": "Future Milestone",
      "actionLabel": "Plan Ahead",
      "actionUrl": "/rights"
    }
  ]
}`;

    const userPrompt = `Citizen Profile Details:
- Date of Birth: ${profile.dateOfBirth} (Exact Age: ${age} years old)
- State of Residence: ${profile.location?.stateName || profile.location?.stateCode || "All India"}
- Employment Status: ${profile.employmentStatus || "Not set"}
- Education Level: ${profile.educationLevel || "Not set"}

Verified Database Knowledge Records Available:
${JSON.stringify(dbSummary.slice(0, 20), null, 2)}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0, // Zero temperature for 100% deterministic consistent output
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Groq Timeline Route Error]", response.status, errText);
      return NextResponse.json(
        { error: `Groq API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(rawContent);

    return NextResponse.json({ success: true, timeline: parsed });
  } catch (err: any) {
    console.error("[Groq Timeline Route Exception]", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
