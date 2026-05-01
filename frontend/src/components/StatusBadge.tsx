type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "done"
      ? "bg-green-100 text-green-700"
      : normalized === "in_progress" || normalized === "in progress"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  const label =
    normalized === "in_progress" ? "In Progress" : status.replace("_", " ");

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}