"use client";

import { useMemo, useState } from "react";

import { DashboardSnapshot, Goal, GoalUnit, CheckIn, CheckInStatus } from "@/lib/types";

type EmployeeWorkspaceProps = {
  userName: string;
  snapshot: DashboardSnapshot;
};

type EmployeeTab = "goal-sheet" | "q1" | "q2" | "q3" | "q4";
type EmployeePanel = "goals" | "checkins" | "activity" | "analytics" | "notifications";

type GoalDraft = {
  id?: string;
  title: string;
  thrustArea: string;
  description: string;
  unit: GoalUnit;
  target: string;
  weight: number;
  shared: boolean;
};

type CheckInDraft = {
  id: string;
  goalId: string;
  goalTitle: string;
  planned: string;
  actual: string;
  status: CheckInStatus;
  comment: string;
  readOnly: boolean;
};

const tabs: Array<{ id: EmployeeTab; label: string }> = [
  { id: "goal-sheet", label: "Goal sheet" },
  { id: "q1", label: "Q1 check-in" },
  { id: "q2", label: "Q2 check-in" },
  { id: "q3", label: "Q3 check-in" },
  { id: "q4", label: "Q4 / Annual" }
];

const checkInWindowDates: Record<
  Exclude<EmployeeTab, "goal-sheet">,
  { opens: string; label: string; period: string }
> = {
  q1: { opens: "2026-07-01", label: "July 1, 2026", period: "Q1 Check-in" },
  q2: { opens: "2026-10-01", label: "October 1, 2026", period: "Q2 Check-in" },
  q3: { opens: "2027-01-01", label: "January 1, 2027", period: "Q3 Check-in" },
  q4: { opens: "2027-03-01", label: "March 1, 2027", period: "Q4 / Annual" }
};

const emptyGoalDraft: GoalDraft = {
  title: "",
  thrustArea: "",
  description: "",
  unit: "Numeric",
  target: "",
  weight: 10,
  shared: false
};

const workspaceNav: Array<{ label: string; section: string; panel: EmployeePanel }> = [
  { label: "My Goals", section: "WORKSPACE", panel: "goals" },
  { label: "Check-ins", section: "WORKSPACE", panel: "checkins" },
  { label: "Notifications", section: "PROGRESS", panel: "notifications" }
];

function getSheetStatus(goals: Goal[]) {
  if (goals.length === 0) {
    return "Draft";
  }

  if (goals.every((goal) => goal.state === "Approved")) {
    return "Approved";
  }

  if (goals.some((goal) => goal.state === "Pending Approval")) {
    return "Submitted";
  }

  return "Draft";
}

function getStatTone(valid: boolean) {
  return valid ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50";
}

