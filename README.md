# AtomQuest Goal Portal

AtomQuest is a role-based goal setting and performance tracking portal built for the Atomberg Hackathon problem statement. It replaces fragmented spreadsheets and manual review loops with a single workspace for goal planning, approvals, quarterly check-ins, and governance visibility.

The experience is designed around three clear user journeys:

- `Employee` creates goals, maintains weightage discipline, and updates quarterly progress
- `Manager` reviews submissions, sends work back for rework, and approves locked goals
- `Admin / HR` monitors governance, reporting, audit activity, and cycle health

## Overview

This repo contains a hackathon-ready MVP with:

- role-based dashboards for employee, manager, and admin
- JWT authentication with middleware-backed route guards
- employee goal sheet creation and submission
- manager approval and rework workflows
- admin governance and visibility surfaces
- a shared runtime state layer for cross-role demo flows

The current implementation is optimized for a reliable demo and fast iteration. It is intentionally lightweight, but the structure is ready to evolve into a persistent production system.

## What The Product Solves

Organizations often struggle with goal setting because progress data lives in too many places. Managers review late, employees lack clarity, and HR teams have to reconstruct decision trails during appraisal cycles.

AtomQuest addresses that with a system that makes the lifecycle explicit:

- create goal sheets with structured validations
- submit them for manager review
- approve or return them for rework
- capture quarterly planned vs actual progress
- preserve governance through role separation and audit visibility

## Current Scope

Implemented in the app today:

- landing page with login and signup
- protected dashboards for each role
- employee goal sheet with weightage validation
- manager approval and rework actions
- locked goal protection at the API layer
- admin workspace for governance and reporting views
- analytics and audit-oriented dashboard modules

Current limitations:

- data is runtime-backed, not persisted in a database
- exports are presentation-level UI, not file generation flows yet
- check-in scoring and advanced workflow automation are still partial

## Tech Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `jose` for JWT signing and verification
- `Next.js middleware` for role-based route protection

## Demo Credentials

Use these accounts for local testing:

- `employee@atomquest.local` / `employee123`
- `priya@atomquest.local` / `priya123`
- `manager@atomquest.local` / `manager123`
- `admin@atomquest.local` / `admin123`

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open the app

```text
http://localhost:3000
```

Optional:

```bash
JWT_SECRET=your-secret-value
```

If no `JWT_SECRET` is provided, the app falls back to a local development secret.

## Product Flows

### Employee

- open the goal sheet
- add goals with title, thrust area, UoM, target, description, and weightage
- satisfy validation rules before submission
- submit goals for approval
- review status changes and manager comments
- move to quarterly check-in tabs when the cycle window opens

### Manager

- review submitted goal sheets
- adjust target or weightage before approval
- approve goals and lock them
- send a sheet back for rework with comments
- review team progress through check-ins and analytics

### Admin / HR

- monitor governance and cycle health
- inspect reporting summaries
- review audit-oriented activity views
- oversee exception and compliance visibility

## Validation Rules

The employee goal sheet currently enforces:

- total weightage must equal exactly `100`
- minimum weightage per goal is `10`
- maximum number of goals is `8`
- shared-goal behavior can restrict edit access depending on ownership state

## Application Architecture

### High-Level Architecture

```mermaid
flowchart LR
    U["Users<br/>Employee / Manager / Admin"] --> L["Landing + Login"]
    L --> M["Next.js Middleware"]
    M --> R1["/employee"]
    M --> R2["/manager"]
    M --> R3["/admin"]

    R1 --> UI["Role Workspace UI"]
    R2 --> UI
    R3 --> UI

    UI --> API["Route Handlers / Server Pages"]
    API --> AUTH["JWT Session Helpers"]
    API --> DATA["Seeded Repository Layer"]
    DATA --> SNAP["Dashboard Snapshot"]
    SNAP --> UI
```

### Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Middleware
    participant Route
    participant Session
    participant Data

    User->>Browser: Open protected route
    Browser->>Middleware: Request /employee or /manager or /admin
    Middleware->>Session: Verify JWT cookie
    Session-->>Middleware: Role payload
    Middleware-->>Browser: Allow or redirect
    Browser->>Route: Render role page
    Route->>Session: Read current session
    Route->>Data: Build role snapshot
    Data-->>Route: Goals / check-ins / audit / analytics
    Route-->>Browser: Render workspace
```

### Auth Architecture

```mermaid
flowchart TD
    A["Login / Signup Form"] --> B["POST /api/auth/login or /api/auth/signup"]
    B --> C["Validate credentials + selected role"]
    C --> D["Sign JWT with jose"]
    D --> E["Set httpOnly session cookie"]
    E --> F["Redirect to role dashboard"]
    F --> G["Middleware validates role on each request"]
```

## Wireframes

### Employee Workspace Wireframe

```mermaid
flowchart LR
    subgraph S1["Sidebar"]
      E1["AtomQuest<br/>FY26 Goal Cycle"]
      E2["My Goals"]
      E3["Check-ins"]
      E4["Notifications"]
      E5["Employee Profile"]
    end

    subgraph M1["Main Content"]
      E6["Topbar<br/>Page Title + Meta + Export + Submit"]
      E7["Tabs<br/>Goal Sheet / Q1 / Q2 / Q3 / Q4"]
      E8["Stat Cards<br/>Weightage / Goal Count / Sheet Status"]
      E9["Goal Form<br/>Compact editable sheet"]
      E10["Previous Goals Dropdown"]
      E11["Current Goal Cards"]
      E12["Sticky Validation + Submit Bar"]
    end
