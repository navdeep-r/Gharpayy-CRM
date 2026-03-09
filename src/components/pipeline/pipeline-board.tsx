"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  Clock,
  User,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  cn,
  formatRelativeTime,
  getInitials,
  LEAD_STATUS_CONFIG,
  LEAD_SOURCE_CONFIG,
  needsFollowUp,
} from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";

const PIPELINE_STAGES: LeadStatus[] = [
  "NEW_LEAD",
  "CONTACTED",
  "REQUIREMENT_COLLECTED",
  "PROPERTY_SUGGESTED",
  "VISIT_SCHEDULED",
  "VISIT_COMPLETED",
  "BOOKED",
  "LOST",
];

interface PipelineBoardProps {
  initialData?: Record<string, Lead[]>;
}

// Mock data for demo
const mockPipelineData: Record<string, Lead[]> = {
  NEW_LEAD: [
    { id: "p1", name: "Rahul Sharma", phone: "+919999999999", source: "WEBSITE_FORM", status: "NEW_LEAD", createdAt: new Date(Date.now() - 1000*60*30).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*60*30).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
    { id: "p2", name: "Neha Gupta", phone: "+919888877777", source: "GOOGLE_FORM", status: "NEW_LEAD", createdAt: new Date(Date.now() - 1000*60*90).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*26).toISOString(), assignedTo: { id: "a2", name: "Arjun Menon", email: "", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  CONTACTED: [
    { id: "p3", name: "Ananya Patel", phone: "+919888888888", source: "WHATSAPP", status: "CONTACTED", createdAt: new Date(Date.now() - 1000*60*120).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*60*120).toISOString(), assignedTo: { id: "a2", name: "Arjun Menon", email: "", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  REQUIREMENT_COLLECTED: [
    { id: "p4", name: "Meera Krishnan", phone: "+919666666666", source: "SOCIAL_MEDIA", status: "REQUIREMENT_COLLECTED", createdAt: new Date(Date.now() - 1000*3600*8).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*8).toISOString(), assignedTo: { id: "a3", name: "Deepa Iyer", email: "", role: "AGENT", activeLeads: 7, isActive: true, createdAt: "", updatedAt: "" } },
    { id: "p5", name: "Aditya Kumar", phone: "+919555544444", source: "PHONE_CALL", status: "REQUIREMENT_COLLECTED", createdAt: new Date(Date.now() - 1000*3600*12).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*36).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  PROPERTY_SUGGESTED: [
    { id: "p6", name: "Karthik Reddy", phone: "+919555555555", source: "PHONE_CALL", status: "PROPERTY_SUGGESTED", createdAt: new Date(Date.now() - 1000*3600*24).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*48).toISOString(), assignedTo: { id: "a2", name: "Arjun Menon", email: "", role: "AGENT", activeLeads: 9, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  VISIT_SCHEDULED: [
    { id: "p7", name: "Vikram Singh", phone: "+919777777777", source: "GOOGLE_FORM", status: "VISIT_SCHEDULED", createdAt: new Date(Date.now() - 1000*3600*5).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*5).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  VISIT_COMPLETED: [
    { id: "p8", name: "Sneha Reddy", phone: "+919444433333", source: "REFERRAL", status: "VISIT_COMPLETED", createdAt: new Date(Date.now() - 1000*3600*72).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*2).toISOString(), assignedTo: { id: "a3", name: "Deepa Iyer", email: "", role: "AGENT", activeLeads: 7, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  BOOKED: [
    { id: "p9", name: "Pooja Sharma", phone: "+919333322222", source: "WEBSITE_FORM", status: "BOOKED", createdAt: new Date(Date.now() - 1000*3600*96).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*1).toISOString(), assignedTo: { id: "a1", name: "Priya Nair", email: "", role: "AGENT", activeLeads: 12, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
  LOST: [
    { id: "p10", name: "Ravi Kumar", phone: "+919222211111", source: "SOCIAL_MEDIA", status: "LOST", createdAt: new Date(Date.now() - 1000*3600*120).toISOString(), updatedAt: new Date().toISOString(), lastActivityAt: new Date(Date.now() - 1000*3600*48).toISOString(), assignedTo: { id: "a4", name: "Rohan Das", email: "", role: "AGENT", activeLeads: 11, isActive: true, createdAt: "", updatedAt: "" } },
  ] as Lead[],
};

function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const followUp = needsFollowUp(lead.lastActivityAt);
  const sourceConfig = LEAD_SOURCE_CONFIG[lead.source];

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group mb-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200",
            snapshot.isDragging && "shadow-2xl shadow-violet-500/10 border-violet-500/30 bg-white/[0.06] rotate-1",
            !snapshot.isDragging && "hover:bg-white/[0.05] hover:border-white/[0.1]"
          )}
        >
          <div className="flex items-start justify-between">
            <Link href={`/leads/${lead.id}`} className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white">
                  {lead.name}
                </p>
                {followUp && (
                  <div className="flex items-center gap-1 shrink-0">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                  </div>
                )}
              </div>
            </Link>
            <div
              {...provided.dragHandleProps}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-zinc-600" />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
            <Phone className="h-2.5 w-2.5" />
            <span>{lead.phone}</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-zinc-600 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              {sourceConfig?.label}
            </span>
            <div className="flex items-center gap-1.5">
              {lead.assignedTo && (
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px]">
                    {getInitials(lead.assignedTo.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {formatRelativeTime(lead.lastActivityAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function PipelineBoard({ initialData }: PipelineBoardProps) {
  const [pipeline, setPipeline] = useState<Record<string, Lead[]>>(
    initialData || mockPipelineData
  );

  useEffect(() => {
    async function fetchPipeline() {
      try {
        const res = await fetch("/api/leads/pipeline");
        const json = await res.json();
        if (json.success && json.data) {
          setPipeline(json.data);
        }
      } catch {
        // Use mock data
      }
    }
    fetchPipeline();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    const newPipeline = { ...pipeline };
    const sourceLeads = [...(newPipeline[sourceStage] || [])];
    const [movedLead] = sourceLeads.splice(source.index, 1);

    if (sourceStage === destStage) {
      sourceLeads.splice(destination.index, 0, movedLead);
      newPipeline[sourceStage] = sourceLeads;
    } else {
      const destLeads = [...(newPipeline[destStage] || [])];
      const updatedLead = { ...movedLead, status: destStage as LeadStatus };
      destLeads.splice(destination.index, 0, updatedLead);
      newPipeline[sourceStage] = sourceLeads;
      newPipeline[destStage] = destLeads;
    }

    setPipeline(newPipeline);

    // Update backend
    if (sourceStage !== destStage) {
      try {
        await fetch(`/api/leads/${draggableId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destStage }),
        });
      } catch (error) {
        console.error("Failed to update lead status:", error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        {PIPELINE_STAGES.map((stage) => {
          const config = LEAD_STATUS_CONFIG[stage];
          const leads = pipeline[stage] || [];

          return (
            <div key={stage} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", config.color.replace("text-", "bg-"))} />
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {config.label}
                  </h3>
                </div>
                <Badge variant="default" className="text-[10px] h-5 min-w-[20px] justify-center">
                  {leads.length}
                </Badge>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[200px] rounded-xl border border-white/[0.04] p-2 transition-colors duration-200",
                      snapshot.isDraggingOver
                        ? "bg-violet-500/[0.04] border-violet-500/20"
                        : "bg-white/[0.01]"
                    )}
                  >
                    {leads.map((lead, index) => (
                      <LeadCard key={lead.id} lead={lead} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
