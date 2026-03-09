"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Kanban,
  Calendar,
  Settings,
  Building2,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Visits", href: "/visits", icon: Calendar },
  { name: "Agents", href: "/agents", icon: UserCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-[#0c0c0f]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">Gharpayy</h1>
          <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">CRM</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search..."
            className="h-8 pl-9 text-xs bg-white/[0.03] border-white/[0.06]"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={cn("sidebar-link relative", isActive && "active")}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-white/[0.06]"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "relative z-10 h-4 w-4",
                    isActive ? "text-violet-400" : "text-zinc-500"
                  )}
                />
                <span className="relative z-10">{item.name}</span>
                {item.name === "Leads" && (
                  <span className="relative z-10 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-400">
                    3
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px]">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">Admin User</p>
            <p className="text-[10px] text-zinc-500 truncate">admin@gharpayy.com</p>
          </div>
          <button className="relative rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-violet-500 animate-pulse-glow" />
          </button>
        </div>
      </div>
    </aside>
  );
}
