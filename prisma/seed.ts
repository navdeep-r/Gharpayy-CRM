import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gharpayy.com" },
    update: {},
    create: {
      id: "demo-admin",
      name: "Admin User",
      email: "admin@gharpayy.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "+919900000000",
    },
  });
  console.log("Created admin:", admin.name);

  // Create agents
  const agentPassword = await hash("agent123", 12);
  const agentData = [
    { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", phone: "+919876543210" },
    { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", phone: "+919876543211" },
    { id: "a3", name: "Deepa Iyer", email: "deepa@gharpayy.com", phone: "+919876543212" },
    { id: "a4", name: "Rohan Das", email: "rohan@gharpayy.com", phone: "+919876543213" },
  ];

  const agents = [];
  for (const a of agentData) {
    const agent = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        ...a,
        passwordHash: agentPassword,
        role: "AGENT",
        isActive: true,
      },
    });
    agents.push(agent);
    console.log("Created agent:", agent.name);
  }

  // Create leads
  const leadData = [
    { name: "Rahul Sharma", phone: "+919999999999", email: "rahul.sharma@email.com", source: "WEBSITE_FORM" as const, status: "CONTACTED" as const, budget: "8,000 - 12,000", preferredArea: "Koramangala", occupation: "Software Engineer at Flipkart", moveInDate: "2025-04-01", notes: "Looking for single occupancy PG with AC and WiFi." },
    { name: "Ananya Patel", phone: "+919888888888", email: "ananya.p@email.com", source: "WHATSAPP" as const, status: "REQUIREMENT_COLLECTED" as const, budget: "10,000 - 15,000", preferredArea: "HSR Layout", occupation: "Data Analyst at Infosys" },
    { name: "Vikram Singh", phone: "+919777777777", source: "GOOGLE_FORM" as const, status: "VISIT_SCHEDULED" as const, budget: "7,000 - 10,000", preferredArea: "Indiranagar", occupation: "Student at IIM Bangalore" },
    { name: "Meera Krishnan", phone: "+919666666666", source: "SOCIAL_MEDIA" as const, status: "REQUIREMENT_COLLECTED" as const, budget: "6,000 - 9,000", preferredArea: "BTM Layout", occupation: "Student at Christ University" },
    { name: "Karthik Reddy", phone: "+919555555555", email: "karthik.r@email.com", source: "PHONE_CALL" as const, status: "PROPERTY_SUGGESTED" as const, budget: "12,000 - 18,000", preferredArea: "Whitefield", occupation: "Product Manager at Amazon" },
    { name: "Sneha Reddy", phone: "+919444433333", source: "REFERRAL" as const, status: "VISIT_COMPLETED" as const, budget: "8,000 - 11,000", preferredArea: "HSR Layout", occupation: "UX Designer" },
    { name: "Pooja Sharma", phone: "+919333322222", email: "pooja@email.com", source: "WEBSITE_FORM" as const, status: "BOOKED" as const, budget: "9,000 - 13,000", preferredArea: "Koramangala", occupation: "Marketing Executive" },
    { name: "Aditya Kumar", phone: "+919555544444", source: "PHONE_CALL" as const, status: "CONTACTED" as const, budget: "7,000 - 10,000", preferredArea: "Electronic City", occupation: "Software Developer at TCS" },
    { name: "Neha Gupta", phone: "+919888877777", email: "neha.g@email.com", source: "GOOGLE_FORM" as const, status: "NEW_LEAD" as const, budget: "6,000 - 8,000", preferredArea: "Marathahalli", occupation: "Student at PES University" },
    { name: "Ravi Kumar", phone: "+919222211111", source: "SOCIAL_MEDIA" as const, status: "LOST" as const, budget: "5,000 - 7,000", preferredArea: "JP Nagar", occupation: "Intern at Wipro", notes: "Budget too low for preferred area." },
    { name: "Priyanka Das", phone: "+919111100000", email: "priyanka.d@email.com", source: "LEAD_QUESTIONNAIRE" as const, status: "NEW_LEAD" as const, budget: "10,000 - 14,000", preferredArea: "Indiranagar", occupation: "Content Writer" },
    { name: "Sanjay Mehta", phone: "+919000099999", source: "WHATSAPP" as const, status: "NEW_LEAD" as const, budget: "8,000 - 12,000", preferredArea: "Koramangala", occupation: "Freelance Developer" },
    { name: "Divya Nair", phone: "+919998887777", source: "WEBSITE_FORM" as const, status: "CONTACTED" as const, budget: "11,000 - 16,000", preferredArea: "MG Road", occupation: "Financial Analyst at Goldman Sachs" },
    { name: "Mohit Verma", phone: "+919887766555", source: "GOOGLE_FORM" as const, status: "PROPERTY_SUGGESTED" as const, budget: "9,000 - 12,000", preferredArea: "Bellandur", occupation: "Cloud Engineer at Microsoft" },
    { name: "Anjali Rao", phone: "+919776655444", email: "anjali@email.com", source: "REFERRAL" as const, status: "VISIT_SCHEDULED" as const, budget: "7,000 - 10,000", preferredArea: "Jayanagar", occupation: "Teacher" },
  ];

  for (let i = 0; i < leadData.length; i++) {
    const agentIndex = i % agents.length;
    const createdAgo = (leadData.length - i) * 3600000 * 6; // Each lead 6 hours apart
    const lastActive = Math.random() > 0.3 ? createdAgo / 2 : createdAgo + 24 * 3600000; // Some need follow-up

    const lead = await prisma.lead.create({
      data: {
        ...leadData[i],
        assignedToId: agents[agentIndex].id,
        createdAt: new Date(Date.now() - createdAgo),
        lastActivityAt: new Date(Date.now() - lastActive),
      },
    });

    // Update agent active leads count
    if (leadData[i].status !== "BOOKED" && leadData[i].status !== "LOST") {
      await prisma.user.update({
        where: { id: agents[agentIndex].id },
        data: { activeLeads: { increment: 1 } },
      });
    }

    // Create activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "lead_created",
        description: `Lead created from ${leadData[i].source.replace(/_/g, " ").toLowerCase()}`,
        createdAt: new Date(Date.now() - createdAgo),
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: agents[agentIndex].id,
        type: "lead_assigned",
        description: `Lead assigned to ${agents[agentIndex].name}`,
        createdAt: new Date(Date.now() - createdAgo + 60000),
      },
    });

    if (leadData[i].status !== "NEW_LEAD") {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: agents[agentIndex].id,
          type: "status_change",
          description: `Status changed from NEW LEAD to ${leadData[i].status.replace(/_/g, " ")}`,
          createdAt: new Date(Date.now() - lastActive),
        },
      });
    }

    // Add notes for some leads
    if (i < 5) {
      await prisma.note.create({
        data: {
          leadId: lead.id,
          userId: agents[agentIndex].id,
          content: `Initial conversation with ${leadData[i].name}. ${leadData[i].preferredArea ? `Interested in ${leadData[i].preferredArea} area.` : ""} ${leadData[i].budget ? `Budget: ₹${leadData[i].budget}/month.` : ""}`,
          createdAt: new Date(Date.now() - lastActive + 300000),
        },
      });
    }

    console.log(`Created lead: ${lead.name} (${lead.status})`);
  }

  // Create visits
  const visitData = [
    { leadIndex: 2, agentIndex: 0, propertyName: "Stanza Living - Koramangala 5th Block", daysFromNow: 1, time: "10:30 AM", status: "SCHEDULED" as const },
    { leadIndex: 14, agentIndex: 2, propertyName: "Zolo Stays - Jayanagar 4th Block", daysFromNow: 2, time: "2:00 PM", status: "SCHEDULED" as const },
    { leadIndex: 5, agentIndex: 2, propertyName: "Colive - HSR Layout Sector 2", daysFromNow: -1, time: "11:00 AM", status: "COMPLETED" as const, outcome: "Liked the property, will confirm in 2 days" },
    { leadIndex: 4, agentIndex: 1, propertyName: "NestAway - Whitefield Main Road", daysFromNow: 3, time: "3:30 PM", status: "SCHEDULED" as const },
  ];

  // We need to get the lead IDs from the database
  const allLeads = await prisma.lead.findMany({ orderBy: { createdAt: "asc" } });

  for (const v of visitData) {
    if (allLeads[v.leadIndex]) {
      await prisma.visit.create({
        data: {
          leadId: allLeads[v.leadIndex].id,
          agentId: agents[v.agentIndex].id,
          propertyName: v.propertyName,
          visitDate: new Date(Date.now() + v.daysFromNow * 86400000),
          visitTime: v.time,
          status: v.status,
          outcome: v.outcome || null,
        },
      });
      console.log(`Created visit: ${v.propertyName} (${v.status})`);
    }
  }

  console.log("\nSeed completed successfully!");
  console.log(`Created: 1 admin, ${agents.length} agents, ${leadData.length} leads, ${visitData.length} visits`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
