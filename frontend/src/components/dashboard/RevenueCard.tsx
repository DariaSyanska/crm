import { Deal } from "@/types/deal";

type Props = {
  deals: Deal[];
};

export default function RevenueCard({ deals }: Props) {
  const totalRevenue = deals.reduce((sum, deal) => sum + Number(deal.amount), 0);

  const wonRevenue = deals
    .filter((deal) => deal.stage.toLowerCase() === "won")
    .reduce((sum, deal) => sum + Number(deal.amount), 0);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Overview</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-slate-900">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Won Revenue</p>
          <p className="text-2xl font-semibold text-green-600">
            ${wonRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}