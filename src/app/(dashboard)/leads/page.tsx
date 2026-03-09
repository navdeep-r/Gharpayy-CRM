"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Clock,
  AlertCircle,
  ChevronRight,
  MessageCircle,
  Globe,
  Share2,
  FileText,
  ClipboardList,
  Users as UsersIcon,
  MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  cn,
  formatRelativeTime,
  getInitials,
  LEAD_STATUS_CONFIG,
  LEAD_SOURCE_CONFIG,
  needsFollowUp,
} from "@/lib/utils";
import type { Lead, LeadSource } from "@/types";

const sourceIcons: Record<string, React.ElementType> = {
  MessageCircle, Globe, Share2, Phone, FileText, ClipboardList, Users: UsersIcon, MoreHorizontal,
};

// Mock leads for demo
const mockLeads: Lead[] = [
  { id: "1", name: "Rahul Sharma", phone: "+919999999999", email: "rahul@email.com", source: "WEBSITE_FORM", status: "NEW_LEAD", budget: "8000-12000", preferredArea: "Koramangala", occupation: "Software Engineer", createdAt: new Date(Date.now() - 1000*60*30).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*60*30).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "2", name: "Ananya Patel", phone: "+919888888888", email: "ananya@email.com", source: "WHATSAPP", status: "CONTACTED", budget: "10000-15000", preferredArea: "HSR Layout", occupation: "Data Analyst", createdAt: new Date(Date.now() - 1000*60*120).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*60*120).toISOString(), assignedTo: { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "3", name: "Vikram Singh", phone: "+919777777777", source: "GOOGLE_FORM", status: "VISIT_SCHEDULED", budget: "7000-10000", preferredArea: "Indiranagar", occupation: "Student", createdAt: new Date(Date.now() - 1000*3600*5).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*26).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "4", name: "Meera Krishnan", phone: "+919666666666", source: "SOCIAL_MEDIA", status: "REQUIREMENT_COLLECTED", budget: "6000-9000", preferredArea: "BTM Layout", occupation: "Student", createdAt: new Date(Date.now() - 1000*3600*8).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*8).toISOString(), assignedTo: { id: "a3", name: "Deepa Iyer", email: "deepa@gharpayy.com", role: "AGENT", activeLeads: 7, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "5", name: "Karthik Reddy", phone: "+919555555555", source: "PHONE_CALL", status: "PROPERTY_SUGGESTED", createdAt: new Date(Date.now() - 1000*3600*24).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*48).toISOString(), assignedTo: { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "6", name: "Pooja Sharma", phone: "+919333322222", source: "WEBSITE_FORM", status: "BOOKED", createdAt: new Date(Date.now() - 1000*3600*96).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*1).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "7", name: "Aditya Kumar", phone: "+919555544444", source: "PHONE_CALL", status: "REQUIREMENT_COLLECTED", budget: "12000-18000", preferredArea: "Whitefield", occupation: "Product Manager", createdAt: new Date(Date.now() - 1000*3600*12).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*36).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  { id: "8", name: "Sneha Reddy", phone: "+919444433333", source: "REFERRAL", status: "VISIT_COMPLETED", createdAt: new Date(Date.now() - 1000*3600*72).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*2).toISOString(), assignedTo: { id: "a3", name: "Deepa Iyer", email: "deepa@gharpayy.com", role: "AGENT", activeLeads: 7, isActive: true, createdAt: "", updatedAt: "" } },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", phone: "", email: "", source: "WEBSITE_FORM" as LeadSource });

  useEffect(() => {
    async function fetchLeads() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filterStatus !== "all") params.set("status", filterStatus);
        if (filterSource !== "all") params.set("source", filterSource);

        const res = await fetch(`/api/leads?${params}`);
        const json = await res.json();
        if (json.success && json.data?.length) {
          setLeads(json.data);
        }
      } catch {
        // Use mock
      }
    }
    fetchLeads();
  }, [search, filterStatus, filterSource]);

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.phone) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => [json.data, ...prev]);
      }
    } catch {
      // Add to local state for demo
      const mockNew: Lead = {
        id: `new-${Date.now()}`,
        ...newLead,
        status: "NEW_LEAD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      setLeads((prev) => [mockNew, ...prev]);
    }

    setNewLead({ name: "", phone: "", email: "", source: "WEBSITE_FORM" });
    setShowNewLead(false);
  };

  const filteredLeads = leads.filter((lead) => {
    if (search) {
      const q = search.toLowerCase();
      if (!lead.name.toLowerCase().includes(q) && !lead.phone.includes(q)) return false;
    }
    if (filterStatus !== "all" && lead.status !== filterStatus) return false;
    if (filterSource !== "all" && lead.source !== filterSource) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Leads"
        description={`${filteredLeads.length} leads total`}
        action={
          <Button variant="primary" className="gap-2" onClick={() => setShowNewLead(true)}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <Filter className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {Object.entries(LEAD_SOURCE_CONFIG).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Lead</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Source</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Assigned To</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Last Activity</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => {
                const statusConfig = LEAD_STATUS_CONFIG[lead.status];
                const sourceConfig = LEAD_SOURCE_CONFIG[lead.source];
                const SourceIcon = sourceIcons[sourceConfig?.icon] || Globe;
                const followUp = needsFollowUp(lead.lastActivityAt);

                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/leads/${lead.id}`} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px]">{getInitials(lead.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{lead.name}</p>
                            {followUp && <AlertCircle className="h-3 w-3 text-amber-400" />}
                          </div>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" />{lead.phone}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <SourceIcon className="h-3 w-3 text-zinc-500" />
                        <span className="text-xs text-zinc-400">{sourceConfig?.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${statusConfig?.bgColor} ${statusConfig?.color} border`}>
                        {statusConfig?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[8px]">{getInitials(lead.assignedTo.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-zinc-400">{lead.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(lead.lastActivityAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/leads/${lead.id}`}>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Dialog */}
      <Dialog open={showNewLead} onOpenChange={setShowNewLead}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Manually add a lead to the CRM</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Name *</label>
              <Input
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Enter lead name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Phone *</label>
              <Input
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="+91XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Email</label>
              <Input
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Source</label>
              <Select value={newLead.source} onValueChange={(v) => setNewLead({ ...newLead, source: v as LeadSource })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_SOURCE_CONFIG).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowNewLead(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateLead}>Create Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
