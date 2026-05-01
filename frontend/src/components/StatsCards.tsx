type Card = {
  label: string;
  value: string | number;
  helper?: string;
};

type Props = {
  items: Card[];
};

export default function StatsCards({ items }: Props) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {item.value}
          </p>
          {item.helper ? (
            <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
