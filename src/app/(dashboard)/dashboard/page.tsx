"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/dashboard-layout";
import { DashboardStats } from "@/components/dashboard/stat-cards";
import { PipelineChart, SourceChart } from "@/components/dashboard/charts";
import { RecentLeads, AgentLeaderboard } from "@/components/dashboard/recent-leads";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { DashboardStats as DashboardStatsType, Lead } from "@/types";

// Mock data for demo (used when DB isn't connected)
const mockStats: DashboardStatsType = {
  totalLeads: 247,
  newLeadsToday: 12,
  visitsScheduled: 8,
  bookingsConfirmed: 34,
  conversionRate: 13.8,
  leadsByStage: [
    { stage: "NEW_LEAD", count: 45 },
    { stage: "CONTACTED", count: 38 },
    { stage: "REQUIREMENT_COLLECTED", count: 32 },
    { stage: "PROPERTY_SUGGESTED", count: 28 },
    { stage: "VISIT_SCHEDULED", count: 25 },
    { stage: "VISIT_COMPLETED", count: 18 },
    { stage: "BOOKED", count: 34 },
    { stage: "LOST", count: 27 },
  ],
  leadsBySource: [
    { source: "WHATSAPP", count: 68 },
    { source: "WEBSITE_FORM", count: 52 },
    { source: "SOCIAL_MEDIA", count: 41 },
    { source: "GOOGLE_FORM", count: 35 },
    { source: "PHONE_CALL", count: 28 },
    { source: "REFERRAL", count: 23 },
  ],
  recentLeads: [
    {
      id: "1",
      name: "Rahul Sharma",
      phone: "+919999999999",
      source: "WEBSITE_FORM",
      status: "NEW_LEAD",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" },
    },
    {
      id: "2",
      name: "Ananya Patel",
      phone: "+919888888888",
      source: "WHATSAPP",
      status: "CONTACTED",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      assignedTo: { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" },
    },
    {
      id: "3",
      name: "Vikram Singh",
      phone: "+919777777777",
      source: "GOOGLE_FORM",
      status: "VISIT_SCHEDULED",
      createdAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date(Date.now() - 1000 * 3600 * 26).toISOString(),
      assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" },
    },
    {
      id: "4",
      name: "Meera Krishnan",
      phone: "+919666666666",
      source: "SOCIAL_MEDIA",
      status: "REQUIREMENT_COLLECTED",
      createdAt: new Date(Date.now() - 1000 * 3600 * 8).toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date(Date.now() - 1000 * 3600 * 8).toISOString(),
      assignedTo: { id: "a3", name: "Deepa Iyer", email: "deepa@gharpayy.com", role: "AGENT", activeLeads: 7, isActive: true, createdAt: "", updatedAt: "" },
    },
    {
      id: "5",
      name: "Karthik Reddy",
      phone: "+919555555555",
      source: "PHONE_CALL",
      status: "PROPERTY_SUGGESTED",
      createdAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
      assignedTo: { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" },
    },
  ] as Lead[],
  agentPerformance: [
    { id: "a1", name: "Priya Nair", activeLeads: 12, bookings: 8 },
    { id: "a2", name: "Arjun Menon", activeLeads: 9, bookings: 6 },
    { id: "a3", name: "Deepa Iyer", activeLeads: 7, bookings: 5 },
    { id: "a4", name: "Rohan Das", activeLeads: 11, bookings: 4 },
  ],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsType>(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            ...json.data,
            agentPerformance: json.data.agentPerformance || mockStats.agentPerformance,
          });
        }
      } catch {
        // Use mock data if API unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's your CRM overview."
        action={
          <Button variant="primary" className="gap-2" onClick={() => window.location.href = '/leads'}>
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        }
      />

      <DashboardStats stats={stats} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PipelineChart data={stats.leadsByStage} />
        <SourceChart data={stats.leadsBySource} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentLeads leads={stats.recentLeads} />
        </div>
        <div className="lg:col-span-2">
          <AgentLeaderboard agents={stats.agentPerformance} />
        </div>
      </div>
    </div>
  );
}
