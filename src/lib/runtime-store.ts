import { SessionPayload } from "@/lib/auth";
import {
  AnalyticsSnapshot,
  AuditEvent,
  CheckIn,
  DashboardSnapshot,
  DistributionRow,
  Goal,
  ManagerEffectivenessRow,
  Metric,
  ReportRow,
  Role,
  TrendPoint,
  UnlockRequest,
  User
} from "@/lib/types";

type GoalInput = Pick<
  Goal,
  "id" | "title" | "thrustArea" | "description" | "unit" | "target" | "weight" | "shared"
>;

type RuntimeState = {
  users: User[];
  goals: Goal[];
  checkIns: CheckIn[];
  auditEvents: AuditEvent[];
  unlockRequests: UnlockRequest[];
  nextGoalId: number;
  nextAuditId: number;
};

const quarterlyTrends: TrendPoint[] = [
  { label: "Q1", value: 62 },
  { label: "Q2", value: 74 },
  { label: "Q3", value: 81 },
  { label: "Q4", value: 88 }
];

const goalDistribution: DistributionRow[] = [
  { label: "Operational Excellence", value: 35, tone: "navy" },
  { label: "Quality", value: 25, tone: "gold" },
  { label: "Safety", value: 20, tone: "green" },
  { label: "Process Discipline", value: 20, tone: "rose" }
];

const managerEffectiveness: ManagerEffectivenessRow[] = [
  { managerName: "Nisha Iyer", completionRate: 92, pendingApprovals: 1 },
  { managerName: "Rohan Mehta", completionRate: 84, pendingApprovals: 3 },
  { managerName: "Sana Thomas", completionRate: 76, pendingApprovals: 4 }
];

const analytics: AnalyticsSnapshot = {
  quarterlyTrends,
  goalDistribution,
  managerEffectiveness
};

function createInitialState(): RuntimeState {
  const users: User[] = [
    {
      id: "user-employee-1",
      name: "Aarav Sharma",
      role: "employee",
      department: "Supply Chain",
      managerId: "user-manager-1"
    },
    {
      id: "user-employee-2",
      name: "Priya Singh",
      role: "employee",
      department: "Supply Chain",
      managerId: "user-manager-1"
    },
    {
      id: "user-manager-1",
      name: "Nisha Iyer",
      role: "manager",
      department: "Supply Chain"
    },
    {
      id: "user-admin-1",
      name: "Meera Kapoor",
      role: "admin",
      department: "People Operations"
    }
  ];

  const goals: Goal[] = [
    {
      id: "goal-201",
      ownerId: "user-employee-2",
      ownerName: "Priya Singh",
      title: "Improve fill-rate consistency for top SKUs",
      thrustArea: "Operational Excellence",
      description: "Reduce stock-out driven misses across the top-selling catalog.",
      unit: "%",
      target: "97%",
      weight: 55,
      state: "Pending Approval",
      shared: false
    },
    {
      id: "goal-202",
      ownerId: "user-employee-2",
      ownerName: "Priya Singh",
      title: "Reduce escalation backlog",
      thrustArea: "Customer Experience",
      description: "Close aged escalations faster with weekly triage.",
      unit: "Numeric",
      target: "20 tickets",
      weight: 45,
      state: "Pending Approval",
      shared: false
    }
  ];

  const checkIns: CheckIn[] = [];

  const auditEvents: AuditEvent[] = [
    {
      id: "audit-1",
      actor: "Priya Singh",
      action: "submitted goal sheet",
      target: "FY26 Goal Cycle",
      timestamp: "2026-05-17 16:20"
    }
  ];

  const unlockRequests: UnlockRequest[] = [];

  return {
    users,
    goals,
    checkIns,
    auditEvents,
    unlockRequests,
    nextGoalId: 203,
    nextAuditId: 2
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __atomquestRuntimeState: RuntimeState | undefined;
}

function getState() {
  if (!globalThis.__atomquestRuntimeState) {
    globalThis.__atomquestRuntimeState = createInitialState();
  }

  return globalThis.__atomquestRuntimeState;
}

function nowTimestamp() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function addAuditEvent(actor: string, action: string, target: string) {
  const state = getState();
  state.auditEvents.unshift({
    id: `audit-${state.nextAuditId++}`,
    actor,
    action,
    target,
    timestamp: nowTimestamp()
  });
}

function getUserById(userId: string) {
  return getState().users.find((user) => user.id === userId) ?? null;
}

function hydrateGoals(goals: Goal[]) {
  return goals.map((goal) => ({
    ...goal,
    ownerName: getUserById(goal.ownerId)?.name ?? goal.ownerName
  }));
}

function buildReportRows(goals: Goal[], checkIns: CheckIn[]): ReportRow[] {
  return goals.map((goal) => {
    const latestCheckIn = checkIns.find((checkIn) => checkIn.goalId === goal.id);
    return {
      employeeName: getUserById(goal.ownerId)?.name ?? "Employee",
      goalTitle: goal.title,
      target: goal.target,
      actual: latestCheckIn?.actual ?? "",
      status: latestCheckIn?.status ?? "Not Started"
    };
  });
}

function getRoleHeadline(role: Role) {
  if (role === "employee") {
    return "Shape goals, keep weightage clean, and stay ready for quarterly check-ins.";
  }

  if (role === "manager") {
    return "Review submissions, resolve rework quickly, and keep team progress visible.";
  }

  return "Monitor the cycle, handle exceptions, and keep governance airtight.";
}

function getRoleMetrics(role: Role, goals: Goal[]): Metric[] {
  if (role === "employee") {
    const approvedCount = goals.filter((goal) => goal.state === "Approved").length;
    const pendingCount = goals.filter((goal) => goal.state === "Pending Approval").length;
    const totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0);
    return [
      {
        label: "Goal Weight Total",
        value: `${totalWeight}%`,
        detail: "Aligned to validation requirement"
      },
      {
        label: "Approved Goals",
        value: `${approvedCount} / ${goals.length}`,
        detail: pendingCount > 0 ? `${pendingCount} pending review` : "Ready for check-ins"
      },
      {
        label: "Next Window",
        value: "Q1 in July",
        detail: "Planned vs actual capture"
      }
    ];
  }

  if (role === "manager") {
    const pendingApprovals = goals.filter((goal) => goal.state === "Pending Approval").length;
    const reworkCount = goals.filter((goal) => goal.state === "Rework").length;
    return [
      {
        label: "Pending Approvals",
        value: String(pendingApprovals),
        detail: "Submitted goals waiting for review"
      },
      {
        label: "Check-in Completion",
        value: "68%",
        detail: "Team completion this quarter"
      },
      {
        label: "Rework Queue",
        value: String(reworkCount),
        detail: "Action needed before lock date"
      }
    ];
  }

  return [
    {
      label: "Cycle Health",
      value: "On Track",
      detail: "Goal setup window is active"
    },
    {
      label: "Employees Covered",
      value: String(new Set(goals.map((goal) => goal.ownerId)).size),
      detail: "Across reporting groups"
    },
    {
      label: "Audit Exceptions",
      value: String(getState().unlockRequests.length),
      detail: "Require admin attention"
    }
  ];
}

