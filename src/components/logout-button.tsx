"use client";

import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <button className="secondary-button" onClick={logout} type="button">
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}
