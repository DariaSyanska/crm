import { Deal } from "@/types/deal";

type Props = {
  deals: Deal[];
};

export default function RevenueCard({ deals }: Props) {
  const totalRevenue = deals.reduce(
    (sum, deal) => sum + Number(deal.amount),
    0,
  );

  const wonRevenue = deals
    .filter((deal) => deal.stage.toLowerCase() === "won")
    .reduce((sum, deal) => sum + Number(deal.amount), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Revenue Overview
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Pipeline Value
          </p>
          <p className="text-3xl font-bold text-slate-950 dark:text-white">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Won Revenue
          </p>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
            ${wonRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
