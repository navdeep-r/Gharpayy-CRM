import { NextRequest, NextResponse } from "next/server";
import { getLeadsByStage } from "@/services/leads";

export async function GET(_request: NextRequest) {
  try {
    const pipeline = await getLeadsByStage();
    return NextResponse.json({ success: true, data: pipeline });
  } catch (error) {
    console.error("Error fetching pipeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pipeline" },
      { status: 500 }
    );
  }
}
