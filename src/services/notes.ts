import { prisma } from "@/lib/prisma";

export async function getNotes(leadId: string) {
  return prisma.note.findMany({
    where: { leadId },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createNote(data: {
  leadId: string;
  userId: string;
  content: string;
}) {
  const note = await prisma.note.create({
    data,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  await prisma.lead.update({
    where: { id: data.leadId },
    data: { lastActivityAt: new Date() },
  });

  await prisma.leadActivity.create({
    data: {
      leadId: data.leadId,
      userId: data.userId,
      type: "note_added",
      description: `Note added: "${data.content.slice(0, 80)}${data.content.length > 80 ? "..." : ""}"`,
    },
  });

  return note;
}
