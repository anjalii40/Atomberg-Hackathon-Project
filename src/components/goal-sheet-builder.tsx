"use client";

import { useMemo, useState } from "react";

import { Goal, GoalUnit } from "@/lib/types";

const goalUnits: GoalUnit[] = ["Numeric", "%", "Timeline", "Zero"];

type GoalFormState = {
  title: string;
  thrustArea: string;
  description: string;
  unit: GoalUnit;
  targetValue: string;
  deadline: string;
  actualCompletionDate: string;
  zeroAchievement: string;
  weight: number;
};

type GoalSheetBuilderProps = {
  initialGoals: Goal[];
};

type ValidationState = {
  totalWeight: number;
  weightTargetMet: boolean;
  minimumWeightMet: boolean;
  goalLimitMet: boolean;
};

const initialFormState: GoalFormState = {
  title: "",
  thrustArea: "",
  description: "",
  unit: "Numeric",
  targetValue: "",
  deadline: "",
  actualCompletionDate: "",
  zeroAchievement: "0",
  weight: 10
};

function getValidationState(goals: Goal[]): ValidationState {
  const totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0);

  return {
    totalWeight,
    weightTargetMet: totalWeight === 100,
    minimumWeightMet: goals.every((goal) => goal.weight >= 10),
    goalLimitMet: goals.length <= 8
  };
}

function buildGoalFromForm(form: GoalFormState, index: number): Goal {
  const target =
    form.unit === "Timeline"
      ? form.deadline
      : form.unit === "Zero"
        ? "0"
        : form.targetValue;

  return {
    id: `goal-${index + 1}`,
    ownerId: "user-employee-1",
    title: form.title.trim(),
    thrustArea: form.thrustArea.trim(),
    description: form.description.trim(),
    unit: form.unit,
    target,
    weight: form.weight,
    state: "Draft",
    shared: false
  };
}

function getTargetLabel(unit: GoalUnit) {
  if (unit === "Timeline") {
    return "Deadline";
  }

  if (unit === "Zero") {
    return "Target";
  }

  return "Target";
}

function getScorePreview(form: GoalFormState) {
  if (form.unit === "Zero") {
    return Number(form.zeroAchievement || 0) === 0
      ? "Score preview: 100% because achievement is 0."
      : "Score preview: 0% because achievement is above 0.";
  }

  if (form.unit === "Timeline") {
    if (!form.deadline || !form.actualCompletionDate) {
      return "Add a deadline and completion date to preview date-based scoring.";
    }

    const deadline = new Date(form.deadline);
    const completion = new Date(form.actualCompletionDate);

    return completion <= deadline
      ? "Score preview: 100% because completion is on or before deadline."
      : "Score preview: 0% because completion is after deadline.";
  }

  return "Score preview appears here for special UoM rules.";
}

