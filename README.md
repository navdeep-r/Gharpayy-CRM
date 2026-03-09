# Gharpayy CRM - Lead Management System

A production-grade internal CRM for **Gharpayy**, a platform that helps students and working professionals find PG accommodations in Bangalore.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Dashboard layout group
│   │   ├── dashboard/      # Analytics dashboard
│   │   ├── leads/          # Lead list + detail pages
│   │   ├── pipeline/       # Kanban board
│   │   ├── visits/         # Visit scheduling
│   │   ├── agents/         # Agent management
│   │   └── settings/       # CRM settings
│   └── api/                # API routes
│       ├── leads/          # Lead CRUD + pipeline
│       ├── agents/         # Agent queries
│   git     ├── visits/         # Visit management
│       ├── notes/          # Lead notes
│       └── dashboard/      # Analytics
├── components/
│   ├── ui/                 # Reusable UI primitives (ShadCN-style)
│   ├── layout/             # Sidebar, page layout
│   ├── dashboard/          # Dashboard widgets
│   ├── pipeline/           # Kanban board
│   ├── leads/              # Lead components
│   └── visits/             # Visit components
├── lib/                    # Utilities, Prisma client
├── services/               # Business logic layer
├── types/                  # TypeScript definitions
└── prisma/                 # Schema + seed data
```

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS v4, Framer Motion
- **UI Components**: Custom ShadCN-style components with Radix UI primitives
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **State**: React hooks + fetch (easily swappable for React Query)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/gharpayy_crm"
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed demo data**
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Demo Mode

The app works without a database connection by falling back to built-in mock data. This allows you to explore all features immediately.

## Core Features

### 1. Lead Capture API
```bash
POST /api/leads
{
  "name": "Rahul Sharma",
  "phone": "+919999999999",
  "source": "Website Form"
}
```
Leads are automatically assigned to agents via round-robin.

### 2. Lead Pipeline (Kanban)
Drag-and-drop leads through stages:
New Lead → Contacted → Requirement Collected → Property Suggested → Visit Scheduled → Visit Completed → Booked / Lost

### 3. Lead Profile
Full detail page with info, conversation notes, activity timeline, and visit history.

### 4. Visit Scheduling
Schedule property visits with date/time, track status (Scheduled/Completed/Cancelled).

### 5. Follow-up Reminders
Amber indicators appear when a lead has no activity for 24+ hours.

### 6. Dashboard Analytics
Stat cards, pipeline distribution chart, lead source breakdown, recent leads, agent leaderboard.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | List leads (with filters) |
| POST | /api/leads | Create new lead |
| GET | /api/leads/:id | Get lead details |
| PATCH | /api/leads/:id | Update lead |
| GET | /api/leads/pipeline | Get leads by stage |
| GET | /api/leads/:id/notes | Get lead notes |
| POST | /api/leads/:id/notes | Add note |
| GET | /api/agents | List agents |
| GET | /api/visits | List visits |
| POST | /api/visits | Schedule visit |
| PATCH | /api/visits | Update visit status |
| GET | /api/dashboard | Dashboard stats |

## Scaling to Production

1. **Authentication**: Integrate NextAuth with credentials/OAuth providers
2. **Real-time**: Add WebSocket notifications for new leads
3. **WhatsApp**: Connect WhatsApp Business API for lead capture
4. **Email**: Automated follow-up reminders via email
5. **Search**: Full-text search with PostgreSQL tsvector
6. **Caching**: Redis for dashboard stats and session management
7. **File uploads**: Property photos, documents via S3
8. **Audit log**: Complete activity tracking with user attribution
9. **Role-based access**: Granular permissions per agent/admin
10. **Mobile**: Responsive design (already built) + PWA support