function getRoleFocusAreas(role: Role) {
  if (role === "employee") {
    return [
      "Submit a complete goal sheet before the lock date",
      "Keep every goal above the 10 percent minimum weight",
      "Prepare for quarterly planned vs actual updates"
    ];
  }

  if (role === "manager") {
    return [
      "Approve or send back all submitted goals",
      "Document structured feedback for every check-in",
      "Track completion rates across the team dashboard"
    ];
  }

  return [
    "Keep cycle windows aligned to the BRD schedule",
    "Resolve unlock requests and maintain audit traceability",
    "Prepare exportable reporting for evaluation day"
  ];
}

function getManagedEmployeeIds(managerId: string) {
  return getState()
    .users.filter((user) => user.managerId === managerId)
    .map((user) => user.id);
}

export function getDashboardSnapshotForSession(session: SessionPayload): DashboardSnapshot {
  const state = getState();

  if (session.role === "employee") {
    const goals = hydrateGoals(state.goals.filter((goal) => goal.ownerId === session.sub));
    const goalIds = new Set(goals.map((goal) => goal.id));
    const checkIns = state.checkIns.filter((checkIn) => goalIds.has(checkIn.goalId));
    return {
      role: session.role,
      headline: getRoleHeadline(session.role),
      metrics: getRoleMetrics(session.role, goals),
      goals,
      checkIns,
      auditEvents: state.auditEvents.filter((event) => event.actor === session.name || event.target === "FY26 Goal Cycle"),
      focusAreas: getRoleFocusAreas(session.role),
      unlockRequests: state.unlockRequests.filter((request) => goals.some((goal) => goal.id === request.goalId)),
      reportRows: buildReportRows(goals, checkIns),
      analytics
    };
  }

  if (session.role === "manager") {
    const employeeIds = new Set(getManagedEmployeeIds(session.sub));
    const goals = hydrateGoals(
      state.goals.filter((goal) => employeeIds.has(goal.ownerId) && goal.state !== "Draft")
    );
    const goalIds = new Set(goals.map((goal) => goal.id));
    const checkIns = state.checkIns.filter((checkIn) => goalIds.has(checkIn.goalId));
    return {
      role: session.role,
      headline: getRoleHeadline(session.role),
      metrics: getRoleMetrics(session.role, goals),
      goals,
      checkIns,
      auditEvents: state.auditEvents,
      focusAreas: getRoleFocusAreas(session.role),
      unlockRequests: state.unlockRequests.filter((request) => goalIds.has(request.goalId)),
      reportRows: buildReportRows(goals, checkIns),
      analytics
    };
  }

  const goals = hydrateGoals(state.goals);
  return {
    role: session.role,
    headline: getRoleHeadline(session.role),
    metrics: getRoleMetrics(session.role, goals),
    goals,
    checkIns: state.checkIns,
    auditEvents: state.auditEvents,
    focusAreas: getRoleFocusAreas(session.role),
    unlockRequests: state.unlockRequests,
    reportRows: buildReportRows(goals, state.checkIns),
    analytics
  };
}

