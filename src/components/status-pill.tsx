type StatusPillProps = {
  tone: "draft" | "submitted" | "approved" | "rework" | "neutral";
  label: string;
};

export function StatusPill({ tone, label }: StatusPillProps) {
  return <span className={`status-pill status-${tone}`}>{label}</span>;
}
