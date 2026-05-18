"use client";

import { useMemo, useState } from "react";

import { Goal, GoalUnit } from "@/lib/types";

const goalUnits: GoalUnit[] = ["Numeric", "%", "Timeline", "Zero"];

type GoalSheetBuilderProps = {
  initialGoals: Goal[];
};

type ValidationState = {
  totalWeight: number;
  weightTargetMet: boolean;
  minimumWeightMet: boolean;
  goalLimitMet: boolean;
};

function createDraftGoal(index: number): Goal {
  return {
    id: `draft-goal-${index + 1}`,
    ownerId: "user-employee-1",
    title: "",
    thrustArea: "",
    description: "",
    unit: "Numeric",
    target: "",
    weight: 10,
    state: "Draft",
    shared: false
  };
}

function getValidationState(goals: Goal[]): ValidationState {
  const totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0);

  return {
    totalWeight,
    weightTargetMet: totalWeight === 100,
    minimumWeightMet: goals.every((goal) => goal.weight >= 10),
    goalLimitMet: goals.length <= 8
  };
}

export function GoalSheetBuilder({ initialGoals }: GoalSheetBuilderProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => getValidationState(goals), [goals]);
  const canSubmit =
    validation.weightTargetMet && validation.minimumWeightMet && validation.goalLimitMet;

  function updateGoal(goalId: string, field: keyof Goal, value: string | number | boolean) {
    setSubmitted(false);
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              [field]: value
            }
          : goal
      )
    );
  }

  function addGoal() {
    setSubmitted(false);
    setGoals((currentGoals) => {
      if (currentGoals.length >= 8) {
        return currentGoals;
      }

      return [...currentGoals, createDraftGoal(currentGoals.length)];
    });
  }

  function removeGoal(goalId: string) {
    setSubmitted(false);
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
  }

  function submitGoals() {
    if (!canSubmit) {
      return;
    }

    setGoals((currentGoals) =>
      currentGoals.map((goal) => ({
        ...goal,
        state: goal.state === "Draft" ? "Submitted" : goal.state
      }))
    );
    setSubmitted(true);
  }

  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Phase 2</span>
          <h2>Goal Sheet Builder</h2>
          <p className="builder-intro">
            Create, refine, and validate goals before they move into the manager approval flow.
          </p>
        </div>
        <button className="secondary-button" onClick={addGoal} type="button">
          Add Goal
        </button>
      </div>

      <div className="validation-grid">
        <article className={validation.weightTargetMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Total Weight</span>
          <strong>{validation.totalWeight}%</strong>
          <p>Total goal weightage must equal exactly 100%.</p>
        </article>
        <article className={validation.minimumWeightMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Minimum Weight</span>
          <strong>{validation.minimumWeightMet ? "Pass" : "Fail"}</strong>
          <p>Each goal must carry at least 10% weight.</p>
        </article>
        <article className={validation.goalLimitMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Goal Count</span>
          <strong>{goals.length} / 8</strong>
          <p>An employee cannot exceed 8 goals in a sheet.</p>
        </article>
      </div>

      <div className="builder-list">
        {goals.map((goal, index) => (
          <article className="goal-editor" key={goal.id}>
            <div className="goal-editor-header">
              <div>
                <span className="goal-number">Goal {index + 1}</span>
                <strong>{goal.title || "Untitled goal"}</strong>
              </div>
              <button className="text-button" onClick={() => removeGoal(goal.id)} type="button">
                Remove
              </button>
            </div>

            <div className="goal-editor-grid">
              <label>
                Goal Title
                <input
                  onChange={(event) => updateGoal(goal.id, "title", event.target.value)}
                  type="text"
                  value={goal.title}
                />
              </label>
              <label>
                Thrust Area
                <input
                  onChange={(event) => updateGoal(goal.id, "thrustArea", event.target.value)}
                  type="text"
                  value={goal.thrustArea}
                />
              </label>
              <label>
                Unit of Measure
                <select
                  onChange={(event) => updateGoal(goal.id, "unit", event.target.value as GoalUnit)}
                  value={goal.unit}
                >
                  {goalUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
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
                  min={0}
                  onChange={(event) => updateGoal(goal.id, "weight", Number(event.target.value))}
                  type="number"
                  value={goal.weight}
                />
              </label>
              <label className="checkbox-row">
                <input
                  checked={goal.shared}
                  onChange={(event) => updateGoal(goal.id, "shared", event.target.checked)}
                  type="checkbox"
                />
                Shared goal
              </label>
            </div>

            <label className="goal-description">
              Description
              <textarea
                onChange={(event) => updateGoal(goal.id, "description", event.target.value)}
                rows={3}
                value={goal.description}
              />
            </label>
          </article>
        ))}
      </div>

      <div className="builder-footer">
        <div>
          <strong>{canSubmit ? "Goal sheet is valid." : "Fix validation issues before submitting."}</strong>
          <p className="muted-text">
            Once submitted, draft goals move into the manager approval queue.
          </p>
        </div>
        <button className="primary-button" disabled={!canSubmit} onClick={submitGoals} type="button">
          Submit Goal Sheet
        </button>
      </div>

      {submitted ? (
        <div className="submit-banner">
          Goal sheet submitted successfully. Manager review can now begin.
        </div>
      ) : null}
    </section>
  );
}
