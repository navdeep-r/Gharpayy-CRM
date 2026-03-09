"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Award,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  activeLeads: number;
  isActive: boolean;
  role: string;
  _count?: { assignedLeads: number; visits: number };
}

const mockAgents: Agent[] = [
  { id: "a1", name: "Priya Nair", email: "priya@gharpayy.com", phone: "+919876543210", activeLeads: 12, isActive: true, role: "AGENT", _count: { assignedLeads: 45, visits: 32 } },
  { id: "a2", name: "Arjun Menon", email: "arjun@gharpayy.com", phone: "+919876543211", activeLeads: 9, isActive: true, role: "AGENT", _count: { assignedLeads: 38, visits: 25 } },
  { id: "a3", name: "Deepa Iyer", email: "deepa@gharpayy.com", phone: "+919876543212", activeLeads: 7, isActive: true, role: "AGENT", _count: { assignedLeads: 29, visits: 20 } },
  { id: "a4", name: "Rohan Das", email: "rohan@gharpayy.com", phone: "+919876543213", activeLeads: 11, isActive: true, role: "AGENT", _count: { assignedLeads: 42, visits: 28 } },
  { id: "a5", name: "Kavya Sharma", email: "kavya@gharpayy.com", phone: "+919876543214", activeLeads: 5, isActive: false, role: "AGENT", _count: { assignedLeads: 18, visits: 12 } },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch("/api/agents");
        const json = await res.json();
        if (json.success && json.data?.length) {
          setAgents(json.data);
        }
      } catch {
        // Use mock
      }
    }
    fetchAgents();
  }, []);

  const activeAgents = agents.filter((a) => a.isActive);
  const totalActiveLeads = agents.reduce((sum, a) => sum + a.activeLeads, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Agents"
        description="Manage your team members"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{agents.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Total Agents</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{activeAgents.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{totalActiveLeads}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Active Leads</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-5 hover:bg-white/[0.04] transition-all duration-200 hover:border-white/[0.12]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 ${
                        agent.isActive ? "bg-emerald-500" : "bg-zinc-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{agent.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{agent.role}</p>
                  </div>
                </div>
                {agent.isActive ? (
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]">Inactive</Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Mail className="h-3 w-3 text-zinc-600" />
                  {agent.email}
                </div>
                {agent.phone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Phone className="h-3 w-3 text-zinc-600" />
                    {agent.phone}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
                <div className="flex-1 text-center">
                  <p className="text-lg font-bold text-zinc-200">{agent.activeLeads}</p>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600">Active Leads</p>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="flex-1 text-center">
                  <p className="text-lg font-bold text-zinc-200">{agent._count?.assignedLeads || 0}</p>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600">Total Leads</p>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="flex-1 text-center">
                  <p className="text-lg font-bold text-zinc-200">{agent._count?.visits || 0}</p>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600">Visits</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
