import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/server-session";
import { getDashboardSnapshotForSession } from "@/lib/runtime-store";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getDashboardSnapshotForSession(session));
}
