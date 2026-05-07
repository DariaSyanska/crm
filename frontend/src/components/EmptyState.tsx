import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: string;
};

export default function EmptyState({
  title,
  description,
  action,
  icon = "✦",
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-12 text-center shadow-sm transition-all dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%)]" />

      <div className="relative">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white text-4xl shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {icon}
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          {description}
        </p>

        {action ? (
          <div className="mt-8 flex justify-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
