import { redirect } from "next/navigation";

import { RoleDashboard } from "@/components/role-dashboard";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function EmployeePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/employee");
  }

  const snapshot = getDashboardSnapshot("employee");

  return <RoleDashboard role="employee" snapshot={snapshot} userName={session.name} />;
}
