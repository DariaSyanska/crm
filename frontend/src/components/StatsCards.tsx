type Card = {
  label: string;
  value: string | number;
};

type Props = {
  items: Card[];
};

export default function StatsCards({ items }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}