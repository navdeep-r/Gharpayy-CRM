export type LeadStatus =
  | "NEW_LEAD"
  | "CONTACTED"
  | "REQUIREMENT_COLLECTED"
  | "PROPERTY_SUGGESTED"
  | "VISIT_SCHEDULED"
  | "VISIT_COMPLETED"
  | "BOOKED"
  | "LOST";

export type LeadSource =
  | "WHATSAPP"
  | "WEBSITE_FORM"
  | "SOCIAL_MEDIA"
  | "PHONE_CALL"
  | "GOOGLE_FORM"
  | "LEAD_QUESTIONNAIRE"
  | "REFERRAL"
  | "OTHER";

export type VisitStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type UserRole = "ADMIN" | "AGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  activeLeads: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  source: LeadSource;
  status: LeadStatus;
  budget?: string | null;
  preferredArea?: string | null;
  moveInDate?: string | null;
  occupation?: string | null;
  notes?: string | null;
  assignedToId?: string | null;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  activities?: LeadActivity[];
  leadNotes?: Note[];
  visits?: Visit[];
}

export interface LeadActivity {
  id: string;
  leadId: string;
  userId?: string | null;
  user?: User | null;
  type: string;
  description: string;
  metadata?: string | null;
  createdAt: string;
}

export interface Note {
  id: string;
  leadId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  leadId: string;
  lead?: Lead;
  agentId: string;
  agent?: User;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
  outcome?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  visitsScheduled: number;
  bookingsConfirmed: number;
  conversionRate: number;
  leadsByStage: { stage: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  recentLeads: Lead[];
  agentPerformance: {
    id: string;
    name: string;
    activeLeads: number;
    bookings: number;
  }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
