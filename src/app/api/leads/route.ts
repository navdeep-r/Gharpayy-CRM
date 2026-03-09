import { NextRequest, NextResponse } from "next/server";
import { getLeads, createLead } from "@/services/leads";
import type { LeadSource, LeadStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | null;
    const source = searchParams.get("source") as LeadSource | null;
    const assignedToId = searchParams.get("assignedToId");
    const search = searchParams.get("search");

    const leads = await getLeads({
      status: status || undefined,
      source: source || undefined,
      assignedToId: assignedToId || undefined,
      search: search || undefined,
    });

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.source) {
      return NextResponse.json(
        { success: false, error: "name, phone, and source are required" },
        { status: 400 }
      );
    }

    // Normalize source name to enum format
    const sourceMap: Record<string, LeadSource> = {
      "whatsapp": "WHATSAPP",
      "website form": "WEBSITE_FORM",
      "website_form": "WEBSITE_FORM",
      "social media": "SOCIAL_MEDIA",
      "social_media": "SOCIAL_MEDIA",
      "phone call": "PHONE_CALL",
      "phone_call": "PHONE_CALL",
      "google form": "GOOGLE_FORM",
      "google_form": "GOOGLE_FORM",
      "lead questionnaire": "LEAD_QUESTIONNAIRE",
      "lead_questionnaire": "LEAD_QUESTIONNAIRE",
      "referral": "REFERRAL",
      "other": "OTHER",
    };

    const normalizedSource =
      sourceMap[body.source.toLowerCase()] || (body.source as LeadSource);

    const lead = await createLead({
      name: body.name,
      phone: body.phone,
      email: body.email,
      source: normalizedSource,
      budget: body.budget,
      preferredArea: body.preferredArea,
      moveInDate: body.moveInDate,
      occupation: body.occupation,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
