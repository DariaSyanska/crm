import { Deal } from "@/types/deal";

function getStageClasses(stage: string) {
  switch (stage.toLowerCase()) {
    case "lead":
      return "bg-yellow-100 text-yellow-700";
    case "contacted":
      return "bg-blue-100 text-blue-700";
    case "negotiation":
      return "bg-purple-100 text-purple-700";
    case "won":
      return "bg-green-100 text-green-700";
    case "lost":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DealList({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center text-slate-500">
        No deals yet. Create your first deal 💼
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Title</th>
              <th className="text-left px-6 py-4 font-semibold">Client ID</th>
              <th className="text-left px-6 py-4 font-semibold">Amount</th>
              <th className="text-left px-6 py-4 font-semibold">Stage</th>
              <th className="text-left px-6 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className="border-t border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-900">{deal.title}</td>
                <td className="px-6 py-4 text-slate-600">{deal.client_id}</td>
                <td className="px-6 py-4 text-slate-600">
                  ${Number(deal.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStageClasses(
                      deal.stage
                    )}`}
                  >
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(deal.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}