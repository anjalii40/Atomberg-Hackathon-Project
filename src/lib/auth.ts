import { SignJWT, jwtVerify } from "jose";

import { Role } from "@/lib/types";

export const AUTH_COOKIE_NAME = "atomquest_session";

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.JWT_SECRET ?? "atomquest-dev-secret-change-me");

export type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};

export type DemoCredential = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const demoCredentials: DemoCredential[] = [
  {
    id: "user-employee-1",
    name: "Aarav Sharma",
    email: "employee@atomquest.local",
    password: "employee123",
    role: "employee"
  },
  {
    id: "user-manager-1",
    name: "Nisha Iyer",
    email: "manager@atomquest.local",
    password: "manager123",
    role: "manager"
  },
  {
    id: "user-admin-1",
    name: "Meera Kapoor",
    email: "admin@atomquest.local",
    password: "admin123",
    role: "admin"
  }
];

export function getDashboardPath(role: Role) {
  if (role === "manager") {
    return "/manager";
  }

  if (role === "admin") {
    return "/admin";
  }

  return "/employee";
}

export function getLandingPath(role: Role) {
  return `/landing/${role}`;
}

export function findDemoUser(email: string, password: string) {
  return demoCredentials.find(
    (credential) =>
      credential.email.toLowerCase() === email.toLowerCase().trim() &&
      credential.password === password
  );
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export async function verifySession(token: string) {
  const result = await jwtVerify<SessionPayload>(token, secret);
  return result.payload;
}
