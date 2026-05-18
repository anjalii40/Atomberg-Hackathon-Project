"use client";

import { useMemo, useState } from "react";

import { AuditEvent, ReportRow, UnlockRequest } from "@/lib/types";

type AdminGovernanceConsoleProps = {
  initialUnlockRequests: UnlockRequest[];
  auditEvents: AuditEvent[];
  reportRows: ReportRow[];
};

type RequestAction = "Approved" | "Declined";

function toCsv(rows: ReportRow[]) {
  const header = ["Employee", "Goal", "Target", "Actual", "Status"];
  const body = rows.map((row) => [
    row.employeeName,
    row.goalTitle,
    row.target,
    row.actual,
    row.status
  ]);

  return [header, ...body]
    .map((line) => line.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function AdminGovernanceConsole({
  initialUnlockRequests,
  auditEvents,
  reportRows
}: AdminGovernanceConsoleProps) {
  const [unlockRequests, setUnlockRequests] = useState(initialUnlockRequests);
  const [banner, setBanner] = useState<string | null>(null);

  const pendingRequests = useMemo(
    () => unlockRequests.filter((request) => request.status === "Pending"),
    [unlockRequests]
  );

  function updateRequest(requestId: string, status: RequestAction) {
    setUnlockRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status
            }
          : request
      )
    );

    const request = unlockRequests.find((item) => item.id === requestId);
    if (request) {
      setBanner(`${request.employeeName}'s unlock request was ${status.toLowerCase()}.`);
    }
  }

  function exportReport() {
    const csv = toCsv(reportRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "achievement-report.csv";
    link.click();
    URL.revokeObjectURL(url);

    setBanner("Achievement report exported as CSV.");
  }

  return (
    <section className="builder-shell">
      <div className="builder-topbar">
        <div>
          <span className="section-label">Phase 5</span>
          <h2>Admin Governance Console</h2>
          <p className="builder-intro">
            Manage unlock exceptions, monitor cycle health, review audit history, and export
            achievement reporting.
          </p>
        </div>
        <button className="primary-button" onClick={exportReport} type="button">
          Export Achievement Report
        </button>
      </div>

      <div className="validation-grid">
        <article className="validation-card valid">
          <span>Pending Unlock Requests</span>
          <strong>{pendingRequests.length}</strong>
          <p>Admin review required before any locked goal can be changed.</p>
        </article>
        <article className="validation-card valid">
          <span>Audit Events Logged</span>
          <strong>{auditEvents.length}</strong>
          <p>Every workflow action remains visible for governance tracking.</p>
        </article>
        <article className="validation-card valid">
          <span>Report Rows</span>
          <strong>{reportRows.length}</strong>
          <p>Planned vs actual rows are ready for evaluator-facing exports.</p>
        </article>
      </div>

      <div className="content-grid admin-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">Unlock Control</span>
              <h2>Exception Requests</h2>
            </div>
          </div>
          <div className="stack-list">
            {unlockRequests.map((request) => (
              <div className="stack-card" key={request.id}>
                <div className="stack-card-top">
                  <strong>{request.employeeName}</strong>
                  <span
                    className={
                      request.status === "Pending"
                        ? "status-pill status-submitted"
                        : request.status === "Approved"
                          ? "status-pill status-approved"
                          : "status-pill status-rework"
                    }
                  >
                    {request.status}
                  </span>
                </div>
                <p className="muted-text">{request.reason}</p>
                <p>
                  Requested at <strong>{request.requestedAt}</strong>
                </p>
                {request.status === "Pending" ? (
                  <div className="button-row button-row-top">
                    <button
                      className="secondary-button"
                      onClick={() => updateRequest(request.id, "Declined")}
                      type="button"
                    >
                      Decline
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => updateRequest(request.id, "Approved")}
                      type="button"
                    >
                      Approve Unlock
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">Cycle Health</span>
              <h2>Quarter Windows</h2>
            </div>
          </div>
          <div className="stack-list">
            <div className="stack-card">
              <div className="stack-card-top">
                <strong>Phase 1 Goal Setting</strong>
                <span className="status-pill status-approved">Open</span>
              </div>
              <p>Window start: 1 May</p>
              <p className="muted-text">Creation, submission, and approval are enabled.</p>
            </div>
            <div className="stack-card">
              <div className="stack-card-top">
                <strong>Q1 Check-in</strong>
                <span className="status-pill status-neutral">Upcoming</span>
              </div>
              <p>Window start: July</p>
              <p className="muted-text">Employees will capture planned vs actual progress.</p>
            </div>
            <div className="stack-card">
              <div className="stack-card-top">
                <strong>Q4 / Annual</strong>
                <span className="status-pill status-neutral">Scheduled</span>
              </div>
              <p>Window start: March / April</p>
              <p className="muted-text">Final achievement capture and completion oversight.</p>
            </div>
          </div>
        </article>
      </div>

      <article className="panel panel-wide report-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">Reporting</span>
            <h2>Planned vs Actual</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={`${row.employeeName}-${row.goalTitle}`}>
                  <td>{row.employeeName}</td>
                  <td>{row.goalTitle}</td>
                  <td>{row.target}</td>
                  <td>{row.actual}</td>
                  <td>
                    <span className="status-pill status-neutral">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel panel-wide">
        <div className="panel-heading">
          <div>
            <span className="section-label">Audit Trail</span>
            <h2>Recent Governance Events</h2>
          </div>
        </div>
        <div className="timeline">
          {auditEvents.map((event) => (
            <div className="timeline-item" key={event.id}>
              <span className="timeline-time">{event.timestamp}</span>
              <div>
                <strong>{event.actor}</strong>
                <p>
                  {event.action} on <span>{event.target}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>

      {banner ? <div className="submit-banner">{banner}</div> : null}
    </section>
  );
}
