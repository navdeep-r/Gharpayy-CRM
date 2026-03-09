"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type { Visit } from "@/types";

const visitStatusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  SCHEDULED: { label: "Scheduled", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", icon: Clock },
  COMPLETED: { label: "Completed", color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", icon: XCircle },
};

const mockVisits: Visit[] = [
  {
    id: "v1", leadId: "1", agentId: "a1", propertyName: "Stanza Living - Koramangala 5th Block",
    visitDate: new Date(Date.now() + 1000 * 3600 * 24).toISOString(), visitTime: "10:30 AM",
    status: "SCHEDULED",
    lead: { id: "1", name: "Rahul Sharma", phone: "+919999999999", source: "WEBSITE_FORM" } as Visit["lead"],
    agent: { id: "a1", name: "Priya Nair", avatar: null } as Visit["agent"],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "v2", leadId: "3", agentId: "a1", propertyName: "Zolo Stays - Indiranagar",
    visitDate: new Date(Date.now() + 1000 * 3600 * 48).toISOString(), visitTime: "2:00 PM",
    status: "SCHEDULED",
    lead: { id: "3", name: "Vikram Singh", phone: "+919777777777", source: "GOOGLE_FORM" } as Visit["lead"],
    agent: { id: "a1", name: "Priya Nair", avatar: null } as Visit["agent"],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "v3", leadId: "8", agentId: "a3", propertyName: "Colive - HSR Layout Sector 2",
    visitDate: new Date(Date.now() - 1000 * 3600 * 24).toISOString(), visitTime: "11:00 AM",
    status: "COMPLETED", outcome: "Liked the property, will confirm in 2 days",
    lead: { id: "8", name: "Sneha Reddy", phone: "+919444433333", source: "REFERRAL" } as Visit["lead"],
    agent: { id: "a3", name: "Deepa Iyer", avatar: null } as Visit["agent"],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "v4", leadId: "4", agentId: "a3", propertyName: "OYO Life - BTM Layout",
    visitDate: new Date(Date.now() - 1000 * 3600 * 72).toISOString(), visitTime: "4:00 PM",
    status: "CANCELLED", outcome: "Lead changed preferred area",
    lead: { id: "4", name: "Meera Krishnan", phone: "+919666666666", source: "SOCIAL_MEDIA" } as Visit["lead"],
    agent: { id: "a3", name: "Deepa Iyer", avatar: null } as Visit["agent"],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "v5", leadId: "5", agentId: "a2", propertyName: "NestAway - Whitefield",
    visitDate: new Date(Date.now() + 1000 * 3600 * 72).toISOString(), visitTime: "3:30 PM",
    status: "SCHEDULED",
    lead: { id: "5", name: "Karthik Reddy", phone: "+919555555555", source: "PHONE_CALL" } as Visit["lead"],
    agent: { id: "a2", name: "Arjun Menon", avatar: null } as Visit["agent"],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchVisits() {
      try {
        const params = new URLSearchParams();
        if (filterStatus !== "all") params.set("status", filterStatus);
        const res = await fetch(`/api/visits?${params}`);
        const json = await res.json();
        if (json.success && json.data?.length) {
          setVisits(json.data);
        }
      } catch {
        // Use mock
      }
    }
    fetchVisits();
  }, [filterStatus]);

  const handleUpdateStatus = async (visitId: string, status: string) => {
    try {
      await fetch("/api/visits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, status }),
      });
    } catch {
      // Demo mode
    }
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: status as Visit["status"] } : v))
    );
  };

  const filteredVisits = filterStatus === "all" ? visits : visits.filter((v) => v.status === filterStatus);

  const scheduledCount = visits.filter((v) => v.status === "SCHEDULED").length;
  const completedCount = visits.filter((v) => v.status === "COMPLETED").length;
  const cancelledCount = visits.filter((v) => v.status === "CANCELLED").length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Visits"
        description="Manage property visit schedules"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{scheduledCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Scheduled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{completedCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{cancelledCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Cancelled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <Filter className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            <SelectValue placeholder="All visits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visits</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visits List */}
      <div className="space-y-3">
        {filteredVisits.map((visit, i) => {
          const config = visitStatusConfig[visit.status];
          const StatusIcon = config.icon;
          const isUpcoming = new Date(visit.visitDate) > new Date();

          return (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  {/* Date */}
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0">
                    <p className="text-lg font-bold text-zinc-200">
                      {new Date(visit.visitDate).getDate()}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                      {new Date(visit.visitDate).toLocaleString("en", { month: "short" })}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building className="h-3.5 w-3.5 text-zinc-500" />
                      <p className="text-sm font-medium text-zinc-200 truncate">{visit.propertyName}</p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {visit.lead?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {visit.visitTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Agent: {visit.agent?.name}
                      </span>
                    </div>
                    {visit.outcome && (
                      <p className="mt-1 text-xs text-zinc-400 italic">{visit.outcome}</p>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${config.bgColor} ${config.color} border gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                    {visit.status === "SCHEDULED" && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          onClick={() => handleUpdateStatus(visit.id, "COMPLETED")}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleUpdateStatus(visit.id, "CANCELLED")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filteredVisits.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No visits found</p>
          </div>
        )}
      </div>
    </div>
  );
}
