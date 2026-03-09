import { prisma } from "@/lib/prisma";
import type { VisitStatus } from "@/types";

export async function getVisits(filters?: {
  status?: VisitStatus;
  agentId?: string;
  leadId?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.agentId) where.agentId = filters.agentId;
  if (filters?.leadId) where.leadId = filters.leadId;

  return prisma.visit.findMany({
    where,
    include: {
      lead: { select: { id: true, name: true, phone: true, source: true } },
      agent: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { visitDate: "asc" },
  });
}

export async function createVisit(data: {
  leadId: string;
  agentId: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
}) {
  const visit = await prisma.visit.create({
    data: {
      leadId: data.leadId,
      agentId: data.agentId,
      propertyName: data.propertyName,
      visitDate: new Date(data.visitDate),
      visitTime: data.visitTime,
      notes: data.notes,
    },
    include: {
      lead: { select: { id: true, name: true, phone: true } },
      agent: { select: { id: true, name: true } },
    },
  });

  // Update lead activity
  await prisma.lead.update({
    where: { id: data.leadId },
    data: { lastActivityAt: new Date() },
  });

  await prisma.leadActivity.create({
    data: {
      leadId: data.leadId,
      userId: data.agentId,
      type: "visit_scheduled",
      description: `Visit scheduled at ${data.propertyName} on ${data.visitDate}`,
    },
  });

  return visit;
}

export async function updateVisitStatus(
  visitId: string,
  status: VisitStatus,
  outcome?: string
) {
  const visit = await prisma.visit.update({
    where: { id: visitId },
    data: { status, outcome },
    include: {
      lead: { select: { id: true, name: true } },
      agent: { select: { id: true, name: true } },
    },
  });

  await prisma.lead.update({
    where: { id: visit.leadId },
    data: { lastActivityAt: new Date() },
  });

  await prisma.leadActivity.create({
    data: {
      leadId: visit.leadId,
      userId: visit.agentId,
      type: `visit_${status.toLowerCase()}`,
      description: `Visit at ${visit.propertyName} marked as ${status.toLowerCase()}${outcome ? `: ${outcome}` : ""}`,
    },
  });

  return visit;
}
