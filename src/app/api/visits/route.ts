import { NextRequest, NextResponse } from "next/server";
import { getVisits, createVisit, updateVisitStatus } from "@/services/visits";
import type { VisitStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as VisitStatus | null;
    const agentId = searchParams.get("agentId");
    const leadId = searchParams.get("leadId");

    const visits = await getVisits({
      status: status || undefined,
      agentId: agentId || undefined,
      leadId: leadId || undefined,
    });

    return NextResponse.json({ success: true, data: visits });
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.leadId || !body.agentId || !body.propertyName || !body.visitDate || !body.visitTime) {
      return NextResponse.json(
        {
          success: false,
          error: "leadId, agentId, propertyName, visitDate, and visitTime are required",
        },
        { status: 400 }
      );
    }

    const visit = await createVisit(body);
    return NextResponse.json({ success: true, data: visit }, { status: 201 });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create visit" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.visitId || !body.status) {
      return NextResponse.json(
        { success: false, error: "visitId and status are required" },
        { status: 400 }
      );
    }

    const visit = await updateVisitStatus(body.visitId, body.status, body.outcome);
    return NextResponse.json({ success: true, data: visit });
  } catch (error) {
    console.error("Error updating visit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update visit" },
      { status: 500 }
    );
  }
}
