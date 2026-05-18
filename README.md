# AtomQuest Goal Portal

AtomQuest is an in-house goal setting and tracking portal built for the Atomberg Hackathon 1.0 problem statement. The current implementation focuses on the early execution phases:

- `Phase 0`: scope, architecture, and domain design
- `Phase 1`: application foundation, role-aware shell, and seeded portal data

## Current Status

The repository now contains:

- project documentation aligned to the BRD
- a `Next.js + TypeScript` application scaffold
- role-based dashboards for `Employee`, `Manager`, and `Admin / HR`
- seeded mock data representing goals, approvals, check-ins, and audit logs
- starter API routes for health and dashboard data

## Quick Start

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open `http://localhost:3000`

Use the role switcher in the UI to review the three demo journeys.

## Project Structure

- `docs/` project planning, architecture, feature tracking, and API notes
- `src/app/` Next.js app router pages and API routes
- `src/components/` reusable dashboard UI building blocks
- `src/lib/` domain types and seeded portal data

## Next Phases

- `Phase 2`: employee goal creation and submission workflow
- `Phase 3`: manager approval workflow
- `Phase 4`: quarterly achievement tracking and check-ins
- `Phase 5`: admin governance, reporting, and audit views

See [docs/PHASE_EXECUTION_PLAN.md](/Users/anjaliprajapati/Atomberg Project/Atomberg-Hackathon-Project/docs/PHASE_EXECUTION_PLAN.md) for the detailed phase plan.
