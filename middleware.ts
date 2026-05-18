import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getDashboardPath,
  verifySession
} from "@/lib/auth";

const protectedRoutes = [
  "/employee",
  "/manager",
  "/admin"
] as const;

function getRequiredRole(pathname: string) {
  if (pathname.startsWith("/manager")) {
    return "manager" as const;
  }

  if (pathname.startsWith("/admin")) {
    return "admin" as const;
  }

  if (pathname.startsWith("/employee")) {
    return "employee" as const;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const requiredRole = getRequiredRole(pathname);

  if (!token && requiredRole) {
    const loginUrl = new URL(`/login?next=${pathname}${search}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  let session = null;

  if (token) {
    try {
      session = await verifySession(token);
    } catch {
      if (requiredRole) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
    }
  }

  if (requiredRole && session && session.role !== requiredRole) {
    return NextResponse.redirect(new URL(getDashboardPath(session.role), request.url));
  }

  if ((pathname === "/login" || pathname === "/") && session?.role && pathname === "/login") {
    return NextResponse.redirect(new URL(getDashboardPath(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/employee/:path*", "/manager/:path*", "/admin/:path*"]
};