function getSheetStatusTone(status: string) {
  if (status === "Approved") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Submitted") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getGoalCardStatusTone(state: Goal["state"]) {
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

function getWindowMeta(tab: Exclude<EmployeeTab, "goal-sheet">) {
  const windowDate = checkInWindowDates[tab];
  const isOpen = new Date() >= new Date(windowDate.opens);

  return {
    ...windowDate,
    isOpen
  };
}

function buildCheckInState(goals: Goal[], existingCheckIns: CheckIn[]) {
  return {
    q1: mapCheckInsForQuarter(goals, existingCheckIns, "q1"),
    q2: mapCheckInsForQuarter(goals, existingCheckIns, "q2"),
    q3: mapCheckInsForQuarter(goals, existingCheckIns, "q3"),
    q4: mapCheckInsForQuarter(goals, existingCheckIns, "q4")
  };
}

function mapCheckInsForQuarter(
  goals: Goal[],
  existingCheckIns: CheckIn[],
  tab: Exclude<EmployeeTab, "goal-sheet">
): CheckInDraft[] {
  const period = checkInWindowDates[tab].period;

  return goals.map((goal) => {
    const existing = existingCheckIns.find(
      (checkIn) => checkIn.goalId === goal.id && checkIn.period === period
    );

    return {
      id: existing?.id ?? `${tab}-${goal.id}`,
      goalId: goal.id,
      goalTitle: goal.title,
      planned: existing?.planned ?? "",
      actual: existing?.actual ?? "",
      status: existing?.status ?? "Not Started",
      comment: existing?.comment ?? "",
      readOnly: goal.shared
    };
  });
}

function getUomCopy(unit: GoalUnit) {
  if (unit === "Numeric") {
    return "Numeric";
  }

  if (unit === "%") {
    return "Numeric (%)";
  }

  if (unit === "Timeline") {
    return "Timeline";
  }

  return "Zero (0 = success)";
}

export function EmployeeWorkspace({ userName, snapshot }: EmployeeWorkspaceProps) {
  const [activePanel, setActivePanel] = useState<EmployeePanel>("goals");
  const [activeTab, setActiveTab] = useState<EmployeeTab>("goal-sheet");
  const [goals, setGoals] = useState<Goal[]>(snapshot.goals);
  const [goalDraft, setGoalDraft] = useState<GoalDraft>(emptyGoalDraft);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [checkInsByTab, setCheckInsByTab] = useState(() =>
    buildCheckInState(snapshot.goals, snapshot.checkIns)
  );

  const totalWeightage = useMemo(
    () => goals.reduce((sum, goal) => sum + goal.weight, 0),
    [goals]
  );
  const goalCount = goals.length;
  const sheetStatus = getSheetStatus(goals);
  const weightValid = totalWeightage === 100;
  const goalCountValid = goalCount <= 8;
  const minWeightValid = goals.every((goal) => goal.weight >= 10);
  const canSubmit =
    goalCount > 0 &&
    weightValid &&
    goalCountValid &&
    minWeightValid &&
    sheetStatus === "Draft";
  const activeQuarterMeta =
    activeTab === "goal-sheet" ? null : getWindowMeta(activeTab);
  const showTabbedWorkspace = activePanel === "goals" || activePanel === "checkins";

  function openPanel(panel: EmployeePanel) {
    setActivePanel(panel);

    if (panel === "goals") {
      setActiveTab("goal-sheet");
    }

    if (panel === "checkins" && activeTab === "goal-sheet") {
      setActiveTab("q1");
    }
  }

  function resetDraft() {
    setGoalDraft(emptyGoalDraft);
    setEditingGoalId(null);
  }

  function startCreateGoal(shared = false) {
    setGoalDraft({
      ...emptyGoalDraft,
      shared
    });
    setEditingGoalId(null);
  }

  function startEditGoal(goal: Goal) {
    setGoalDraft({
      id: goal.id,
      title: goal.title,
      thrustArea: goal.thrustArea,
      description: goal.description,
      unit: goal.unit,
      target: goal.target,
      weight: goal.weight,
      shared: goal.shared
    });
    setEditingGoalId(goal.id);
  }

  function saveGoal() {
    if (!goalDraft.title.trim() || !goalDraft.thrustArea.trim()) {
      return;
    }

    if (!editingGoalId && goals.length >= 8) {
      return;
    }

    const nextGoal: Goal = {
      id: editingGoalId ?? `goal-local-${goals.length + 1}`,
      ownerId: "user-employee-1",
      title: goalDraft.title.trim(),
      thrustArea: goalDraft.thrustArea.trim(),
      description: goalDraft.description.trim(),
      unit: goalDraft.unit,
      target: goalDraft.target.trim(),
      weight: goalDraft.weight,
      state: "Draft",
      shared: goalDraft.shared
    };

    setGoals((currentGoals) => {
      if (editingGoalId) {
        return currentGoals.map((goal) => (goal.id === editingGoalId ? nextGoal : goal));
      }

      return [...currentGoals, nextGoal];
    });

    setCheckInsByTab(() =>
      buildCheckInState(
        editingGoalId
          ? goals.map((goal) => (goal.id === editingGoalId ? nextGoal : goal))
          : [...goals, nextGoal],
        snapshot.checkIns
      )
    );

    resetDraft();
  }

  function removeGoal(goalId: string) {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
    setCheckInsByTab(() =>
      buildCheckInState(goals.filter((goal) => goal.id !== goalId), snapshot.checkIns)
    );

    if (editingGoalId === goalId) {
      resetDraft();
    }
  }

  function submitGoalSheet() {
    if (!canSubmit) {
      return;
    }

    setGoals((currentGoals) =>
      currentGoals.map((goal) => ({
        ...goal,
        state: "Pending Approval"
      }))
    );
  }

  function updateCheckIn(
    tab: Exclude<EmployeeTab, "goal-sheet">,
    checkInId: string,
    field: keyof Omit<CheckInDraft, "id" | "goalId" | "goalTitle" | "readOnly">,
    value: string
  ) {
    setCheckInsByTab((currentState) => ({
      ...currentState,
      [tab]: currentState[tab].map((item) =>
        item.id === checkInId
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    }));
  }

  const goalSheetValidationMessage = canSubmit
    ? "Goal sheet is valid. All rules pass — ready to submit for manager approval."
    : [
        !weightValid ? "Total weightage must equal 100%." : null,
        !minWeightValid ? "Each goal must have at least 10% weightage." : null,
        !goalCountValid ? "No more than 8 goals allowed." : null,
        goalCount === 0 ? "Add at least one goal to continue." : null,
        sheetStatus !== "Draft" ? "This sheet is no longer editable." : null
      ]
        .filter(Boolean)
        .join(" ");

  const pageTitle =
    activePanel === "goals"
      ? "My goal sheet"
      : activePanel === "checkins"
        ? tabs.find((tab) => tab.id === activeTab)?.label ?? "Check-ins"
      : "Notifications";
  const cycleMeta =
    activePanel === "goals"
      ? "FY26 · Phase 2 — Goal setting open"
      : activePanel === "checkins"
        ? `FY26 · ${activeQuarterMeta?.period ?? ""}`
        : "FY26 · Workflow alerts and reminders";

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-gray-900">
      <aside className="fixed left-0 top-0 flex h-screen w-[200px] flex-col border-r border-gray-200 bg-[#f6f3ec]">
        <div className="border-b border-gray-200 px-5 py-6">
          <p className="text-2xl font-semibold tracking-tight text-gray-900">AtomQuest</p>
          <p className="mt-1 text-[13px] text-gray-500">FY26 Goal Cycle</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {["WORKSPACE", "PROGRESS"].map((section) => (
            <div key={section} className="mb-6">
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {section}
              </p>
              <nav className="space-y-1">
                {workspaceNav
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
              <p className="text-[11px] text-gray-400">Employee</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-[200px] min-h-screen">
        <div className="border-b border-gray-200 bg-white px-10 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-tight text-gray-900">{pageTitle}</h1>
              <p className="mt-1 text-[13px] text-gray-500">{cycleMeta}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-[13px] font-medium text-gray-700"
                type="button"
              >
                Export
              </button>
              {showTabbedWorkspace ? (
                <button
                  className="rounded-xl bg-blue-700 px-5 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                  disabled={activeTab !== "goal-sheet" ? !activeQuarterMeta?.isOpen : !canSubmit}
                  onClick={activeTab === "goal-sheet" ? submitGoalSheet : undefined}
                  type="button"
                >
                  {activeTab === "goal-sheet" ? "Submit for approval" : "Save update"}
                </button>
              ) : null}
            </div>
          </div>

          {showTabbedWorkspace ? (
            <div className="mt-6 flex gap-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  className={
                    activeTab === tab.id
                      ? "border-b-2 border-blue-700 pb-4 text-left text-[14px] font-semibold text-blue-700"
                      : "border-b-2 border-transparent pb-4 text-left text-[14px] font-medium text-gray-500"
                  }
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActivePanel(tab.id === "goal-sheet" ? "goals" : "checkins");
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
            <EmployeeNotificationsPanel
              canSubmit={canSubmit}
              checkInPeriod={activeQuarterMeta?.period ?? "Q1 Check-in"}
              goalCount={goalCount}
              sheetStatus={sheetStatus}
            />
          ) : activeTab === "goal-sheet" ? (
            <div className="space-y-6 pb-32">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <p className="text-[28px] font-medium text-gray-900">{totalWeightage}%</p>
                  <p className="mt-2 text-[13px] text-gray-500">Total weightage</p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${getStatTone(weightValid)}`}
                  >
                    {weightValid ? "Valid" : "Must equal 100%"}
                  </span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <p className="text-[28px] font-medium text-gray-900">{goalCount} / 8</p>
                  <p className="mt-2 text-[13px] text-gray-500">Goal count</p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${getStatTone(goalCountValid)}`}
                  >
                    {goalCountValid ? "Within limit" : "Goal limit exceeded"}
                  </span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <p className="text-[28px] font-medium text-gray-900">{sheetStatus}</p>
                  <p className="mt-2 text-[13px] text-gray-500">Sheet status</p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${getSheetStatusTone(sheetStatus)}`}
                  >
                    {sheetStatus === "Draft"
                      ? "Pending submit"
                      : sheetStatus === "Submitted"
                        ? "Waiting for manager"
                        : "Approved"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-medium text-gray-900">
                      {editingGoalId ? "Edit goal" : "Create goal"}
                    </p>
                    <p className="mt-1 text-[13px] text-gray-500">
                      Fill the goal details below. Shared goals keep title and target read-only.
                    </p>
                  </div>
                  {(editingGoalId || goalDraft.title || goalDraft.description || goalDraft.thrustArea) && (
                    <button
                      className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-medium text-gray-600"
                      onClick={resetDraft}
                      type="button"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Goal title</span>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                      disabled={sheetStatus !== "Draft" || goalDraft.shared}
                      onChange={(event) =>
                        setGoalDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      value={goalDraft.title}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Thrust area</span>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                      disabled={sheetStatus !== "Draft"}
                      onChange={(event) =>
                        setGoalDraft((current) => ({ ...current, thrustArea: event.target.value }))
                      }
                      value={goalDraft.thrustArea}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Unit of measure</span>
                    <select
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                      disabled={sheetStatus !== "Draft"}
                      onChange={(event) =>
                        setGoalDraft((current) => ({
                          ...current,
                          unit: event.target.value as GoalUnit
                        }))
                      }
                      value={goalDraft.unit}
                    >
                      {["Numeric", "%", "Timeline", "Zero"].map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Target</span>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                      disabled={sheetStatus !== "Draft" || goalDraft.shared}
                      onChange={(event) =>
                        setGoalDraft((current) => ({ ...current, target: event.target.value }))
                      }
                      placeholder={goalDraft.unit === "Timeline" ? "Q3 deadline" : "Enter target"}
                      value={goalDraft.target}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Weightage (%)</span>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                      disabled={sheetStatus !== "Draft"}
                      min={10}
                      onChange={(event) =>
                        setGoalDraft((current) => ({
                          ...current,
                          weight: Number(event.target.value)
                        }))
                      }
                      type="number"
                      value={goalDraft.weight}
                    />
                  </label>
                  <label className="flex items-end gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-[13px] text-gray-600">
                    <input
                      checked={goalDraft.shared}
                      className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-200"
                      disabled={sheetStatus !== "Draft"}
                      onChange={(event) =>
                        setGoalDraft((current) => ({
                          ...current,
                          shared: event.target.checked
                        }))
                      }
                      type="checkbox"
                    />
                    <span>Mark as shared goal</span>
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Description</span>
                  <textarea
                    className="min-h-28 w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none ring-0 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    disabled={sheetStatus !== "Draft"}
                    onChange={(event) =>
                      setGoalDraft((current) => ({ ...current, description: event.target.value }))
                    }
                    value={goalDraft.description}
                  />
                </label>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="rounded-lg bg-gray-50 px-4 py-3 text-[13px] text-gray-600">
                    {goalDraft.shared
                      ? "Shared goal: title and target stay read-only for recipient view."
                      : `UoM preview: ${getUomCopy(goalDraft.unit)}`}
                  </div>
                  <button
                    className="rounded-lg bg-blue-700 px-5 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                    disabled={
                      sheetStatus !== "Draft" ||
                      !goalDraft.title.trim() ||
                      !goalDraft.thrustArea.trim() ||
                      !goalDraft.target.trim()
                    }
                    onClick={saveGoal}
                    type="button"
                  >
                    {editingGoalId ? "Save changes" : "Add goal"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => (
                  <button
                    className="block w-full rounded-xl border border-gray-200 bg-white p-6 text-left"
                    key={goal.id}
                    onClick={() => startEditGoal(goal)}
                    type="button"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {goal.shared ? <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
                          <h3 className="text-[15px] font-medium tracking-tight text-gray-900">{goal.title}</h3>
                        </div>
                        <p className="mt-1 text-[13px] text-gray-400">
                          Thrust area: {goal.thrustArea}
                          {goal.shared ? " · Shared by admin" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-700">
                          {goal.weight}%
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium ${getGoalCardStatusTone(goal.state)}`}
                        >
                          {goal.state}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 text-base md:grid-cols-3">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-gray-400">
                          Unit of Measure
                        </p>
                        <p className="mt-2 font-medium text-gray-900">{getUomCopy(goal.unit)}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-gray-400">Target</p>
                        <p className="mt-2 font-medium text-gray-900">{goal.target}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-gray-400">
                          Shared Goal
                        </p>
                        <p className="mt-2 font-medium text-gray-900">
                          {goal.shared ? "Yes — read only fields" : "No"}
                        </p>
                      </div>
                    </div>

                    {sheetStatus === "Draft" ? (
                      <div className="mt-5 flex justify-end">
                        <span
                          className="text-[13px] font-medium text-rose-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeGoal(goal.id);
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          Remove
                        </span>
                      </div>
                    ) : null}
                  </button>
                ))}

                {goalCount < 8 ? (
                  <button
                    className="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-5 text-[13px] font-medium text-gray-500"
                    onClick={() => startCreateGoal(false)}
                    type="button"
                  >
                    + Add goal ({8 - goalCount} remaining)
                  </button>
                ) : null}
              </div>

              <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-t-xl border border-gray-200 bg-white px-6 py-4">
                <p
                  className={`text-[12px] font-medium ${
                    canSubmit ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {goalSheetValidationMessage}
                </p>
                <button
                  className="rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                  disabled={!canSubmit}
                  onClick={submitGoalSheet}
                  type="button"
                >
                  Submit goal sheet
                </button>
              </div>
            </div>
          ) : (
            <QuarterView
              checkIns={checkInsByTab[activeTab]}
              meta={activeQuarterMeta!}
              onChange={updateCheckIn}
              tab={activeTab}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function EmployeeNotificationsPanel({
  canSubmit,
  checkInPeriod,
  goalCount,
  sheetStatus
}: {
  canSubmit: boolean;
  checkInPeriod: string;
  goalCount: number;
  sheetStatus: string;
}) {
  const notifications = [
    {
      title: "Goal sheet status",
      body: `Your goal sheet is currently ${sheetStatus.toLowerCase()}.`
    },
    {
      title: "Goal count",
      body: `${goalCount} of 8 goals are currently added to your sheet.`
    },
    {
      title: "Next milestone",
      body: `${checkInPeriod} updates become available when the window opens.`
    },
    {
      title: "Submission readiness",
      body: canSubmit ? "All validations pass and your sheet is ready to submit." : "Some validations are still pending before submission."
    }
  ];

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <article className="rounded-xl border border-gray-200 bg-white p-6" key={item.title}>
          <h3 className="text-[15px] font-medium text-gray-900">{item.title}</h3>
          <p className="mt-2 text-[13px] text-gray-500">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function QuarterView({
  checkIns,
  meta,
  onChange,
  tab
}: {
  checkIns: CheckInDraft[];
  meta: ReturnType<typeof getWindowMeta>;
  onChange: (
    tab: Exclude<EmployeeTab, "goal-sheet">,
    checkInId: string,
    field: keyof Omit<CheckInDraft, "id" | "goalId" | "goalTitle" | "readOnly">,
    value: string
  ) => void;
  tab: Exclude<EmployeeTab, "goal-sheet">;
}) {
  return (
    <div className="space-y-6 pb-10">
      {!meta.isOpen ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-medium text-amber-800">
          Check-in window opens {meta.label}
        </div>
      ) : null}

      <div className="space-y-4">
        {checkIns.map((checkIn) => (
          <article className="rounded-xl border border-gray-200 bg-white p-6" key={checkIn.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-medium text-gray-900">{checkIn.goalTitle}</h3>
                <p className="mt-1 text-[13px] text-gray-400">
                  Goal-linked quarterly update
                  {checkIn.readOnly ? " · Achievement updates come from the primary owner" : ""}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-700">
                {checkIn.status}
              </span>
            </div>

            {checkIn.readOnly ? (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[12px] text-blue-700">
                This is a shared goal. Planned achievement, actual achievement, and progress updates
                are read-only in the recipient view.
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Planned Achievement</span>
                <input
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  disabled={!meta.isOpen || checkIn.readOnly}
                  onChange={(event) => onChange(tab, checkIn.id, "planned", event.target.value)}
                  value={checkIn.planned}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Actual Achievement</span>
                <input
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  disabled={!meta.isOpen || checkIn.readOnly}
                  onChange={(event) => onChange(tab, checkIn.id, "actual", event.target.value)}
                  value={checkIn.actual}
                />
              </label>
              <label className="space-y-2">
                <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Progress Status</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  disabled={!meta.isOpen || checkIn.readOnly}
                  onChange={(event) => onChange(tab, checkIn.id, "status", event.target.value)}
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

            <label className="mt-4 block space-y-2">
              <span className="text-[12px] uppercase tracking-[0.04em] text-gray-400">Employee Update Note</span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                disabled={!meta.isOpen || checkIn.readOnly}
                onChange={(event) => onChange(tab, checkIn.id, "comment", event.target.value)}
                value={checkIn.comment}
              />
            </label>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={!meta.isOpen}
          type="button"
        >
          Save quarterly update
        </button>
      </div>
    </div>
  );
}