export function submitGoalSheet(session: SessionPayload, goalsInput: GoalInput[]) {
  if (session.role !== "employee") {
    throw new Error("forbidden");
  }

  const state = getState();
  const existingGoals = state.goals.filter((goal) => goal.ownerId === session.sub);
  const existingById = new Map(existingGoals.map((goal) => [goal.id, goal]));
  const approvedLockedGoals = existingGoals.filter((goal) => goal.state === "Approved");

  const submittedGoals = goalsInput.map((input) => {
    const previous = input.id ? existingById.get(input.id) : undefined;
    if (previous?.state === "Approved") {
      return previous;
    }

    const id = input.id ?? `goal-${state.nextGoalId++}`;
    return {
      id,
      ownerId: session.sub,
      ownerName: session.name,
      title: input.title,
      thrustArea: input.thrustArea,
      description: input.description,
      unit: input.unit,
      target: input.target,
      weight: input.weight,
      state: "Pending Approval" as const,
      shared: input.shared,
      managerComment: undefined
    };
  });

  state.goals = state.goals.filter(
    (goal) => goal.ownerId !== session.sub || goal.state === "Approved"
  );
  state.goals.push(...approvedLockedGoals.filter((goal) => !state.goals.some((item) => item.id === goal.id)));
  state.goals = state.goals.filter((goal, index, goals) => goals.findIndex((item) => item.id === goal.id) === index);
  state.goals = state.goals.filter((goal) => goal.ownerId !== session.sub || goal.state === "Approved");
  state.goals.push(...submittedGoals);

  addAuditEvent(session.name, "submitted goal sheet", "FY26 Goal Cycle");
}

export function reviewGoal(
  session: SessionPayload,
  goalId: string,
  payload: { action: "Approved" | "Rework"; target: string; weight: number; managerComment: string }
) {
  if (session.role !== "manager") {
    throw new Error("forbidden");
  }

  const state = getState();
  const goal = state.goals.find((item) => item.id === goalId);
  if (!goal) {
    throw new Error("not_found");
  }

  const owner = getUserById(goal.ownerId);
  if (!owner || owner.managerId !== session.sub) {
    throw new Error("forbidden");
  }

  if (goal.state !== "Pending Approval" && goal.state !== "Rework") {
    throw new Error("invalid_state");
  }

  if (goal.target !== payload.target) {
    addAuditEvent(session.name, `updated target from ${goal.target} to ${payload.target}`, goal.title);
  }

  if (goal.weight !== payload.weight) {
    addAuditEvent(session.name, `updated weightage from ${goal.weight}% to ${payload.weight}%`, goal.title);
  }

  if (payload.action === "Rework") {
    state.goals
      .filter((item) => item.ownerId === goal.ownerId && (item.state === "Pending Approval" || item.state === "Rework"))
      .forEach((item) => {
        item.state = "Rework";
        item.managerComment = payload.managerComment.trim();
      });

    addAuditEvent(session.name, "sent goal sheet for rework", owner.name);
    return;
  }

  goal.target = payload.target;
  goal.weight = payload.weight;
  goal.managerComment = payload.managerComment.trim();
  goal.state = payload.action;

  addAuditEvent(session.name, "approved goal", goal.title);
}

export function patchGoal(
  session: SessionPayload,
  goalId: string,
  payload: Partial<Pick<Goal, "target" | "weight" | "title" | "description" | "thrustArea">>
) {
  const state = getState();
  const goal = state.goals.find((item) => item.id === goalId);

  if (!goal) {
    throw new Error("not_found");
  }

  if (session.role === "employee") {
    if (goal.ownerId !== session.sub || (goal.state !== "Draft" && goal.state !== "Rework")) {
      throw new Error("forbidden");
    }
  } else if (session.role === "manager") {
    const owner = getUserById(goal.ownerId);
    if (!owner || owner.managerId !== session.sub || (goal.state !== "Pending Approval" && goal.state !== "Rework")) {
      throw new Error("forbidden");
    }
  } else {
    throw new Error("forbidden");
  }

  if (payload.target !== undefined) {
    goal.target = payload.target;
  }

  if (payload.weight !== undefined) {
    goal.weight = payload.weight;
  }

  if (payload.title !== undefined) {
    goal.title = payload.title;
  }

  if (payload.description !== undefined) {
    goal.description = payload.description;
  }

  if (payload.thrustArea !== undefined) {
    goal.thrustArea = payload.thrustArea;
  }
}
