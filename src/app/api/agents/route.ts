import { NextRequest, NextResponse } from "next/server";
import { getAgents } from "@/services/agents";

export async function GET(_request: NextRequest) {
  try {
    const agents = await getAgents();
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
