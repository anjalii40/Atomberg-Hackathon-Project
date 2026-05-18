import { redirect } from "next/navigation";

import { RoleDashboard } from "@/components/role-dashboard";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function ManagerPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/manager");
  }

  const snapshot = getDashboardSnapshot("manager");

  return <RoleDashboard role="manager" snapshot={snapshot} userName={session.name} />;
}
