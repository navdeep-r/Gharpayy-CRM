import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function needsFollowUp(lastActivityAt: Date | string): boolean {
  const lastActivity = new Date(lastActivityAt);
  const now = new Date();
  const diffHours = (now.getTime() - lastActivity.getTime()) / 3600000;
  return diffHours >= 24;
}

export const LEAD_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  NEW_LEAD: {
    label: "New Lead",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  CONTACTED: {
    label: "Contacted",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  REQUIREMENT_COLLECTED: {
    label: "Requirement Collected",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  PROPERTY_SUGGESTED: {
    label: "Property Suggested",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20",
  },
  VISIT_SCHEDULED: {
    label: "Visit Scheduled",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
  VISIT_COMPLETED: {
    label: "Visit Completed",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10 border-teal-500/20",
  },
  BOOKED: {
    label: "Booked",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  LOST: {
    label: "Lost",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
};

export const LEAD_SOURCE_CONFIG: Record<
  string,
  { label: string; icon: string }
> = {
  WHATSAPP: { label: "WhatsApp", icon: "MessageCircle" },
  WEBSITE_FORM: { label: "Website Form", icon: "Globe" },
  SOCIAL_MEDIA: { label: "Social Media", icon: "Share2" },
  PHONE_CALL: { label: "Phone Call", icon: "Phone" },
  GOOGLE_FORM: { label: "Google Form", icon: "FileText" },
  LEAD_QUESTIONNAIRE: { label: "Questionnaire", icon: "ClipboardList" },
  REFERRAL: { label: "Referral", icon: "Users" },
  OTHER: { label: "Other", icon: "MoreHorizontal" },
};
