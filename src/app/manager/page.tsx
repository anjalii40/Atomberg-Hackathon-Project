import { redirect } from "next/navigation";

import { ManagerWorkspace } from "@/components/manager-workspace";
import { getDashboardPath } from "@/lib/auth";
import { getDashboardSnapshotForSession } from "@/lib/runtime-store";
import { getCurrentSession } from "@/lib/server-session";

export default async function ManagerPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/manager");
  }

  if (session.role !== "manager") {
    redirect(getDashboardPath(session.role));
  }

  const snapshot = getDashboardSnapshotForSession(session);

  return <ManagerWorkspace snapshot={snapshot} userName={session.name} />;
}
