import { AuthPanel } from "@/components/auth-panel";

export default function Home() {
  return (
    <main className="landing-page">
      <section className="simple-landing">
        <div className="simple-landing-copy">
          <span className="eyebrow landing-eyebrow">Project</span>
          <h1>AtomQuest Goal Portal</h1>
        </div>
        <AuthPanel />
      </section>
    </main>
  );
}
