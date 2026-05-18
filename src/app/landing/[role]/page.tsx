import Link from "next/link";
import { notFound } from "next/navigation";

import { demoCredentials, getDashboardPath } from "@/lib/auth";
import { Role } from "@/lib/types";

const landingContent: Record<
  Role,
  {
    title: string;
    subtitle: string;
    bullets: string[];
  }
> = {
  employee: {
    title: "Employee Goal Workspace",
    subtitle: "Plan goals with clarity, validate weightage, and stay prepared for check-ins.",
    bullets: [
      "Draft and submit a complete goal sheet",
      "Track planned vs actual achievement each quarter",
      "See shared goals and progress expectations in one place"
    ]
  },
  manager: {
    title: "Manager Review Workspace",
    subtitle: "Approve goals faster, handle rework clearly, and keep team momentum visible.",
    bullets: [
      "Review submissions with inline target and weight edits",
      "Send structured rework guidance or approve and lock goals",
      "Capture manager comments during quarterly check-ins"
    ]
  },
  admin: {
    title: "Admin Governance Workspace",
    subtitle: "Run the cycle, monitor exceptions, and export achievement views confidently.",
    bullets: [
      "Review unlock requests and maintain audit traceability",
      "Monitor cycle windows and completion readiness",
      "Export planned vs actual achievement summaries"
    ]
  }
};

type LandingRolePageProps = {
  params: Promise<{
    role: string;
  }>;
};

function parseRole(role: string): Role | null {
  if (role === "employee" || role === "manager" || role === "admin") {
    return role;
  }

  return null;
}

export default async function LandingRolePage({ params }: LandingRolePageProps) {
  const resolvedParams = await params;
  const role = parseRole(resolvedParams.role);

  if (!role) {
    notFound();
  }

  const content = landingContent[role];
  const demoUser = demoCredentials.find((credential) => credential.role === role);

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow landing-eyebrow">Role Landing Page</span>
          <h1>{content.title}</h1>
          <p className="landing-text">{content.subtitle}</p>
          <ul className="landing-list">
            {content.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <aside className="landing-sidecard">
          <span className="section-label">Demo Access</span>
          <strong>{demoUser?.email}</strong>
          <p>Password: {demoUser?.password}</p>
          <div className="landing-cta-row">
            <Link className="primary-button landing-button" href={`/login?next=${getDashboardPath(role)}`}>
              Login to {content.title}
            </Link>
            <Link className="secondary-button landing-button" href="/">
              Back to portal overview
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
