import Link from "next/link";

import { Role } from "@/lib/types";

const roles: Array<{ id: Role; label: string }> = [
  { id: "employee", label: "Employee" },
  { id: "manager", label: "Manager" },
  { id: "admin", label: "Admin / HR" }
];

type RoleSwitcherProps = {
  activeRole: Role;
};

export function RoleSwitcher({ activeRole }: RoleSwitcherProps) {
  return (
    <div className="role-switcher" aria-label="Role switcher">
      {roles.map((role) => (
        <Link
          key={role.id}
          className={role.id === activeRole ? "role-chip role-chip-active" : "role-chip"}
          href={`/?role=${role.id}`}
        >
          {role.label}
        </Link>
      ))}
    </div>
  );
}
