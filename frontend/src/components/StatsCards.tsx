type StatItem = {
  label: string;
  value: string | number;
  helper?: string;
};

type Props = {
  items: StatItem[];
};

export default function StatsCards({ items }: Props) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {item.label}
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
            {item.value}
          </p>

          {item.helper && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {item.helper}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
