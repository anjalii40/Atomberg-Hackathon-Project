import { GoalState, Role } from "@/lib/types";

export function mapGoalStateTone(state: GoalState) {
  if (state === "Approved") {
    return "approved";
  }

  if (state === "Pending Approval") {
    return "submitted";
  }

  if (state === "Rework") {
    return "rework";
  }

  return "draft";
}

export function getRoleLabel(role: Role) {
  if (role === "manager") {
    return "Manager";
  }

  if (role === "admin") {
    return "Admin / HR";
  }

  return "Employee";
}
