import { NextRequest, NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/server-session";
import { reviewGoal } from "@/lib/runtime-store";

type Params = {
  params: Promise<{
    goalId: string;
  }>;
};

export async function POST(request: NextRequest, context: Params) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goalId } = await context.params;
  const body = (await request.json()) as {
    action?: "Approved" | "Rework";
    target?: string;
    weight?: number;
    managerComment?: string;
  };

  if (!body.action || body.target === undefined || body.weight === undefined) {
    return NextResponse.json({ error: "Review payload is incomplete." }, { status: 400 });
  }

  try {
    reviewGoal(session, goalId, {
      action: body.action,
      target: body.target,
      weight: body.weight,
      managerComment: body.managerComment ?? ""
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to review goal.";
    if (message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (message === "not_found") {
      return NextResponse.json({ error: "Goal not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to review goal." }, { status: 400 });
  }
}
