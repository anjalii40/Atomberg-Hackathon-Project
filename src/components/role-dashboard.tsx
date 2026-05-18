import { AdminGovernanceConsole } from "@/components/admin-governance-console";
import { AnalyticsModule } from "@/components/analytics-module";
import { GoalSheetBuilder } from "@/components/goal-sheet-builder";
import { LogoutButton } from "@/components/logout-button";
import { ManagerApprovalQueue } from "@/components/manager-approval-queue";
import { MetricCard } from "@/components/metric-card";
import { QuarterlyCheckinTracker } from "@/components/quarterly-checkin-tracker";
import { StatusPill } from "@/components/status-pill";
import { mapGoalStateTone, getRoleLabel } from "@/lib/dashboard";
import { DashboardSnapshot, Role } from "@/lib/types";

type RoleDashboardProps = {
  role: Role;
  userName: string;
  snapshot: DashboardSnapshot;
};

export function RoleDashboard({ role, userName, snapshot }: RoleDashboardProps) {
  return (
    <main className="portal-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">AtomQuest Workspace</span>
          <h1>{getRoleLabel(role)} Command Center</h1>
          <p className="hero-text">{snapshot.headline}</p>
          <div className="session-row">
            <span className="session-chip">Signed in as {userName}</span>
            <StatusPill label={role.toUpperCase()} tone="neutral" />
          </div>
        </div>

        <aside className="hero-aside">
          <div className="phase-card">
            <span className="phase-kicker">Role Context</span>
            <strong>{getRoleLabel(role)}</strong>
            <p>
              This workspace is protected by JWT session cookies and role-aware middleware guard
              rules.
            </p>
          </div>
          <div className="phase-card phase-card-muted">
            <span className="phase-kicker">Session Controls</span>
            <strong>Authenticated Access</strong>
            <p>Use the secure login flow to enter another workspace.</p>
            <div className="logout-row">
              <LogoutButton />
            </div>
          </div>
        </aside>
      </section>

      <section className="metrics-grid">
        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            detail={metric.detail}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <section className="content-grid">
        <article className="panel panel-large">
          <div className="panel-heading">
            <div>
              <span className="section-label">Workflow Snapshot</span>
              <h2>Goals in Motion</h2>
            </div>
            <StatusPill label={role.toUpperCase()} tone="neutral" />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Thrust Area</th>
                  <th>UoM</th>
                  <th>Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.goals.map((goal) => (
                  <tr key={goal.id}>
                    <td>
                      <strong>{goal.title}</strong>
                      <p>{goal.description}</p>
                    </td>
                    <td>{goal.thrustArea}</td>
                    <td>{goal.unit}</td>
                    <td>{goal.weight}%</td>
                    <td>
                      <StatusPill label={goal.state} tone={mapGoalStateTone(goal.state)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">Execution Priorities</span>
              <h2>Focus Areas</h2>
            </div>
          </div>
          <ul className="focus-list">
            {snapshot.focusAreas.map((focusArea) => (
              <li key={focusArea}>{focusArea}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">Quarterly Windows</span>
              <h2>Check-ins</h2>
            </div>
          </div>
          <div className="stack-list">
            {snapshot.checkIns.map((checkIn) => (
              <div className="stack-card" key={checkIn.id}>
                <div className="stack-card-top">
                  <strong>{checkIn.period}</strong>
                  <StatusPill label={checkIn.status} tone="neutral" />
                </div>
                <p>
                  Planned: <strong>{checkIn.planned}</strong>
                </p>
                <p>
                  Actual: <strong>{checkIn.actual}</strong>
                </p>
                <p className="muted-text">{checkIn.comment}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel-wide">
          <div className="panel-heading">
            <div>
              <span className="section-label">Governance Trace</span>
              <h2>Recent Audit Events</h2>
            </div>
          </div>
          <div className="timeline">
            {snapshot.auditEvents.map((event) => (
              <div className="timeline-item" key={event.id}>
                <span className="timeline-time">{event.timestamp}</span>
                <div>
                  <strong>{event.actor}</strong>
                  <p>
                    {event.action} on <span>{event.target}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {role === "employee" ? (
          <article className="panel panel-wide panel-builder">
            <GoalSheetBuilder initialGoals={snapshot.goals} />
          </article>
        ) : null}

        {role === "manager" ? (
          <article className="panel panel-wide panel-builder">
            <ManagerApprovalQueue initialGoals={snapshot.goals} />
          </article>
        ) : null}

        {role === "employee" ? (
          <article className="panel panel-wide panel-builder">
            <QuarterlyCheckinTracker initialCheckIns={snapshot.checkIns} mode="employee" />
          </article>
        ) : null}

        {role === "manager" ? (
          <article className="panel panel-wide panel-builder">
            <QuarterlyCheckinTracker initialCheckIns={snapshot.checkIns} mode="manager" />
          </article>
        ) : null}

        {role === "manager" ? (
          <article className="panel panel-wide panel-builder">
            <AnalyticsModule analytics={snapshot.analytics} role="manager" />
          </article>
        ) : null}

        {role === "admin" ? (
          <article className="panel panel-wide panel-builder">
            <AdminGovernanceConsole
              auditEvents={snapshot.auditEvents}
              initialUnlockRequests={snapshot.unlockRequests}
              reportRows={snapshot.reportRows}
            />
          </article>
        ) : null}

        {role === "admin" ? (
          <article className="panel panel-wide panel-builder">
            <AnalyticsModule analytics={snapshot.analytics} role="admin" />
          </article>
        ) : null}
      </section>
    </main>
  );
}
