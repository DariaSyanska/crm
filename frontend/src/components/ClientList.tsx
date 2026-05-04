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

export default function ClientList({
  clients,
  users,
  onEdit,
  onDelete,
}: Props) {
  if (clients.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Company</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Phone</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Manager</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => {
              const manager = getManager(client.manager_id, users);

              return (
                <tr
                  key={client.id}
                  className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/clients/${client.id}`}
                      className="group flex items-center gap-3"
                    >
                      <Avatar name={client.name} />
                      <div>
                        <p className="font-medium text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {client.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Client #{client.id}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {client.company || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {client.email || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {client.phone || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <ClientStatusBadge status={client.status} />
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {manager ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={manager.name} size="sm" />
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {manager.name}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(client)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
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
