export type Role = "employee" | "manager" | "admin";

export type GoalUnit = "Numeric" | "%" | "Timeline" | "Zero";
export type GoalState = "Draft" | "Pending Approval" | "Approved" | "Rework";
export type CheckInStatus = "Not Started" | "On Track" | "Completed";

export type User = {
  id: string;
  name: string;
  role: Role;
  department: string;
  managerId?: string;
};

export type Goal = {
  id: string;
  ownerId: string;
  title: string;
  thrustArea: string;
  description: string;
  unit: GoalUnit;
  target: string;
  weight: number;
  state: GoalState;
  shared: boolean;
  managerComment?: string;
};

export type CheckIn = {
  id: string;
  goalId: string;
  period: string;
  planned: string;
  actual: string;
  status: CheckInStatus;
  comment: string;
  managerComment?: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type UnlockRequest = {
  id: string;
  goalId: string;
  employeeName: string;
  reason: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Declined";
};

export type ReportRow = {
  employeeName: string;
  goalTitle: string;
  target: string;
  actual: string;
  status: CheckInStatus;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type DistributionRow = {
  label: string;
  value: number;
  tone: "navy" | "gold" | "green" | "rose";
};

export type ManagerEffectivenessRow = {
  managerName: string;
  completionRate: number;
  pendingApprovals: number;
};

export type AnalyticsSnapshot = {
  quarterlyTrends: TrendPoint[];
  goalDistribution: DistributionRow[];
  managerEffectiveness: ManagerEffectivenessRow[];
};

export type DashboardSnapshot = {
  role: Role;
  headline: string;
  metrics: Metric[];
  goals: Goal[];
  checkIns: CheckIn[];
  auditEvents: AuditEvent[];
  focusAreas: string[];
  unlockRequests: UnlockRequest[];
  reportRows: ReportRow[];
  analytics: AnalyticsSnapshot;
};
