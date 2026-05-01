import Link from "next/link";
import { Client } from "@/types/client";
import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";
import ClientStatusBadge from "@/components/ClientStatusBadge";


function getManager(managerId: number | null | undefined, users: User[]) {
  if (!managerId) return null;
  return users.find((u) => u.id === managerId) || null;
}

type Props = {
  clients: Client[];
  users: User[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

export default function ClientList({ clients, users, onEdit, onDelete }: Props) {
  if (clients.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center text-slate-500">
        No clients yet. Create your first client 🚀
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Name</th>
              <th className="text-left px-6 py-4 font-semibold">Company</th>
              <th className="text-left px-6 py-4 font-semibold">Email</th>
              <th className="text-left px-6 py-4 font-semibold">Phone</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Manager</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const manager = getManager(client.manager_id, users);

              return (
                <tr
                  key={client.id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <Link href={`/clients/${client.id}`} className="flex items-center gap-3 group">
                      <Avatar name={client.name} />
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-600 transition">
                          {client.name}
                        </p>
                        <p className="text-xs text-slate-500">Client #{client.id}</p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-slate-600">{client.company || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{client.email || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{client.phone || "-"}</td>

                  <td className="px-6 py-4">
                    <ClientStatusBadge status={client.status} />
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {manager ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={manager.name} size="sm" />
                        <div>
                          <p className="text-slate-900 font-medium">{manager.name}</p>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(client)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(client)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}