```

### Manager Workspace Wireframe

```mermaid
flowchart LR
    subgraph S2["Sidebar"]
      M2["AtomQuest<br/>FY26 Goal Cycle"]
      M3["Approvals"]
      M4["Check-ins"]
      M5["Activity Log"]
      M6["Analytics"]
      M7["Notifications"]
      M8["Manager Profile"]
    end

    subgraph M2A["Main Content"]
      M9["Topbar<br/>Page Title + Meta + Export + Logout"]
      M10["Tabs<br/>Approvals / Check-ins / Analytics"]
      M11["Stat Cards"]
      M12["Approval Queue Cards"]
      M13["Check-in Review Cards"]
      M14["Analytics Panels"]
    end
```

### Admin Workspace Wireframe

```mermaid
flowchart LR
    subgraph S3["Sidebar"]
      A1["AtomQuest<br/>FY26 Goal Cycle"]
      A2["Governance"]
      A3["Reporting"]
      A4["Audit Log"]
      A5["Analytics"]
      A6["Notifications"]
      A7["Admin / HR Profile"]
    end

    subgraph M3A["Main Content"]
      A8["Topbar<br/>Page Title + Meta + Export + Logout"]
      A9["Tabs<br/>Governance / Reporting / Audit / Analytics"]
      A10["Governance Stat Cards"]
      A11["Unlock Request Cards"]
      A12["Reporting Table"]
      A13["Audit Timeline"]
      A14["Analytics Panels"]
    end
```

### Goal Sheet Interaction Wireframe

```mermaid
flowchart TD
    G1["Employee opens Goal Sheet"] --> G2["Enter Title / Thrust Area / UoM / Target / Weightage / Description"]
    G2 --> G3["Add Goal"]
    G3 --> G4["Goal Card appears in current sheet"]
    G4 --> G5["Validation recalculates"]
    G5 -->|100% + min 10% + max 8| G6["Submit Goal Sheet enabled"]
    G5 -->|rule fails| G7["Sticky error message shown"]
```

## Data Model

Core domain entities:

- `User`
- `Goal`
- `CheckIn`
- `AuditEvent`
- `UnlockRequest`
- `ReportRow`
- `AnalyticsSnapshot`
- `DashboardSnapshot`

### Logical Domain Model

```mermaid
erDiagram
    USER ||--o{ GOAL : owns
    USER ||--o{ USER : manages
    GOAL ||--o{ CHECKIN : tracks
    GOAL ||--o{ UNLOCK_REQUEST : requests
    USER ||--o{ AUDIT_EVENT : performs
    USER {
      string id
      string name
      string role
      string department
    }
    GOAL {
      string id
      string ownerId
      string title
      string thrustArea
      string unit
      string target
      number weight
      string state
      boolean shared
    }
    CHECKIN {
      string id
      string goalId
      string period
      string planned
      string actual
      string status
    }
```

## Project Structure

```text
.
├── README.md
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── PHASE_EXECUTION_PLAN.md
│   └── PROJECT_OVERVIEW.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── admin/
│   │   ├── employee/
│   │   ├── manager/
│   │   ├── landing/
│   │   └── login/
│   ├── components/
│   └── lib/
└── middleware.ts
```

## Key Files

- `src/app/employee/page.tsx` employee route entry
- `src/app/manager/page.tsx` manager route entry
- `src/app/admin/page.tsx` admin route entry
- `src/components/employee-workspace.tsx` employee workspace experience
- `src/components/manager-workspace.tsx` manager approval and review experience
- `src/components/admin-workspace.tsx` admin governance interface
- `src/components/auth-panel.tsx` login and signup UI
- `src/lib/auth.ts` JWT helpers and demo credentials
- `src/lib/runtime-store.ts` shared runtime state used for cross-role demo flows
- `src/lib/server-session.ts` server-side session access
- `middleware.ts` route protection and role-based redirects

## API Surface

Current endpoints:

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/goals/submit`
- `POST /api/goals/[goalId]/review`
- `PATCH /api/goals/[goalId]`

### API Summary

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/auth/login` | `POST` | authenticate user and issue JWT |
| `/api/auth/signup` | `POST` | create a demo session for a chosen role |
| `/api/auth/logout` | `POST` | clear the session cookie |
| `/api/health` | `GET` | health check |
| `/api/dashboard` | `GET` | return the dashboard snapshot for the current session |
| `/api/goals/submit` | `POST` | submit an employee goal sheet |
| `/api/goals/[goalId]/review` | `POST` | approve or send a goal sheet for rework |
| `/api/goals/[goalId]` | `PATCH` | update editable goals; reject locked-goal bypass attempts |

## Access Model

- `Employee` can only access `/employee`
- `Manager` can only access `/manager`
- `Admin` can only access `/admin`
- middleware guards routes before render
- server routes also validate the active session role

## Where To Go Next

Strong next upgrades for this codebase:

- move runtime state to `PostgreSQL + Prisma`
- implement persistent quarterly check-ins and scoring
- wire CSV / Excel export to real generated files
- add shared-goal ownership sync
- expand audit logging for every write path
- integrate Microsoft Entra ID, Teams, and email notifications

## Related Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Features](./docs/FEATURES.md)
- [Phase Execution Plan](./docs/PHASE_EXECUTION_PLAN.md)
