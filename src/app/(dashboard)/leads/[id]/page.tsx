"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  IndianRupee,
  MessageSquare,
  Clock,
  Send,
  Building,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  StickyNote,
  CalendarPlus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  formatDateTime,
  formatRelativeTime,
  getInitials,
  LEAD_STATUS_CONFIG,
  LEAD_SOURCE_CONFIG,
  needsFollowUp,
} from "@/lib/utils";
import type { Lead, LeadActivity, Note, Visit, LeadStatus } from "@/types";

const activityIcons: Record<string, React.ElementType> = {
  lead_created: CheckCircle2,
  lead_assigned: ArrowRightLeft,
  status_change: ArrowRightLeft,
  note_added: StickyNote,
  visit_scheduled: CalendarPlus,
  visit_completed: CheckCircle2,
  visit_cancelled: XCircle,
  call_made: Phone,
};

// Full mock lead
const mockLead: Lead = {
  id: "1",
  name: "Rahul Sharma",
  phone: "+919999999999",
  email: "rahul.sharma@email.com",
  source: "WEBSITE_FORM",
  status: "CONTACTED",
  budget: "8,000 - 12,000",
  preferredArea: "Koramangala, HSR Layout",
  moveInDate: "2025-04-01",
  occupation: "Software Engineer at Flipkart",
  notes: "Looking for a single occupancy PG with AC and WiFi. Vegetarian food preferred.",
  assignedTo: { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" },
  assignedToId: "a1",
  createdAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
  updatedAt: new Date().toISOString(),
  lastActivityAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
  activities: [
    { id: "act1", leadId: "1", userId: "a1", type: "status_change", description: "Status changed from NEW LEAD to CONTACTED", createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), user: { id: "a1", name: "Priya Nair", avatar: null } },
    { id: "act2", leadId: "1", userId: "a1", type: "note_added", description: 'Note added: "Spoke with Rahul. Interested in Koramangala PGs. Budget around 10k."', createdAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString(), user: { id: "a1", name: "Priya Nair", avatar: null } },
    { id: "act3", leadId: "1", userId: "a1", type: "lead_assigned", description: "Lead assigned to Priya Nair", createdAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString(), user: { id: "a1", name: "Priya Nair", avatar: null } },
    { id: "act4", leadId: "1", type: "lead_created", description: "Lead created from website form", createdAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString() },
  ] as LeadActivity[],
  leadNotes: [
    { id: "n1", leadId: "1", userId: "a1", content: "Spoke with Rahul. Interested in Koramangala PGs. Budget around 10k. Prefers single occupancy with AC.", user: { id: "a1", name: "Priya Nair", avatar: null }, createdAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString(), updatedAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString() },
    { id: "n2", leadId: "1", userId: "a1", content: "Shared 3 PG options in Koramangala 5th Block. Rahul said he'll check and confirm for visit.", user: { id: "a1", name: "Priya Nair", avatar: null }, createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), updatedAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
  ] as Note[],
  visits: [] as Visit[],
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead>(mockLead);
  const [noteText, setNoteText] = useState("");
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [visit, setVisit] = useState({
    propertyName: "",
    visitDate: "",
    visitTime: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(`/api/leads/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setLead(json.data);
        }
      } catch {
        // Use mock
      }
    }
    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setLead((prev) => ({ ...prev, status: newStatus as LeadStatus }));
      }
    } catch {
      setLead((prev) => ({ ...prev, status: newStatus as LeadStatus }));
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteText, userId: lead.assignedToId || "demo-admin" }),
      });
      const json = await res.json();
      if (json.success) {
        setLead((prev) => ({
          ...prev,
          leadNotes: [json.data, ...(prev.leadNotes || [])],
        }));
      }
    } catch {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        leadId: lead.id,
        userId: "a1",
        content: noteText,
        user: { id: "a1", name: "Admin User", avatar: null } as Note["user"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLead((prev) => ({
        ...prev,
        leadNotes: [newNote, ...(prev.leadNotes || [])],
      }));
    }

    setNoteText("");
  };

  const handleScheduleVisit = async () => {
    if (!visit.propertyName || !visit.visitDate || !visit.visitTime) return;

    try {
      await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          agentId: lead.assignedToId || "demo-admin",
          ...visit,
        }),
      });
    } catch {
      // Demo mode
    }

    setVisit({ propertyName: "", visitDate: "", visitTime: "", notes: "" });
    setShowVisitDialog(false);
  };

  const statusConfig = LEAD_STATUS_CONFIG[lead.status];
  const sourceConfig = LEAD_SOURCE_CONFIG[lead.source];
  const followUp = needsFollowUp(lead.lastActivityAt);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{getInitials(lead.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-100">{lead.name}</h1>
                {followUp && (
                  <Badge variant="warning" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Follow up needed
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowVisitDialog(true)}>
              <Building className="h-4 w-4" />
              Schedule Visit
            </Button>
            <Select value={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={cn("w-48", statusConfig?.bgColor)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Info + Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={MessageSquare} label="Source" value={sourceConfig?.label || lead.source} />
                <InfoItem icon={Briefcase} label="Occupation" value={lead.occupation || "Not specified"} />
                <InfoItem icon={MapPin} label="Preferred Area" value={lead.preferredArea || "Not specified"} />
                <InfoItem icon={IndianRupee} label="Budget" value={lead.budget ? `₹${lead.budget}/mo` : "Not specified"} />
                <InfoItem icon={Calendar} label="Move-in Date" value={lead.moveInDate || "Flexible"} />
                <InfoItem icon={Clock} label="Created" value={formatDateTime(lead.createdAt)} />
              </div>
              {lead.notes && (
                <div className="mt-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                  <p className="text-xs font-medium text-zinc-500 mb-1">Additional Notes</p>
                  <p className="text-sm text-zinc-300">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note about this lead..."
                  className="min-h-[80px]"
                />
              </div>
              <Button variant="primary" size="sm" className="mb-6 gap-2" onClick={handleAddNote}>
                <Send className="h-3 w-3" />
                Add Note
              </Button>

              <div className="space-y-3">
                {(lead.leadNotes || []).map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[8px]">
                            {note.user ? getInitials(note.user.name) : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-zinc-400">
                          {note.user?.name || "Unknown"}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        {formatRelativeTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300">{note.content}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Assigned Agent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assigned Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.assignedTo ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(lead.assignedTo.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{lead.assignedTo.name}</p>
                    <p className="text-xs text-zinc-500">{lead.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No agent assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(lead.activities || []).map((activity, i) => {
                  const Icon = activityIcons[activity.type] || Clock;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08]">
                          <Icon className="h-3 w-3 text-zinc-500" />
                        </div>
                        {i < (lead.activities?.length || 0) - 1 && (
                          <div className="w-px flex-1 bg-white/[0.06] mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-xs text-zinc-300">{activity.description}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          {formatRelativeTime(activity.createdAt)}
                          {activity.user && ` · ${activity.user.name}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scheduled Visits</CardTitle>
            </CardHeader>
            <CardContent>
              {(lead.visits || []).length > 0 ? (
                <div className="space-y-2">
                  {(lead.visits || []).map((v) => (
                    <div key={v.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-sm font-medium text-zinc-200">{v.propertyName}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatDateTime(v.visitDate)} at {v.visitTime}
                      </p>
                      <Badge className="mt-2 text-[10px]">{v.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-600">No visits scheduled</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visit Dialog */}
      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Visit</DialogTitle>
            <DialogDescription>Schedule a property visit for {lead.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Property Name *</label>
              <Input
                value={visit.propertyName}
                onChange={(e) => setVisit({ ...visit, propertyName: e.target.value })}
                placeholder="e.g., Stanza Living Koramangala"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Date *</label>
                <Input
                  type="date"
                  value={visit.visitDate}
                  onChange={(e) => setVisit({ ...visit, visitDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Time *</label>
                <Input
                  type="time"
                  value={visit.visitTime}
                  onChange={(e) => setVisit({ ...visit, visitTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Notes</label>
              <Textarea
                value={visit.notes}
                onChange={(e) => setVisit({ ...visit, notes: e.target.value })}
                placeholder="Any special instructions..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowVisitDialog(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleScheduleVisit}>Schedule Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] mt-0.5">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">{label}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
