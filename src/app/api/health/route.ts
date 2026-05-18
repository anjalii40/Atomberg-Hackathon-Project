import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    app: "atomquest-goal-portal",
    phase: "phase-1-foundation",
    roles: ["employee", "manager", "admin"]
  });
}
