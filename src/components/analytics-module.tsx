"use client";

import { AnalyticsSnapshot, Role } from "@/lib/types";

type AnalyticsModuleProps = {
  analytics: AnalyticsSnapshot;
  role: Extract<Role, "manager" | "admin">;
};

function barToneClass(tone: "navy" | "gold" | "green" | "rose") {
  return `bar-fill tone-${tone}`;
}

export function AnalyticsModule({ analytics, role }: AnalyticsModuleProps) {
  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Phase 6</span>
          <h2>{role === "admin" ? "Organization Analytics" : "Manager Performance Insights"}</h2>
          <p className="builder-intro">
            {role === "admin"
              ? "Use cross-organization trends and governance analytics to tell a stronger demo story."
              : "Track approval momentum, completion health, and goal mix across the reporting group."}
          </p>
        </div>
      </div>

      <div className="analytics-grid">
        <article className="panel analytics-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">QoQ Trend</span>
              <h2>Achievement Momentum</h2>
            </div>
          </div>
          <div className="trend-chart">
            {analytics.quarterlyTrends.map((point) => (
              <div className="trend-column" key={point.label}>
                <div className="trend-bar-wrap">
                  <div className="trend-bar" style={{ height: `${point.value}%` }} />
                </div>
                <strong>{point.value}%</strong>
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel analytics-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">Distribution</span>
              <h2>Goal Mix by Thrust Area</h2>
            </div>
          </div>
          <div className="distribution-list">
            {analytics.goalDistribution.map((row) => (
              <div className="distribution-row" key={row.label}>
                <div className="distribution-copy">
                  <strong>{row.label}</strong>
                  <span>{row.value}% of current goal mix</span>
                </div>
                <div className="bar-track">
                  <div className={barToneClass(row.tone)} style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel panel-wide analytics-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">Effectiveness</span>
            <h2>Manager Completion Dashboard</h2>
          </div>
        </div>
        <div className="effectiveness-grid">
          {analytics.managerEffectiveness.map((manager) => (
            <div className="effectiveness-card" key={manager.managerName}>
              <div className="stack-card-top">
                <strong>{manager.managerName}</strong>
                <span className="status-pill status-neutral">{manager.completionRate}% complete</span>
              </div>
              <div className="bar-track compact">
                <div className="bar-fill tone-navy" style={{ width: `${manager.completionRate}%` }} />
              </div>
              <p>
                Pending approvals: <strong>{manager.pendingApprovals}</strong>
              </p>
              <p className="muted-text">
                {manager.pendingApprovals <= 1
                  ? "Strong turnaround and healthy team check-in cadence."
                  : "Needs follow-through on approvals and reminder nudges."}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
