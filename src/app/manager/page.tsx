import { redirect } from "next/navigation";

import { ManagerWorkspace } from "@/components/manager-workspace";
import { getDashboardPath } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function ManagerPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/manager");
  }

  if (session.role !== "manager") {
    redirect(getDashboardPath(session.role));
  }

  const snapshot = getDashboardSnapshot("manager");

  return <ManagerWorkspace snapshot={snapshot} userName={session.name} />;
}
