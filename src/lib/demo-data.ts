import {
  AnalyticsSnapshot,
  AuditEvent,
  CheckIn,
  DashboardSnapshot,
  DistributionRow,
  Goal,
  ManagerEffectivenessRow,
  ReportRow,
  Role,
  TrendPoint,
  UnlockRequest,
  User
} from "@/lib/types";

const users: User[] = [
  {
    id: "user-employee-1",
    name: "Aarav Sharma",
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
    id: "goal-1",
    ownerId: "user-employee-1",
    title: "Reduce dispatch TAT for priority SKUs",
    thrustArea: "Operational Excellence",
    description: "Improve cross-team coordination to bring dispatch turnaround time under 24 hours.",
    unit: "Numeric",
    target: "24 hours",
    weight: 35,
    state: "Submitted",
    shared: false
  },
  {
    id: "goal-2",
    ownerId: "user-employee-1",
    title: "Improve warehouse inventory accuracy",
    thrustArea: "Quality",
    description: "Lift cycle count accuracy through tighter reconciliation controls.",
    unit: "%",
    target: "98%",
    weight: 25,
    state: "Approved",
    shared: false
  },
  {
    id: "goal-3",
    ownerId: "user-employee-1",
    title: "Adopt shared safety KPI rollup",
    thrustArea: "Safety",
    description: "Participate in a shared department KPI distributed by admin.",
    unit: "Zero",
    target: "0 incidents",
    weight: 20,
    state: "Approved",
    shared: true
  },
  {
    id: "goal-4",
    ownerId: "user-employee-1",
    title: "Launch a quarterly exception review ritual",
    thrustArea: "Process Discipline",
    description: "Create a structured review checkpoint for recurring fulfillment issues.",
    unit: "Timeline",
    target: "Q3 deadline",
    weight: 20,
    state: "Draft",
    shared: false
  }
];

const checkIns: CheckIn[] = [
  {
    id: "checkin-1",
    goalId: "goal-2",
    period: "Q1 Check-in",
    planned: "98%",
    actual: "96.5%",
    status: "On Track",
    comment: "Gap is narrowing after reconciliation huddles."
  },
  {
    id: "checkin-2",
    goalId: "goal-3",
    period: "Q1 Check-in",
    planned: "0 incidents",
    actual: "0 incidents",
    status: "Completed",
    comment: "Shared KPI is green across all linked goals."
  }
];

const auditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    actor: "Aarav Sharma",
    action: "submitted goal sheet",
    target: "FY26 Goal Cycle",
    timestamp: "2026-05-17 16:20"
  },
  {
    id: "audit-2",
    actor: "Nisha Iyer",
    action: "approved goal",
    target: "Improve warehouse inventory accuracy",
    timestamp: "2026-05-17 17:05"
  },
  {
    id: "audit-3",
    actor: "Meera Kapoor",
    action: "configured Q1 check-in window",
    target: "FY26 Goal Cycle",
    timestamp: "2026-05-17 18:10"
  }
];

const unlockRequests: UnlockRequest[] = [
  {
    id: "unlock-1",
    goalId: "goal-2",
    employeeName: "Aarav Sharma",
    reason: "Target needs adjustment after revised warehouse baseline.",
    requestedAt: "2026-05-17 18:25",
    status: "Pending"
  },
  {
    id: "unlock-2",
    goalId: "goal-3",
    employeeName: "Aarav Sharma",
    reason: "Shared KPI linkage needs verification before annual lock.",
    requestedAt: "2026-05-17 18:42",
    status: "Pending"
  }
];

const reportRows: ReportRow[] = [
  {
    employeeName: "Aarav Sharma",
    goalTitle: "Improve warehouse inventory accuracy",
    target: "98%",
    actual: "96.5%",
    status: "On Track"
  },
  {
    employeeName: "Aarav Sharma",
    goalTitle: "Adopt shared safety KPI rollup",
    target: "0 incidents",
    actual: "0 incidents",
    status: "Completed"
  }
];

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
  {
    managerName: "Nisha Iyer",
    completionRate: 92,
    pendingApprovals: 1
  },
  {
    managerName: "Rohan Mehta",
    completionRate: 84,
    pendingApprovals: 3
  },
  {
    managerName: "Sana Thomas",
    completionRate: 76,
    pendingApprovals: 4
  }
];

const analytics: AnalyticsSnapshot = {
  quarterlyTrends,
  goalDistribution,
  managerEffectiveness
};

function getRoleHeadline(role: Role) {
  if (role === "employee") {
    return "Shape goals, keep weightage clean, and stay ready for quarterly check-ins.";
  }

  if (role === "manager") {
    return "Review submissions, resolve rework quickly, and keep team progress visible.";
  }

  return "Monitor the cycle, handle exceptions, and keep governance airtight.";
}

function getRoleMetrics(role: Role) {
  if (role === "employee") {
    return [
      {
        label: "Goal Weight Total",
        value: "100%",
        detail: "Aligned to validation requirement"
      },
      {
        label: "Approved Goals",
        value: "2 / 4",
        detail: "One draft and one submitted"
      },
      {
        label: "Next Window",
        value: "Q1 in July",
        detail: "Planned vs actual capture"
      }
    ];
  }

  if (role === "manager") {
    return [
      {
        label: "Pending Approvals",
        value: "3",
        detail: "Includes one shared KPI review"
      },
      {
        label: "Check-in Completion",
        value: "68%",
        detail: "Team completion this quarter"
      },
      {
        label: "Rework Queue",
        value: "1",
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
      value: "126",
      detail: "Across 9 reporting groups"
    },
    {
      label: "Audit Exceptions",
      value: "2",
      detail: "Both require unlock review"
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

export function getDashboardSnapshot(role: Role): DashboardSnapshot {
  const employee = users.find((user) => user.role === "employee");
  const employeeGoals = goals.filter((goal) => goal.ownerId === employee?.id);
  const employeeGoalIds = new Set(employeeGoals.map((goal) => goal.id));
  const employeeCheckIns = checkIns.filter((checkIn) => employeeGoalIds.has(checkIn.goalId));

  if (role === "employee") {
    return {
      role,
      headline: getRoleHeadline(role),
      metrics: getRoleMetrics(role),
      goals: employeeGoals,
      checkIns: employeeCheckIns,
      auditEvents,
      focusAreas: getRoleFocusAreas(role),
      unlockRequests,
      reportRows,
      analytics
    };
  }

  if (role === "manager") {
    return {
      role,
      headline: getRoleHeadline(role),
      metrics: getRoleMetrics(role),
      goals: employeeGoals.filter((goal) => goal.state !== "Draft"),
      checkIns: employeeCheckIns,
      auditEvents,
      focusAreas: getRoleFocusAreas(role),
      unlockRequests,
      reportRows,
      analytics
    };
  }

  return {
    role,
    headline: getRoleHeadline(role),
    metrics: getRoleMetrics(role),
    goals: employeeGoals,
    checkIns: employeeCheckIns,
    auditEvents,
    focusAreas: getRoleFocusAreas(role),
    unlockRequests,
    reportRows,
    analytics
  };
}
