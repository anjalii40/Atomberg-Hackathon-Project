"use client";

import { useMemo, useState } from "react";

import { Goal } from "@/lib/types";

type ManagerApprovalQueueProps = {
  initialGoals: Goal[];
};

type ReviewAction = "approved" | "rework";

function buildInitialComments(goals: Goal[]) {
  return goals.reduce<Record<string, string>>((comments, goal) => {
    comments[goal.id] = goal.managerComment ?? "";
    return comments;
  }, {});
}

export function ManagerApprovalQueue({ initialGoals }: ManagerApprovalQueueProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [comments, setComments] = useState<Record<string, string>>(buildInitialComments(initialGoals));
  const [lastAction, setLastAction] = useState<{
    goalTitle: string;
    action: ReviewAction;
  } | null>(null);

  const submittedGoals = useMemo(
    () => goals.filter((goal) => goal.state === "Submitted" || goal.state === "Rework"),
    [goals]
  );
  const approvedGoals = useMemo(() => goals.filter((goal) => goal.state === "Approved"), [goals]);

  function updateGoal(goalId: string, field: "target" | "weight", value: string | number) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== goalId || goal.state === "Approved") {
          return goal;
        }

        return {
          ...goal,
          [field]: value
        };
      })
    );
  }

  function updateComment(goalId: string, value: string) {
    setComments((currentComments) => ({
      ...currentComments,
      [goalId]: value
    }));
  }

  function commitReview(goalId: string, action: ReviewAction) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const nextState = action === "approved" ? "Approved" : "Rework";

        setLastAction({
          goalTitle: goal.title,
          action
        });

        return {
          ...goal,
          state: nextState,
          managerComment: comments[goal.id]
        };
      })
    );
  }

  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Phase 3</span>
          <h2>Manager Approval Queue</h2>
          <p className="builder-intro">
            Review submitted goals, adjust target or weightage inline, and either approve or send
            them back for rework.
          </p>
        </div>
        <div className="approval-summary">
          <strong>{submittedGoals.length}</strong>
          <span>pending review</span>
        </div>
      </div>

      <div className="validation-grid">
        <article className="validation-card valid">
          <span>Ready to Review</span>
          <strong>{submittedGoals.length}</strong>
          <p>Submitted and rework goals currently in the queue.</p>
        </article>
        <article className="validation-card valid">
          <span>Approved and Locked</span>
          <strong>{approvedGoals.length}</strong>
          <p>Approved goals become locked until Admin intervention.</p>
        </article>
        <article className="validation-card valid">
          <span>Inline Edits Allowed</span>
          <strong>Target + Weight</strong>
          <p>Managers can tune review fields before making a decision.</p>
        </article>
      </div>

      <div className="builder-list">
        {submittedGoals.length > 0 ? (
          submittedGoals.map((goal) => {
            const isRework = goal.state === "Rework";

            return (
              <article className="goal-editor" key={goal.id}>
                <div className="goal-editor-header">
                  <div>
                    <span className="goal-number">{isRework ? "Rework Pending" : "Submitted for Approval"}</span>
                    <strong>{goal.title}</strong>
                    <p className="muted-text">{goal.thrustArea}</p>
                  </div>
                  <span className={isRework ? "status-pill status-rework" : "status-pill status-submitted"}>
                    {goal.state}
                  </span>
                </div>

                <div className="goal-editor-grid">
                  <label>
                    Target
                    <input
                      onChange={(event) => updateGoal(goal.id, "target", event.target.value)}
                      type="text"
                      value={goal.target}
                    />
                  </label>
                  <label>
                    Weightage (%)
                    <input
                      min={10}
                      onChange={(event) => updateGoal(goal.id, "weight", Number(event.target.value))}
                      type="number"
                      value={goal.weight}
                    />
                  </label>
                </div>

                <label className="goal-description">
                  Review Comment
                  <textarea
                    onChange={(event) => updateComment(goal.id, event.target.value)}
                    placeholder="Document approval notes or rework guidance."
                    rows={3}
                    value={comments[goal.id] ?? ""}
                  />
                </label>

                <div className="builder-footer approval-actions">
                  <div>
                    <strong>{goal.shared ? "Shared goal review" : "Individual goal review"}</strong>
                    <p className="muted-text">
                      Approvals lock the goal. Rework keeps it visible to the employee for revision.
                    </p>
                  </div>
                  <div className="button-row">
                    <button
                      className="secondary-button"
                      onClick={() => commitReview(goal.id, "rework")}
                      type="button"
                    >
                      Send Back for Rework
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => commitReview(goal.id, "approved")}
                      type="button"
                    >
                      Approve Goal
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <article className="goal-editor empty-state-card">
            <strong>No pending goals in the review queue.</strong>
            <p className="muted-text">
              All submitted items are approved or waiting for a later workflow transition.
            </p>
          </article>
        )}
      </div>

      <div className="locked-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">Locked After Approval</span>
            <h2>Approved Goals</h2>
          </div>
        </div>
        <div className="locked-list">
          {approvedGoals.map((goal) => (
            <div className="locked-card" key={goal.id}>
              <div className="stack-card-top">
                <strong>{goal.title}</strong>
                <span className="status-pill status-approved">Approved</span>
              </div>
              <p>
                Target: <strong>{goal.target}</strong>
              </p>
              <p>
                Weightage: <strong>{goal.weight}%</strong>
              </p>
              <p className="muted-text">{goal.managerComment || "Locked and ready for quarterly tracking."}</p>
            </div>
          ))}
        </div>
      </div>

      {lastAction ? (
        <div className="submit-banner">
          {lastAction.goalTitle} was {lastAction.action === "approved" ? "approved and locked" : "sent back for rework"}.
        </div>
      ) : null}
    </section>
  );
}
