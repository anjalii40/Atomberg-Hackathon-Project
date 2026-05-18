import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getDashboardPath,
  signSession
} from "@/lib/auth";
import { Role } from "@/lib/types";

function parseRole(role?: string): Role | null {
  if (role === "employee" || role === "manager" || role === "admin") {
    return role;
  }

  return null;
}

function getRouteRole(path?: string): Role | null {
  if (!path) {
    return null;
  }

  if (path.startsWith("/employee")) {
    return "employee";
  }

  if (path.startsWith("/manager")) {
    return "manager";
  }

  if (path.startsWith("/admin")) {
    return "admin";
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    next?: string;
  };

  const role = parseRole(body.role);

  if (!body.name || !body.email || !body.password || !role) {
    return NextResponse.json(
      { error: "Name, email, password, and role are required." },
      { status: 400 }
    );
  }

  const token = await signSession({
    sub: `signup-${body.email.toLowerCase()}`,
    name: body.name.trim(),
    email: body.email.toLowerCase().trim(),
    role
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  const nextRole = getRouteRole(body.next);
  const redirectTo =
    body.next && body.next.startsWith("/") && (!nextRole || nextRole === role)
      ? body.next
      : getDashboardPath(role);

  return NextResponse.json({ redirectTo });
}
