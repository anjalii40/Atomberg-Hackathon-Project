# API Documentation

## Current Endpoints

### `GET /api/health`
Returns a lightweight health payload for local verification.

Example response:

```json
{
  "status": "ok",
  "app": "atomquest-goal-portal",
  "phase": "phase-1-foundation",
  "roles": ["employee", "manager", "admin"]
}
```

### `GET /api/dashboard?role=employee|manager|admin`
Returns a role-specific dashboard snapshot derived from seeded data.

Example response shape:

```json
{
  "role": "manager",
  "headline": "Review submissions and keep quarterly check-ins moving.",
  "metrics": [],
  "goals": [],
  "checkIns": [],
  "auditEvents": []
}
```

## Planned Endpoints

### Goals
- `POST /api/goals`
- `PATCH /api/goals/:id`
- `POST /api/goals/:id/submit`
- `POST /api/goals/:id/approve`
- `POST /api/goals/:id/rework`

### Check-ins
- `POST /api/check-ins`
- `PATCH /api/check-ins/:id`

### Reporting
- `GET /api/reports/achievement`
- `GET /api/reports/completion`
- `GET /api/audit-logs`

## API Notes

- The current API is intentionally read-first to support the foundation phase.
- The dashboard route acts as the contract between the UI and future backend services.
- Phase 2 will introduce write endpoints for goal creation and workflow transitions.
