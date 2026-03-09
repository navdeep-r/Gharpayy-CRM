"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeTime, getInitials, LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG, needsFollowUp } from "@/lib/utils";
import type { Lead } from "@/types";

export function RecentLeads({ leads }: { leads: Lead[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Recent Leads</h3>
          <p className="text-xs text-zinc-500">Latest incoming leads</p>
        </div>
        <Link
          href="/leads"
          className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {leads.map((lead, i) => {
          const statusConfig = LEAD_STATUS_CONFIG[lead.status];
          const sourceConfig = LEAD_SOURCE_CONFIG[lead.source];
          const followUp = needsFollowUp(lead.lastActivityAt);

          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
            >
              <Link href={`/leads/${lead.id}`}>
                <div className="group flex items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-white/[0.04]">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                        {lead.name}
                      </p>
                      {followUp && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-500">
                        {sourceConfig?.label}
                      </span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] ${statusConfig?.bgColor} ${statusConfig?.color} border`}
                  >
                    {statusConfig?.label}
                  </Badge>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function AgentLeaderboard({
  agents,
}: {
  agents: { id: string; name: string; avatar?: string | null; activeLeads: number; bookings: number }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Agent Leaderboard</h3>
      <p className="text-xs text-zinc-500 mb-4">Performance this month</p>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div key={agent.id} className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-600 w-4">{i + 1}</span>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[9px]">
                {getInitials(agent.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-300 truncate">
                {agent.name}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-zinc-500">
                  {agent.activeLeads} active
                </span>
                <span className="text-[10px] text-emerald-400">
                  {agent.bookings} bookings
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                style={{
                  width: `${Math.min(100, (agent.bookings / Math.max(1, agent.activeLeads + agent.bookings)) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
