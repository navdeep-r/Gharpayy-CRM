import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalLeads,
    newLeadsToday,
    visitsScheduled,
    bookingsConfirmed,
    leadsByStatus,
    leadsBySource,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.visit.count({ where: { status: "SCHEDULED" } }),
    prisma.lead.count({ where: { status: "BOOKED" } }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["source"],
      _count: { id: true },
    }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, avatar: true },
        },
      },
    }),
  ]);

  const conversionRate =
    totalLeads > 0 ? (bookingsConfirmed / totalLeads) * 100 : 0;

  return {
    totalLeads,
    newLeadsToday,
    visitsScheduled,
    bookingsConfirmed,
    conversionRate: Math.round(conversionRate * 10) / 10,
    leadsByStage: leadsByStatus.map((s) => ({
      stage: s.status,
      count: s._count.id,
    })),
    leadsBySource: leadsBySource.map((s) => ({
      source: s.source,
      count: s._count.id,
    })),
    recentLeads,
  };
}
