"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Bell,
  Palette,
  Shield,
  Database,
  Webhook,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("https://gharpayy.com/api/leads");

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        description="Configure your CRM preferences"
      />

      <div className="max-w-3xl space-y-6">
        {/* Company */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <Building2 className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">Company Settings</CardTitle>
                  <CardDescription>Manage company information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Company Name</label>
                  <Input defaultValue="Gharpayy" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Website</label>
                  <Input defaultValue="https://gharpayy.com" />
                </div>
              </div>
              <Button variant="primary" size="sm">Save Changes</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <Bell className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">Notifications</CardTitle>
                  <CardDescription>Configure alert preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingRow label="Follow-up reminders" description="Alert when a lead has no activity for 24 hours" defaultChecked />
              <SettingRow label="New lead alerts" description="Notification when a new lead is created" defaultChecked />
              <SettingRow label="Visit reminders" description="Remind agents 1 hour before scheduled visits" defaultChecked />
              <SettingRow label="Weekly digest" description="Weekly summary of CRM performance" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Webhook className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">Integrations</CardTitle>
                  <CardDescription>Connect external services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-white/[0.06] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Webhook URL</p>
                    <p className="text-xs text-zinc-500 mt-0.5">External forms POST leads to this endpoint</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <Button variant="outline" size="sm">Copy</Button>
                </div>
                <p className="text-[10px] text-zinc-600 font-mono bg-white/[0.02] rounded p-2 border border-white/[0.04]">
                  POST /api/leads {`{ "name": "...", "phone": "...", "source": "Website Form" }`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <IntegrationCard name="WhatsApp" status="mock" description="WhatsApp Business API" />
                <IntegrationCard name="Google Forms" status="ready" description="Auto-capture form responses" />
                <IntegrationCard name="Tally" status="ready" description="Form submission webhook" />
                <IntegrationCard name="Calendly" status="coming" description="Schedule from booking links" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Assignment */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Database className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">Lead Assignment</CardTitle>
                  <CardDescription>Configure how leads are assigned to agents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                <div className="h-3 w-3 rounded-full bg-violet-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">Round Robin (Active)</p>
                  <p className="text-xs text-zinc-500">Assigns to agent with fewest active leads</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="h-3 w-3 rounded-full bg-zinc-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-400">Manual Assignment</p>
                  <p className="text-xs text-zinc-600">Admin manually assigns each lead</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.04] p-3">
      <div>
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-violet-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function IntegrationCard({
  name,
  status,
  description,
}: {
  name: string;
  status: "ready" | "mock" | "coming";
  description: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-zinc-300">{name}</p>
        <Badge
          variant={status === "ready" ? "success" : status === "mock" ? "warning" : "default"}
          className="text-[9px]"
        >
          {status === "ready" ? "Ready" : status === "mock" ? "Mock" : "Coming Soon"}
        </Badge>
      </div>
      <p className="text-[10px] text-zinc-500">{description}</p>
    </div>
  );
}
