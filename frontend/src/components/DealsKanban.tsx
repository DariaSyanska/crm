import Link from "next/link";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";

const stages = ["lead", "contacted", "negotiation", "won", "lost"];

function getStageBadgeClasses(stage: string) {
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

function formatStage(stage: string) {
  switch (stage) {
    case "lead":
      return "Lead";
    case "contacted":
      return "Contacted";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return stage;
  }
}

function getClientName(clientId: number, clients: Client[]) {
  const client = clients.find((c) => c.id === clientId);
  return client ? `${client.name} (${client.company || "No company"})` : `#${clientId}`;
}

type Props = {
  deals: Deal[];
  clients: Client[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
};

export default function DealsKanban({ deals, clients, onEdit, onDelete }: Props) {
  if (deals.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center text-slate-500">
        No deals yet. Create your first deal 💼
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5 md:grid-cols-2">
      {stages.map((stage) => {
        const stageDeals = deals.filter(
          (deal) => deal.stage.toLowerCase() === stage
        );

        return (
          <div
            key={stage}
            className="rounded-2xl bg-slate-100 border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{formatStage(stage)}</h3>
              <span className="text-xs bg-white border border-slate-200 rounded-full px-2 py-1 text-slate-600">
                {stageDeals.length}
              </span>
            </div>

            <div className="space-y-3">
              {stageDeals.length === 0 ? (
                <div className="rounded-xl bg-white border border-dashed border-slate-300 p-4 text-sm text-slate-400 text-center">
                  No deals
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-xl bg-white border border-slate-200 shadow-sm p-4 hover:shadow-md transition"
                  >
                    <Link href={`/deals/${deal.id}`} className="block">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 hover:text-blue-600 transition">
                            {deal.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {getClientName(deal.client_id, clients)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStageBadgeClasses(
                            deal.stage
                          )}`}
                        >
                          {formatStage(deal.stage)}
                        </span>
                      </div>

                      <div className="mt-4 text-sm text-slate-700 space-y-1">
                        <p>
                          <span className="font-medium">Amount:</span>{" "}
                          ${Number(deal.amount).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(deal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onEdit(deal)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(deal)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}