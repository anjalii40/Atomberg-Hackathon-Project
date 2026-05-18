import { NextRequest, NextResponse } from "next/server";

import { getDashboardSnapshot } from "@/lib/demo-data";
import { Role } from "@/lib/types";

function parseRole(role: string | null): Role {
  if (role === "manager" || role === "admin") {
    return role;
  }

  return "employee";
}

export function GET(request: NextRequest) {
  const role = parseRole(request.nextUrl.searchParams.get("role"));

  return NextResponse.json(getDashboardSnapshot(role));
}
