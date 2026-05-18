import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth-panel";
import { getDashboardPath } from "@/lib/auth";
import { getCurrentSession } from "@/lib/server-session";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();

  if (session?.role) {
    redirect(getDashboardPath(session.role));
  }

  const params = searchParams ? await searchParams : undefined;
  const nextPath = params?.next ?? "";

  return (
    <main className="landing-page">
      <section className="simple-landing">
        <div className="simple-landing-copy">
          <span className="eyebrow landing-eyebrow">Project</span>
          <h1>AtomQuest Goal Portal</h1>
        </div>
        <AuthPanel nextPath={nextPath} />
      </section>
    </main>
  );
}
