import { Client } from "@/types/client";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";

function formatDate(dateString: string) {
  if (!dateString) return "-";

  const normalized = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T");

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getClient(clientId: number, clients: Client[]) {
  return clients.find((c) => c.id === clientId) || null;
}

function getUser(userId: number | null | undefined, users: User[]) {
  if (!userId) return null;
  return users.find((u) => u.id === userId) || null;
}

type Props = {
  notes: Note[];
  clients: Client[];
  users: User[];
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NoteList({
  notes,
  clients,
  users,
  onEdit,
  onDelete,
}: Props) {
  if (notes.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Client</th>
              <th className="px-6 py-4 text-left font-semibold">User</th>
              <th className="px-6 py-4 text-left font-semibold">Text</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notes.map((note) => {
              const client = getClient(note.client_id, clients);
              const user = getUser(note.user_id, users);

              return (
                <tr
                  key={note.id}
                  className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                >
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {client ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {client.company || "No company"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      `#${note.client_id}`
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {user.name}
                          </p>
                          <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="max-w-[420px] px-6 py-4 text-slate-700 dark:text-slate-300">
                    <div className="line-clamp-2">{note.text}</div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {formatDate(note.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(note)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(note)}
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
