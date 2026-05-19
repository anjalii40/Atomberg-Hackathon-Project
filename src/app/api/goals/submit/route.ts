import { NextRequest, NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/server-session";
import { submitGoalSheet } from "@/lib/runtime-store";
import { Goal } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    goals?: Array<
      Pick<Goal, "id" | "title" | "thrustArea" | "description" | "unit" | "target" | "weight" | "shared">
    >;
  };

  if (!body.goals || !Array.isArray(body.goals)) {
    return NextResponse.json({ error: "Goals payload is required." }, { status: 400 });
  }

  try {
    submitGoalSheet(session, body.goals);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit goals.";
    return NextResponse.json(
      { error: message === "forbidden" ? "Forbidden" : "Unable to submit goals." },
      { status: message === "forbidden" ? 403 : 400 }
    );
  }
}
