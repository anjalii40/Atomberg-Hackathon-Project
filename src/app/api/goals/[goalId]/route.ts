import { NextRequest, NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/server-session";
import { patchGoal } from "@/lib/runtime-store";

type Params = {
  params: Promise<{
    goalId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: Params) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goalId } = await context.params;
  const body = (await request.json()) as {
    target?: string;
    weight?: number;
    title?: string;
    description?: string;
    thrustArea?: string;
  };

  try {
    patchGoal(session, goalId, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update goal.";
    if (message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (message === "not_found") {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to update goal." }, { status: 400 });
  }
}
