type Props = {
  name: string;
  size?: "sm" | "md";
};

export default function Avatar({ name, size = "md" }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const sizeClasses =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sizeClasses} rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold shrink-0`}
    >
      {initials || "?"}
    </div>
  );
}