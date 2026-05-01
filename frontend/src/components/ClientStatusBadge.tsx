type Props = {
  status: string;
};

export default function ClientStatusBadge({ status }: Props) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "active"
      ? "bg-green-100 text-green-700"
      : normalized === "lead"
      ? "bg-blue-100 text-blue-700"
      : normalized === "inactive"
      ? "bg-slate-100 text-slate-700"
      : "bg-slate-100 text-slate-700";

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}