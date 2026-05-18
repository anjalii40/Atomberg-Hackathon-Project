import { redirect } from "next/navigation";

import { AdminWorkspace } from "@/components/admin-workspace";
import { getDashboardPath } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  if (session.role !== "admin") {
    redirect(getDashboardPath(session.role));
  }

  const snapshot = getDashboardSnapshot("admin");

  return <AdminWorkspace snapshot={snapshot} userName={session.name} />;
}
