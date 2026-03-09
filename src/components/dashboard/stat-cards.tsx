"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {title}
          </p>
          <p className="text-3xl font-bold text-zinc-100 tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === "positive" ? (
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              ) : changeType === "negative" ? (
                <ArrowDownRight className="h-3 w-3 text-red-400" />
              ) : (
                <TrendingUp className="h-3 w-3 text-zinc-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive"
                    ? "text-emerald-400"
                    : changeType === "negative"
                      ? "text-red-400"
                      : "text-zinc-500"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardStats({
  stats,
}: {
  stats: {
    totalLeads: number;
    newLeadsToday: number;
    visitsScheduled: number;
    bookingsConfirmed: number;
    conversionRate: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={stats.totalLeads}
        change="+12% from last week"
        changeType="positive"
        icon={Users}
        iconColor="bg-blue-500/10 text-blue-400"
        delay={0}
      />
      <StatCard
        title="New Today"
        value={stats.newLeadsToday}
        change="+3 since morning"
        changeType="positive"
        icon={UserPlus}
        iconColor="bg-violet-500/10 text-violet-400"
        delay={0.1}
      />
      <StatCard
        title="Visits Scheduled"
        value={stats.visitsScheduled}
        change="2 for today"
        changeType="neutral"
        icon={Calendar}
        iconColor="bg-amber-500/10 text-amber-400"
        delay={0.2}
      />
      <StatCard
        title="Bookings"
        value={stats.bookingsConfirmed}
        change={`${stats.conversionRate}% conv. rate`}
        changeType="positive"
        icon={CheckCircle2}
        iconColor="bg-emerald-500/10 text-emerald-400"
        delay={0.3}
      />
    </div>
  );
}
