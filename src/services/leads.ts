import { prisma } from "@/lib/prisma";
import type { LeadSource, LeadStatus } from "@/types";

export async function getLeads(filters?: {
  status?: LeadStatus;
  source?: LeadSource;
  assignedToId?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.source) where.source = filters.source;
  if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.lead.findMany({
    where,
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      activities: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      leadNotes: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      visits: {
        include: { agent: { select: { id: true, name: true, avatar: true } } },
        orderBy: { visitDate: "desc" },
      },
    },
  });
}

export async function createLead(data: {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  budget?: string;
  preferredArea?: string;
  moveInDate?: string;
  occupation?: string;
  notes?: string;
}) {
  // Auto-assign using round robin (agent with fewest active leads)
  const agent = await prisma.user.findFirst({
    where: { role: "AGENT", isActive: true },
    orderBy: { activeLeads: "asc" },
  });

  const lead = await prisma.lead.create({
    data: {
      ...data,
      assignedToId: agent?.id ?? null,
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });

  // Increment agent's active leads count
  if (agent) {
    await prisma.user.update({
      where: { id: agent.id },
      data: { activeLeads: { increment: 1 } },
    });
  }

  // Log activity
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      type: "lead_created",
      description: `Lead created from ${data.source.replace(/_/g, " ").toLowerCase()}`,
    },
  });

  if (agent) {
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: agent.id,
        type: "lead_assigned",
        description: `Lead assigned to ${agent.name}`,
      },
    });
  }

  return lead;
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  userId?: string
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const oldStatus = lead.status;

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      lastActivityAt: new Date(),
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });

  // Handle active leads count changes
  if (status === "BOOKED" || status === "LOST") {
    if (lead.assignedToId) {
      await prisma.user.update({
        where: { id: lead.assignedToId },
        data: { activeLeads: { decrement: 1 } },
      });
    }
  }

  await prisma.leadActivity.create({
    data: {
      leadId,
      userId,
      type: "status_change",
      description: `Status changed from ${oldStatus.replace(/_/g, " ")} to ${status.replace(/_/g, " ")}`,
      metadata: JSON.stringify({ from: oldStatus, to: status }),
    },
  });

  return updated;
}

export async function updateLead(
  leadId: string,
  data: Partial<{
    name: string;
    phone: string;
    email: string;
    budget: string;
    preferredArea: string;
    moveInDate: string;
    occupation: string;
    notes: string;
    assignedToId: string;
  }>
) {
  return prisma.lead.update({
    where: { id: leadId },
    data: {
      ...data,
      lastActivityAt: new Date(),
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
}

export async function getLeadsByStage() {
  const leads = await prisma.lead.findMany({
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const stages: Record<string, typeof leads> = {
    NEW_LEAD: [],
    CONTACTED: [],
    REQUIREMENT_COLLECTED: [],
    PROPERTY_SUGGESTED: [],
    VISIT_SCHEDULED: [],
    VISIT_COMPLETED: [],
    BOOKED: [],
    LOST: [],
  };

  for (const lead of leads) {
    stages[lead.status]?.push(lead);
  }

  return stages;
}
