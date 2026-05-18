import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, findDemoUser, getDashboardPath, signSession } from "@/lib/auth";
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
    email?: string;
    password?: string;
    role?: string;
    next?: string;
  };

  const selectedRole = parseRole(body.role);

  if (!body.email || !body.password || !selectedRole) {
    return NextResponse.json({ error: "Email, password, and role are required." }, { status: 400 });
  }

  const user = findDemoUser(body.email, body.password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (user.role !== selectedRole) {
    return NextResponse.json({ error: "Selected role does not match this account." }, { status: 403 });
  }

  const token = await signSession({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role
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
    body.next && body.next.startsWith("/") && (!nextRole || nextRole === user.role)
      ? body.next
      : getDashboardPath(user.role);

  return NextResponse.json({
    redirectTo
  });
}
