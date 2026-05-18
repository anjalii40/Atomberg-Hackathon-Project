"use client";

import { useState } from "react";

import { CheckIn, CheckInStatus, Role } from "@/lib/types";

const statuses: CheckInStatus[] = ["Not Started", "On Track", "Completed"];

type QuarterlyCheckinTrackerProps = {
  initialCheckIns: CheckIn[];
  mode: Extract<Role, "employee" | "manager">;
};

export function QuarterlyCheckinTracker({
  initialCheckIns,
  mode
}: QuarterlyCheckinTrackerProps) {
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const [banner, setBanner] = useState<string | null>(null);

  function updateCheckIn(
    checkInId: string,
    field: "planned" | "actual" | "status" | "comment" | "managerComment",
    value: string
  ) {
    setBanner(null);
    setCheckIns((currentCheckIns) =>
      currentCheckIns.map((checkIn) =>
        checkIn.id === checkInId
          ? {
              ...checkIn,
              [field]: value
            }
          : checkIn
      )
    );
  }

  function saveCheckIns() {
    setBanner(
      mode === "employee"
        ? "Quarterly achievement updates are ready for manager review."
        : "Manager check-in comments have been recorded for the team."
    );
  }

  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Phase 4</span>
          <h2>{mode === "employee" ? "Quarterly Achievement Updates" : "Manager Check-in Review"}</h2>
          <p className="builder-intro">
            {mode === "employee"
              ? "Capture planned vs actual achievement against approved goals and mark current progress."
              : "Compare employee plans vs actuals and log structured manager feedback for each check-in."}
          </p>
        </div>
      </div>

      <div className="builder-list">
        {checkIns.map((checkIn) => (
          <article className="goal-editor" key={checkIn.id}>
            <div className="goal-editor-header">
              <div>
                <span className="goal-number">{checkIn.period}</span>
                <strong>Goal-linked quarterly update</strong>
              </div>
              <span className="status-pill status-neutral">{checkIn.status}</span>
            </div>

            <div className="goal-editor-grid">
              <label>
                Planned Achievement
                <input
                  onChange={(event) => updateCheckIn(checkIn.id, "planned", event.target.value)}
                  type="text"
                  value={checkIn.planned}
                />
              </label>
              <label>
                Actual Achievement
                <input
                  onChange={(event) => updateCheckIn(checkIn.id, "actual", event.target.value)}
                  type="text"
                  value={checkIn.actual}
                />
              </label>
              <label>
                Progress Status
                <select
                  onChange={(event) => updateCheckIn(checkIn.id, "status", event.target.value)}
                  value={checkIn.status}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="goal-description">
              {mode === "employee" ? "Employee Update Note" : "Employee Context"}
              <textarea
                onChange={(event) => updateCheckIn(checkIn.id, "comment", event.target.value)}
                rows={3}
                value={checkIn.comment}
              />
            </label>

            {mode === "manager" ? (
              <label className="goal-description">
                Manager Check-in Comment
                <textarea
                  onChange={(event) => updateCheckIn(checkIn.id, "managerComment", event.target.value)}
                  placeholder="Document the review conversation and next action."
                  rows={3}
                  value={checkIn.managerComment ?? ""}
                />
              </label>
            ) : null}
          </article>
        ))}
      </div>

      <div className="builder-footer">
        <div>
          <strong>
            {mode === "employee"
              ? "Keep each quarterly update ready for review."
              : "Capture a structured comment for each discussed check-in."}
          </strong>
          <p className="muted-text">
            {mode === "employee"
              ? "This phase prepares planned vs actual progress for the manager discussion."
              : "Manager notes are retained as part of the review trail for the cycle."}
          </p>
        </div>
        <button className="primary-button" onClick={saveCheckIns} type="button">
          {mode === "employee" ? "Save Quarterly Update" : "Save Manager Review"}
        </button>
      </div>

      {banner ? <div className="submit-banner">{banner}</div> : null}
    </section>
  );
}
