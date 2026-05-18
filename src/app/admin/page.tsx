import { redirect } from "next/navigation";

import { AdminWorkspace } from "@/components/admin-workspace";
import { getDashboardSnapshot } from "@/lib/demo-data";
import { getCurrentSession } from "@/lib/server-session";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  const snapshot = getDashboardSnapshot("admin");

  return <AdminWorkspace snapshot={snapshot} userName={session.name} />;
}
