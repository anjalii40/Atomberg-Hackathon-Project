"use client";

import { useMemo, useState } from "react";

import { AnalyticsSnapshot, AuditEvent, DashboardSnapshot, ReportRow, UnlockRequest } from "@/lib/types";

import { LogoutButton } from "@/components/logout-button";

type AdminWorkspaceProps = {
  userName: string;
  snapshot: DashboardSnapshot;
};

type AdminTab = "governance" | "reporting" | "audit" | "analytics";
type AdminPanel = "governance" | "reporting" | "activity" | "analytics" | "notifications";

const adminTabs: Array<{ id: AdminTab; label: string }> = [
  { id: "governance", label: "Governance" },
  { id: "reporting", label: "Reporting" },
  { id: "audit", label: "Audit log" },
  { id: "analytics", label: "Analytics" }
];

const adminNav: Array<{ label: string; section: string; panel: AdminPanel }> = [
  { label: "Governance", section: "WORKSPACE", panel: "governance" },
  { label: "Reporting", section: "WORKSPACE", panel: "reporting" },
  { label: "Activity log", section: "WORKSPACE", panel: "activity" },
  { label: "Analytics", section: "PROGRESS", panel: "analytics" },
  { label: "Notifications", section: "PROGRESS", panel: "notifications" }
];

function getRequestTone(status: UnlockRequest["status"]) {
  if (status === "Approved") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Declined") {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-amber-50 text-amber-700";
}

