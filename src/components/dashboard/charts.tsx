"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LEAD_STATUS_CONFIG, LEAD_SOURCE_CONFIG } from "@/lib/utils";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

interface ChartData {
  leadsByStage: { stage: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 shadow-xl">
        <p className="text-xs font-medium text-zinc-300">{label}</p>
        <p className="text-sm font-bold text-zinc-100">{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
}

export function PipelineChart({ data }: { data: ChartData["leadsByStage"] }) {
  const chartData = data.map((item) => ({
    name: LEAD_STATUS_CONFIG[item.stage]?.label || item.stage,
    count: item.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="mb-1 text-sm font-semibold text-zinc-200">Pipeline Distribution</h3>
      <p className="mb-6 text-xs text-zinc-500">Leads by current stage</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={32}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#71717a" }}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#71717a" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function SourceChart({ data }: { data: ChartData["leadsBySource"] }) {
  const chartData = data.map((item) => ({
    name: LEAD_SOURCE_CONFIG[item.source]?.label || item.source,
    value: item.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="mb-1 text-sm font-semibold text-zinc-200">Lead Sources</h3>
      <p className="mb-6 text-xs text-zinc-500">Where your leads come from</p>
      <div className="flex items-center gap-6">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 shadow-xl">
                        <p className="text-xs font-medium text-zinc-300">
                          {payload[0].name}
                        </p>
                        <p className="text-sm font-bold text-zinc-100">
                          {payload[0].value} leads
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-zinc-400">{item.name}</span>
              </div>
              <span className="text-xs font-medium text-zinc-300">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
