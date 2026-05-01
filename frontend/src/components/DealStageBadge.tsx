type Props = {
  stage: string;
};

export default function DealStageBadge({ stage }: Props) {
  const normalized = stage.toLowerCase();

  const styles =
    normalized === "won"
      ? "bg-green-100 text-green-700"
      : normalized === "lead"
      ? "bg-blue-100 text-blue-700"
      : normalized === "negotiation"
      ? "bg-orange-100 text-orange-700"
      : normalized === "lost"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  const label = stage.charAt(0).toUpperCase() + stage.slice(1);

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}