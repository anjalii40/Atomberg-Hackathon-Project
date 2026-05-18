# Features & Functionality

## Core Features

### Feature 1: Phase 0 Architecture and Planning
- **Description:** Project architecture, phase sequencing, domain model, and dashboard contracts aligned to the BRD
- **Status:** ✅ Completed
- **Assigned To:** Core implementation
- **Target Date:** May 17, 2026
- **Implementation Details:**
  - Define execution phases and exit criteria
  - Select the MVP stack and hosting approach
  - Shape the initial domain entities and API surface

### Feature 2: Phase 1 Portal Foundation
- **Description:** Role-aware app shell, seeded dashboard data, and starter API routes for the three personas
- **Status:** 🔄 In Progress
- **Assigned To:** Core implementation
- **Target Date:** May 17, 2026
- **Implementation Details:**
  - Create the Next.js application scaffold
  - Build Employee, Manager, and Admin overview screens
  - Expose health and dashboard JSON routes

### Feature 3: Goal Creation and Submission
- **Description:** Employee goal sheet drafting, validation, and submission workflow
- **Status:** ❌ Not Started
- **Assigned To:** Next phase
- **Target Date:** May 18, 2026
- **Implementation Details:**
  - Goal create/edit/delete flow
  - Weightage validations and submission rules
  - Shared goals behavior

### Feature 4: Manager Approval Workflow
- **Description:** Review, approve, reject, and send-back flow for manager approvals
- **Status:** ❌ Not Started
- **Assigned To:** Next phase
- **Target Date:** May 18, 2026
- **Implementation Details:**
  - Approval queue
  - Inline edits during review
  - Goal locking after approval

### Feature 5: Quarterly Check-ins
- **Description:** Planned vs actual updates, statuses, and manager comments for periodic review
- **Status:** ❌ Not Started
- **Assigned To:** Next phase
- **Target Date:** May 18, 2026
- **Implementation Details:**
  - Check-in capture by quarter
  - Status selection and score calculation
  - Manager check-in comments

### Feature 6: Reporting and Governance
- **Description:** Exportable achievement reports, completion tracking, and audit visibility
- **Status:** ❌ Not Started
- **Assigned To:** Later phase
- **Target Date:** May 18, 2026
- **Implementation Details:**
  - Achievement export
  - Completion dashboards
  - Audit trail viewer and unlock controls

## Feature Status Legend
- ✅ Completed
- 🔄 In Progress
- ❌ Not Started
- ⏸️ On Hold
- 🐛 Bug/Issue

## User Stories
- As an `Employee`, I want to view my goals and check-in schedule so that I understand what I need to submit.
- As a `Manager`, I want to see pending approvals and team progress so that I can review work quickly.
- As an `Admin / HR`, I want governance visibility and audit status so that I can run the cycle reliably.

## Requirements
- Employee, Manager, and Admin views must each have a coherent user journey
- Core portal data must map to the BRD entities and statuses
- The application should be demoable without external services
- The architecture must support later migration to persistent storage and integrations

---

**Last Updated:** May 17, 2026