export function GoalSheetBuilder({ initialGoals }: GoalSheetBuilderProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [form, setForm] = useState<GoalFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => getValidationState(goals), [goals]);
  const canSubmit =
    goals.length > 0 &&
    validation.weightTargetMet &&
    validation.minimumWeightMet &&
    validation.goalLimitMet &&
    !submitted;

  const canSaveGoal =
    !submitted &&
    form.title.trim().length > 0 &&
    form.thrustArea.trim().length > 0 &&
    (form.unit === "Timeline" ? form.deadline.length > 0 : form.targetValue.length > 0 || form.unit === "Zero");

  function updateForm<K extends keyof GoalFormState>(field: K, value: GoalFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  }

  function saveGoal() {
    if (!canSaveGoal || goals.length >= 8) {
      return;
    }

    setSubmitted(false);
    setGoals((currentGoals) => [...currentGoals, buildGoalFromForm(form, currentGoals.length)]);
    setForm(initialFormState);
  }

  function removeGoal(goalId: string) {
    if (submitted) {
      return;
    }

    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
  }

  function submitGoals() {
    if (!canSubmit) {
      return;
    }

    setGoals((currentGoals) =>
      currentGoals.map((goal) => ({
        ...goal,
        state: "Pending Approval"
      }))
    );
    setSubmitted(true);
  }

  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Employee Flow</span>
          <h2>Goal Sheet</h2>
          <p className="builder-intro">
            Create one goal at a time, review the saved list, and submit the full sheet only when
            the weightage rules are satisfied.
          </p>
        </div>
        <span className={submitted ? "status-pill status-submitted" : "status-pill status-draft"}>
          {submitted ? "Pending Approval" : "Draft Sheet"}
        </span>
      </div>

      <div className="validation-grid">
        <article className={validation.weightTargetMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Total Weight</span>
          <strong>{validation.totalWeight}%</strong>
          <p>Total goal weightage must equal exactly 100% before submission.</p>
        </article>
        <article className={validation.minimumWeightMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Minimum Weight</span>
          <strong>{validation.minimumWeightMet ? "Pass" : "Fail"}</strong>
          <p>Each goal must carry at least 10% weight.</p>
        </article>
        <article className={validation.goalLimitMet ? "validation-card valid" : "validation-card invalid"}>
          <span>Goal Count</span>
          <strong>{goals.length} / 8</strong>
          <p>The sheet can include up to 8 goals.</p>
        </article>
      </div>

      <article className="goal-form-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">Create Goal</span>
            <h2>Add a goal</h2>
          </div>
        </div>

        <div className="goal-editor-grid">
          <label>
            Goal Title
            <input
              disabled={submitted}
              onChange={(event) => updateForm("title", event.target.value)}
              type="text"
              value={form.title}
            />
          </label>
          <label>
            Thrust Area
            <input
              disabled={submitted}
              onChange={(event) => updateForm("thrustArea", event.target.value)}
              type="text"
              value={form.thrustArea}
            />
          </label>
          <label>
            Unit of Measure
            <select
              disabled={submitted}
              onChange={(event) => updateForm("unit", event.target.value as GoalUnit)}
              value={form.unit}
            >
              {goalUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          {form.unit === "Timeline" ? (
            <label>
              Deadline
              <input
                disabled={submitted}
                onChange={(event) => updateForm("deadline", event.target.value)}
                type="date"
                value={form.deadline}
              />
            </label>
          ) : null}
          {form.unit === "Timeline" ? (
            <label>
              Actual Completion Date
              <input
                disabled={submitted}
                onChange={(event) => updateForm("actualCompletionDate", event.target.value)}
                type="date"
                value={form.actualCompletionDate}
              />
            </label>
          ) : null}
          {form.unit === "Zero" ? (
            <label>
              Actual Achievement
              <input
                disabled={submitted}
                onChange={(event) => updateForm("zeroAchievement", event.target.value)}
                type="number"
                value={form.zeroAchievement}
              />
            </label>
          ) : null}
          {form.unit !== "Timeline" && form.unit !== "Zero" ? (
            <label>
              {getTargetLabel(form.unit)}
              <input
                disabled={submitted}
                onChange={(event) => updateForm("targetValue", event.target.value)}
                type="text"
                value={form.targetValue}
              />
            </label>
          ) : null}
          <label>
            Weightage (%)
            <input
              disabled={submitted}
              min={10}
              onChange={(event) => updateForm("weight", Number(event.target.value))}
              type="number"
              value={form.weight}
            />
          </label>
        </div>

        <label className="goal-description">
          Description
          <textarea
            disabled={submitted}
            onChange={(event) => updateForm("description", event.target.value)}
            rows={3}
            value={form.description}
          />
        </label>

        <div className="score-preview-card">
          <strong>UoM preview</strong>
          <p className="muted-text">{getScorePreview(form)}</p>
        </div>

        <div className="builder-footer">
          <div>
            <strong>{submitted ? "Goal sheet locked for manager review." : "Save goals before submitting."}</strong>
            <p className="muted-text">
              After submission, the sheet becomes pending approval and further edits are blocked.
            </p>
          </div>
          <button className="secondary-button" disabled={!canSaveGoal} onClick={saveGoal} type="button">
            Save Goal
          </button>
        </div>
      </article>

      <article className="goal-list-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">Saved Goals</span>
            <h2>{goals.length === 0 ? "Empty goal sheet" : "Current goals"}</h2>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="empty-goal-sheet">
            <strong>No goals added yet.</strong>
            <p className="muted-text">
              Start with one goal. The submit button stays disabled until the sheet is valid.
            </p>
          </div>
        ) : (
          <div className="builder-list">
            {goals.map((goal) => (
              <article className="goal-editor compact-goal-card" key={goal.id}>
                <div className="goal-editor-header">
                  <div>
                    <strong>{goal.title}</strong>
                    <p className="muted-text">{goal.thrustArea}</p>
                  </div>
                  <span className={goal.state === "Pending Approval" ? "status-pill status-submitted" : "status-pill status-draft"}>
                    {goal.state}
                  </span>
                </div>
                <div className="saved-goal-grid">
                  <p>UoM: <strong>{goal.unit}</strong></p>
                  <p>Target: <strong>{goal.target}</strong></p>
                  <p>Weight: <strong>{goal.weight}%</strong></p>
                </div>
                <p className="muted-text">{goal.description || "No description added."}</p>
                {!submitted ? (
                  <button className="text-button" onClick={() => removeGoal(goal.id)} type="button">
                    Remove
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </article>

      <div className="builder-footer">
        <div>
          <strong>
            {canSubmit
              ? "Goal sheet is ready for manager review."
              : "Submit stays disabled until goals are added and validations pass."}
          </strong>
          <p className="muted-text">
            Expected post-submit status: Pending Approval. Edits are blocked after submission.
          </p>
        </div>
        <button className="primary-button" disabled={!canSubmit} onClick={submitGoals} type="button">
          Submit to Manager
        </button>
      </div>
    </section>
  );
}
