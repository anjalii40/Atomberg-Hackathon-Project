import { redirect } from "next/navigation";

import { EmployeeWorkspace } from "@/components/employee-workspace";
import { getDashboardPath } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function EmployeePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/employee");
  }

  if (session.role !== "employee") {
    redirect(getDashboardPath(session.role));
  }

  const snapshot = getDashboardSnapshot("employee");

  return <EmployeeWorkspace snapshot={snapshot} userName={session.name} />;
}
