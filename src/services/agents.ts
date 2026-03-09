import { prisma } from "@/lib/prisma";

export async function getAgents() {
  return prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      activeLeads: true,
      isActive: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          assignedLeads: true,
          visits: true,
        },
      },
    },
  });
}

export async function getAgentById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      assignedLeads: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      visits: {
        orderBy: { visitDate: "desc" },
        take: 10,
        include: {
          lead: { select: { id: true, name: true, phone: true } },
        },
      },
    },
  });
}

export async function getAgentPerformance() {
  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    select: {
      id: true,
      name: true,
      avatar: true,
      activeLeads: true,
      assignedLeads: {
        where: { status: "BOOKED" },
        select: { id: true },
      },
      visits: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    avatar: agent.avatar,
    activeLeads: agent.activeLeads,
    bookings: agent.assignedLeads.length,
    visitsCompleted: agent.visits.length,
  }));
}
