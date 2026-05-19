import { redirect } from "next/navigation";

import { EmployeeWorkspace } from "@/components/employee-workspace";
import { getDashboardPath } from "@/lib/auth";
import { getDashboardSnapshotForSession } from "@/lib/runtime-store";
import { getCurrentSession } from "@/lib/server-session";

export default async function EmployeePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/employee");
  }

  if (session.role !== "employee") {
    redirect(getDashboardPath(session.role));
  }

  const snapshot = getDashboardSnapshotForSession(session);

  return <EmployeeWorkspace snapshot={snapshot} userName={session.name} />;
}
