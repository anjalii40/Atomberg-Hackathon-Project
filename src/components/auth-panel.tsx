"use client";

import { FormEvent, useMemo, useState } from "react";

import { Role } from "@/lib/types";

type AuthMode = "login" | "signup";

const demoUsers: Record<
  Role,
  {
    email: string;
    password: string;
    name: string;
  }
> = {
  employee: {
    email: "employee@atomquest.local",
    password: "employee123",
    name: "Aarav Sharma"
  },
  manager: {
    email: "manager@atomquest.local",
    password: "manager123",
    name: "Nisha Iyer"
  },
  admin: {
    email: "admin@atomquest.local",
    password: "admin123",
    name: "Meera Kapoor"
  }
};

function getRoleLabel(role: Role) {
  if (role === "manager") {
    return "Manager";
  }

  if (role === "admin") {
    return "Admin / HR";
  }

  return "Employee";
}

type AuthPanelProps = {
  nextPath?: string;
};

export function AuthPanel({ nextPath = "" }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<Role>("employee");
  const [name, setName] = useState(demoUsers.employee.name);
  const [email, setEmail] = useState(demoUsers.employee.email);
  const [password, setPassword] = useState(demoUsers.employee.password);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heading = useMemo(() => (mode === "login" ? "Login" : "Sign up"), [mode]);

  function applyRole(nextRole: Role) {
    setRole(nextRole);
    setError(null);

    if (mode === "login") {
      setName(demoUsers[nextRole].name);
      setEmail(demoUsers[nextRole].email);
      setPassword(demoUsers[nextRole].password);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);

    if (nextMode === "login") {
      setName(demoUsers[role].name);
      setEmail(demoUsers[role].email);
      setPassword(demoUsers[role].password);
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        next: nextPath
      })
    });

    const payload = (await response.json()) as { error?: string; redirectTo?: string };

    if (!response.ok || !payload.redirectTo) {
      setError(payload.error ?? `${heading} failed.`);
      setIsSubmitting(false);
      return;
    }

    window.location.assign(payload.redirectTo);
  }

  return (
    <section className="auth-card auth-card-simple">
      <div className="auth-toggle-row">
        <button
          className={mode === "login" ? "auth-toggle active" : "auth-toggle"}
          onClick={() => switchMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={mode === "signup" ? "auth-toggle active" : "auth-toggle"}
          onClick={() => switchMode("signup")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <div className="auth-card-top">
        <h2>{heading}</h2>
      </div>

      <form className="auth-form" onSubmit={submit}>
        <label>
          Logging in as
          <select onChange={(event) => applyRole(event.target.value as Role)} value={role}>
            <option value="employee">{getRoleLabel("employee")}</option>
            <option value="manager">{getRoleLabel("manager")}</option>
            <option value="admin">{getRoleLabel("admin")}</option>
          </select>
        </label>

        {mode === "signup" ? (
          <label>
            Full name
            <input onChange={(event) => setName(event.target.value)} type="text" value={name} />
          </label>
        ) : null}

        <label>
          Email
          <input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </label>

        <label>
          Password
          <input
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        {error ? <div className="auth-error">{error}</div> : null}

        <button className="primary-button auth-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : heading}
        </button>
      </form>
    </section>
  );
}
