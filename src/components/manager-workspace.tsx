"use client";

import { useMemo, useState } from "react";

import { AnalyticsSnapshot, CheckIn, CheckInStatus, DashboardSnapshot, Goal } from "@/lib/types";

import { LogoutButton } from "@/components/logout-button";

type ManagerWorkspaceProps = {
  userName: string;
  snapshot: DashboardSnapshot;
};

type ManagerTab = "approvals" | "checkins" | "analytics";

type ReviewAction = "Approved" | "Rework";

type CheckInDraft = CheckIn & {
  goalTitle: string;
};

const managerTabs: Array<{ id: ManagerTab; label: string }> = [
  { id: "approvals", label: "Approvals" },
  { id: "checkins", label: "Check-ins" },
  { id: "analytics", label: "Analytics" }
];

const managerNav = [
  { label: "My team", section: "WORKSPACE", active: true },
  { label: "Check-ins", section: "WORKSPACE" },
  { label: "Activity log", section: "WORKSPACE" },
  { label: "Analytics", section: "PROGRESS" },
  { label: "Notifications", section: "PROGRESS" }
];

function getGoalStateTone(state: Goal["state"]) {
  if (state === "Approved") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (state === "Pending Approval") {
    return "bg-amber-50 text-amber-700";
  }

  if (state === "Rework") {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getCheckInTone(status: CheckInStatus) {
  if (status === "Completed") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "On Track") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getManagerCheckIns(goals: Goal[], checkIns: CheckIn[]): CheckInDraft[] {
  return checkIns.map((checkIn) => ({
    ...checkIn,
    goalTitle: goals.find((goal) => goal.id === checkIn.goalId)?.title ?? "Goal-linked update"
  }));
}

export function ManagerWorkspace({ userName, snapshot }: ManagerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ManagerTab>("approvals");
  const [goals, setGoals] = useState(snapshot.goals);
  const [comments, setComments] = useState<Record<string, string>>(
    snapshot.goals.reduce<Record<string, string>>((acc, goal) => {
      acc[goal.id] = goal.managerComment ?? "";
      return acc;
    }, {})
  );
  const [checkIns, setCheckIns] = useState<CheckInDraft[]>(
    getManagerCheckIns(snapshot.goals, snapshot.checkIns)
  );

  const pendingGoals = useMemo(
    () => goals.filter((goal) => goal.state === "Pending Approval" || goal.state === "Rework"),
    [goals]
  );
  const approvedGoals = useMemo(
    () => goals.filter((goal) => goal.state === "Approved"),
    [goals]
  );

  function updateGoal(goalId: string, field: "target" | "weight", value: string | number) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId && goal.state !== "Approved"
          ? {
              ...goal,
              [field]: value
            }
          : goal
      )
    );
  }

  function updateComment(goalId: string, value: string) {
    setComments((currentComments) => ({
      ...currentComments,
      [goalId]: value
    }));
  }

  function reviewGoal(goalId: string, action: ReviewAction) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              state: action === "Approved" ? "Approved" : "Rework",
              managerComment: comments[goalId]
            }
          : goal
      )
    );
  }

  function updateCheckIn(
    checkInId: string,
    field: "planned" | "actual" | "status" | "comment" | "managerComment",
    value: string
  ) {
    setCheckIns((current) =>
      current.map((item) =>
        item.id === checkInId
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-gray-900">
      <aside className="fixed left-0 top-0 flex h-screen w-[200px] flex-col border-r border-gray-200 bg-[#f6f3ec]">
        <div className="border-b border-gray-200 px-5 py-6">
          <p className="text-2xl font-semibold tracking-tight text-gray-900">AtomQuest</p>
          <p className="mt-1 text-sm text-gray-500">FY26 Goal Cycle</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {["WORKSPACE", "PROGRESS"].map((section) => (
            <div className="mb-6" key={section}>
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                {section}
              </p>
              <nav className="space-y-1">
                {managerNav
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <button
                      className={
                        item.active
                          ? "flex w-full items-center rounded-r-lg border-l-4 border-blue-700 bg-white px-3 py-2 text-left text-sm font-medium text-gray-900"
                          : "flex w-full items-center rounded-r-lg border-l-4 border-transparent px-3 py-2 text-left text-sm text-gray-600"
                      }
                      key={item.label}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {userName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">Manager</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-[200px] min-h-screen">
        <div className="border-b border-gray-200 bg-white px-10 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Manager workspace</h1>
              <p className="mt-1 text-sm text-gray-500">FY26 · Team review and quarterly tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700"
                type="button"
              >
                Export
              </button>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 flex gap-8 border-b border-gray-200">
            {managerTabs.map((tab) => (
              <button
                className={
                  activeTab === tab.id
                    ? "border-b-2 border-blue-700 pb-4 text-left text-sm font-semibold text-blue-700"
                    : "border-b-2 border-transparent pb-4 text-left text-sm font-medium text-gray-500"
                }
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-10 py-8">
          {activeTab === "approvals" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                  helper="Submitted and rework goals currently waiting on you."
                  label="Pending approvals"
                  tone="amber"
                  value={String(pendingGoals.length)}
                />
                <StatCard
                  helper="Approved goals are locked until admin unlock."
                  label="Approved goals"
                  tone="green"
                  value={String(approvedGoals.length)}
                />
                <StatCard
                  helper="Managers can adjust target and weight before approval."
                  label="Inline edits"
                  tone="blue"
                  value="Target + Weight"
                />
              </div>

              <div className="space-y-4">
                {pendingGoals.map((goal) => (
                  <article className="rounded-xl border border-gray-200 bg-white p-6" key={goal.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{goal.title}</h2>
                        <p className="mt-1 text-sm text-gray-500">{goal.thrustArea}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getGoalStateTone(goal.state)}`}>
                        {goal.state}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Target</span>
                        <input
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                          onChange={(event) => updateGoal(goal.id, "target", event.target.value)}
                          value={goal.target}
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Weightage (%)</span>
                        <input
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                          min={10}
                          onChange={(event) => updateGoal(goal.id, "weight", Number(event.target.value))}
                          type="number"
                          value={goal.weight}
                        />
                      </label>
                    </div>

                    <label className="mt-4 block space-y-2 text-sm font-medium text-gray-700">
                      <span>Review comment</span>
                      <textarea
                        className="min-h-28 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                        onChange={(event) => updateComment(goal.id, event.target.value)}
                        placeholder="Document approval notes or rework guidance."
                        value={comments[goal.id] ?? ""}
                      />
                    </label>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="text-sm text-gray-500">
                        {goal.shared ? "Shared goal review." : "Individual goal review."} Approval locks the goal.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700"
                          onClick={() => reviewGoal(goal.id, "Rework")}
                          type="button"
                        >
                          Send back for rework
                        </button>
                        <button
                          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
                          onClick={() => reviewGoal(goal.id, "Approved")}
                          type="button"
                        >
                          Approve goal
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {pendingGoals.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    No pending goals in the approval queue.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === "checkins" ? (
            <div className="space-y-4">
              {checkIns.map((checkIn) => (
                <article className="rounded-xl border border-gray-200 bg-white p-6" key={checkIn.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{checkIn.goalTitle}</h2>
                      <p className="mt-1 text-sm text-gray-500">{checkIn.period}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCheckInTone(checkIn.status)}`}>
                      {checkIn.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                      <span>Planned Achievement</span>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                        onChange={(event) => updateCheckIn(checkIn.id, "planned", event.target.value)}
                        value={checkIn.planned}
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                      <span>Actual Achievement</span>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                        onChange={(event) => updateCheckIn(checkIn.id, "actual", event.target.value)}
                        value={checkIn.actual}
                      />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                      <span>Progress Status</span>
                      <select
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                        onChange={(event) => updateCheckIn(checkIn.id, "status", event.target.value)}
                        value={checkIn.status}
                      >
                        {["Not Started", "On Track", "Completed"].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block space-y-2 text-sm font-medium text-gray-700">
                    <span>Manager check-in comment</span>
                    <textarea
                      className="min-h-28 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => updateCheckIn(checkIn.id, "managerComment", event.target.value)}
                      value={checkIn.managerComment ?? ""}
                    />
                  </label>
                </article>
              ))}

              <div className="flex justify-end">
                <button className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white" type="button">
                  Save manager review
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "analytics" ? (
            <ManagerAnalytics analytics={snapshot.analytics} />
          ) : null}
        </div>
      </main>
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
      <p className="text-4xl font-semibold text-gray-900">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>
        {helper}
      </span>
    </div>
  );
}

function ManagerAnalytics({ analytics }: { analytics: AnalyticsSnapshot }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900">QoQ trend</p>
            <p className="mt-1 text-sm text-gray-500">Achievement momentum across the team</p>
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
                <p className="text-sm font-semibold text-gray-900">{point.value}%</p>
                <p className="text-sm text-gray-500">{point.label}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900">Goal distribution</p>
            <p className="mt-1 text-sm text-gray-500">Current mix by thrust area</p>
          </div>
          <div className="space-y-4">
            {analytics.goalDistribution.map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
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
          <p className="text-sm font-semibold text-gray-900">Manager effectiveness</p>
          <p className="mt-1 text-sm text-gray-500">Completion health across L1 managers</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {analytics.managerEffectiveness.map((manager) => (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5" key={manager.managerName}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{manager.managerName}</p>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {manager.completionRate}% complete
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-700"
                  style={{ width: `${manager.completionRate}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Pending approvals: <span className="font-semibold text-gray-900">{manager.pendingApprovals}</span>
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