export function AdminWorkspace({ userName, snapshot }: AdminWorkspaceProps) {
  const [activePanel, setActivePanel] = useState<AdminPanel>("governance");
  const [activeTab, setActiveTab] = useState<AdminTab>("governance");
  const [unlockRequests, setUnlockRequests] = useState(snapshot.unlockRequests);

  const pendingRequests = useMemo(
    () => unlockRequests.filter((request) => request.status === "Pending"),
    [unlockRequests]
  );

  function openPanel(panel: AdminPanel) {
    setActivePanel(panel);

    if (panel === "governance") {
      setActiveTab("governance");
    }

    if (panel === "reporting") {
      setActiveTab("reporting");
    }

    if (panel === "activity") {
      setActiveTab("audit");
    }

    if (panel === "analytics") {
      setActiveTab("analytics");
    }
  }

  const showTabbedWorkspace = activePanel !== "notifications";
  const pageTitle =
    activePanel === "governance"
      ? "Admin workspace"
      : activePanel === "reporting"
        ? "Reporting"
        : activePanel === "activity"
          ? "Activity log"
          : activePanel === "analytics"
            ? "Analytics"
            : "Notifications";
  const pageSubtitle =
    activePanel === "governance"
      ? "FY26 · Governance, reporting, and analytics"
      : activePanel === "reporting"
        ? "FY26 · Export-ready reporting and completion views"
        : activePanel === "activity"
          ? "FY26 · Audit history and governance trail"
          : activePanel === "analytics"
            ? "FY26 · Organization performance insights"
            : "FY26 · Governance alerts and reminders";

  function updateRequest(requestId: string, status: UnlockRequest["status"]) {
    setUnlockRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status
            }
          : request
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-gray-900">
      <aside className="fixed left-0 top-0 flex h-screen w-[200px] flex-col border-r border-gray-200 bg-[#f6f3ec]">
        <div className="border-b border-gray-200 px-5 py-6">
          <p className="text-2xl font-semibold tracking-tight text-gray-900">AtomQuest</p>
          <p className="mt-1 text-[13px] text-gray-500">FY26 Goal Cycle</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {["WORKSPACE", "PROGRESS"].map((section) => (
            <div className="mb-6" key={section}>
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {section}
              </p>
              <nav className="space-y-1">
                {adminNav
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <button
                      className={
                        activePanel === item.panel
                          ? "flex w-full items-center rounded-r-lg border-l-4 border-blue-700 bg-white px-3 py-2 text-left text-[14px] font-medium text-gray-900"
                          : "flex w-full items-center rounded-r-lg border-l-4 border-transparent px-3 py-2 text-left text-[14px] text-gray-600"
                      }
                      key={item.label}
                      onClick={() => openPanel(item.panel)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[14px] font-semibold text-blue-700">
              {userName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900">{userName}</p>
              <p className="text-[11px] text-gray-400">Admin / HR</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-[200px] min-h-screen">
        <div className="border-b border-gray-200 bg-white px-10 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-tight text-gray-900">{pageTitle}</h1>
              <p className="mt-1 text-[13px] text-gray-500">{pageSubtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-[13px] font-medium text-gray-700"
                type="button"
              >
                Export
              </button>
              <LogoutButton />
            </div>
          </div>

          {showTabbedWorkspace ? (
            <div className="mt-6 flex gap-8 border-b border-gray-200">
              {adminTabs.map((tab) => (
                <button
                  className={
                    activeTab === tab.id
                      ? "border-b-2 border-blue-700 pb-4 text-left text-[14px] font-semibold text-blue-700"
                      : "border-b-2 border-transparent pb-4 text-left text-[14px] font-medium text-gray-500"
                  }
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActivePanel(
                      tab.id === "audit"
                        ? "activity"
                        : tab.id
                    );
                  }}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="px-10 py-8">
          {activePanel === "notifications" ? (
            <AdminNotificationsPanel
              pendingRequests={pendingRequests.length}
              reportRows={snapshot.reportRows.length}
              auditEvents={snapshot.auditEvents.length}
            />
          ) : activeTab === "governance" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                  helper="Admin review required before locked goals can change."
                  label="Pending unlock requests"
                  tone="amber"
                  value={String(pendingRequests.length)}
                />
                <StatCard
                  helper="Recent governance events visible in the audit log."
                  label="Audit events logged"
                  tone="green"
                  value={String(snapshot.auditEvents.length)}
                />
                <StatCard
                  helper="Current rows ready for export and evaluator review."
                  label="Report rows"
                  tone="blue"
                  value={String(snapshot.reportRows.length)}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                <section className="space-y-4">
                  {unlockRequests.map((request) => (
                    <article className="rounded-xl border border-gray-200 bg-white p-6" key={request.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-[15px] font-medium text-gray-900">{request.employeeName}</h2>
                          <p className="mt-1 text-[13px] text-gray-500">{request.requestedAt}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${getRequestTone(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-4 text-[13px] text-gray-600">{request.reason}</p>
                      {request.status === "Pending" ? (
                        <div className="mt-5 flex items-center gap-3">
                          <button
                            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-[13px] font-medium text-gray-700"
                            onClick={() => updateRequest(request.id, "Declined")}
                            type="button"
                          >
                            Decline
                          </button>
                          <button
                            className="rounded-xl bg-blue-700 px-5 py-3 text-[13px] font-semibold text-white"
                            onClick={() => updateRequest(request.id, "Approved")}
                            type="button"
                          >
                            Approve unlock
                          </button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </section>

                <section className="space-y-4">
                  <CycleCard
                    detail="Creation, submission, and approval are enabled."
                    label="Window start: 1 May"
                    status="Open"
                    title="Phase 1 Goal Setting"
                  />
                  <CycleCard
                    detail="Employees will capture planned vs actual progress."
                    label="Window start: July"
                    status="Upcoming"
                    title="Q1 Check-in"
                  />
                  <CycleCard
                    detail="Final achievement capture and completion oversight."
                    label="Window start: March / April"
                    status="Scheduled"
                    title="Q4 / Annual"
                  />
                </section>
              </div>
            </div>
          ) : null}

          {activeTab === "reporting" ? <ReportingTable rows={snapshot.reportRows} /> : null}
          {activeTab === "audit" ? <AuditList events={snapshot.auditEvents} /> : null}
          {activeTab === "analytics" ? <AdminAnalytics analytics={snapshot.analytics} /> : null}
        </div>
      </main>
    </div>
  );
}

function AdminNotificationsPanel({
  pendingRequests,
  reportRows,
  auditEvents
}: {
  pendingRequests: number;
  reportRows: number;
  auditEvents: number;
}) {
  const items = [
    {
      title: "Unlock requests",
      body: `${pendingRequests} requests are currently waiting for admin review.`
    },
    {
      title: "Reporting readiness",
      body: `${reportRows} report rows are available for export and governance review.`
    },
    {
      title: "Audit visibility",
      body: `${auditEvents} recent audit events are available in the activity log.`
    }
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article className="rounded-xl border border-gray-200 bg-white p-6" key={item.title}>
          <h3 className="text-[15px] font-medium text-gray-900">{item.title}</h3>
          <p className="mt-2 text-[13px] text-gray-500">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  tone
}: {
  label: string;
  value: string;
  helper: string;
  tone: "green" | "amber" | "blue";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700"
        : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
      <p className="text-[28px] font-medium text-gray-900">{value}</p>
      <p className="mt-2 text-[13px] text-gray-500">{label}</p>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${toneClass}`}>
        {helper}
      </span>
    </div>
  );
}

function CycleCard({
  title,
  status,
  label,
  detail
}: {
  title: string;
  status: string;
  label: string;
  detail: string;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-medium text-gray-900">{title}</h2>
          <p className="mt-1 text-[13px] text-gray-500">{label}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
          {status}
        </span>
      </div>
      <p className="mt-4 text-[13px] text-gray-600">{detail}</p>
    </article>
  );
}

function ReportingTable({ rows }: { rows: ReportRow[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-[15px] font-medium text-gray-900">Planned vs Actual</h2>
        <p className="mt-1 text-[13px] text-gray-500">Export-ready achievement summary by employee and goal.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-base">
          <thead className="bg-gray-50">
            <tr>
              {["Employee", "Goal", "Target", "Actual", "Status"].map((heading) => (
                <th
                  className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.04em] text-gray-400"
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => (
              <tr key={`${row.employeeName}-${row.goalTitle}`}>
                <td className="px-6 py-4 text-gray-900">{row.employeeName}</td>
                <td className="px-6 py-4 text-gray-900">{row.goalTitle}</td>
                <td className="px-6 py-4 text-gray-600">{row.target}</td>
                <td className="px-6 py-4 text-gray-600">{row.actual}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-700">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditList({ events }: { events: AuditEvent[] }) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <article className="rounded-xl border border-gray-200 bg-white p-6" key={event.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-medium text-gray-900">{event.actor}</h2>
              <p className="mt-1 text-[13px] text-gray-500">
                {event.action} on {event.target}
              </p>
            </div>
            <span className="text-[13px] text-gray-500">{event.timestamp}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function AdminAnalytics({ analytics }: { analytics: AnalyticsSnapshot }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <p className="text-[15px] font-medium text-gray-900">QoQ trend</p>
            <p className="mt-1 text-[13px] text-gray-500">Organization achievement trend by quarter</p>
          </div>
          <div className="flex items-end justify-between gap-4">
            {analytics.quarterlyTrends.map((point) => (
              <div className="flex flex-1 flex-col items-center gap-3" key={point.label}>
                <div className="flex h-44 w-full max-w-16 items-end rounded-xl bg-blue-50 p-2">
                  <div
                    className="w-full rounded-lg bg-blue-700"
                    style={{ height: `${point.value}%` }}
                  />
                </div>
                <p className="text-base font-medium text-gray-900">{point.value}%</p>
                <p className="text-[13px] text-gray-500">{point.label}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <p className="text-[15px] font-medium text-gray-900">Goal distribution</p>
            <p className="mt-1 text-[13px] text-gray-500">Current spread by thrust area</p>
          </div>
          <div className="space-y-4">
            {analytics.goalDistribution.map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-base">
                  <span className="font-medium text-gray-900">{row.label}</span>
                  <span className="text-gray-500">{row.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-700"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <p className="text-[15px] font-medium text-gray-900">Manager effectiveness</p>
          <p className="mt-1 text-[13px] text-gray-500">Check-in completion health across L1 managers</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {analytics.managerEffectiveness.map((manager) => (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5" key={manager.managerName}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-medium text-gray-900">{manager.managerName}</p>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                  {manager.completionRate}% complete
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-700"
                  style={{ width: `${manager.completionRate}%` }}
                />
              </div>
              <p className="mt-4 text-[13px] text-gray-500">
                Pending approvals: <span className="font-semibold text-gray-900">{manager.pendingApprovals}</span>
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
