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

  if (isNaN(date.getTime())) return "-";

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

export default function NoteList({ notes, clients, users, onEdit, onDelete }: Props) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center text-slate-500">
        No notes yet. Create your first note 📝
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Client</th>
              <th className="text-left px-6 py-4 font-semibold">User</th>
              <th className="text-left px-6 py-4 font-semibold">Text</th>
              <th className="text-left px-6 py-4 font-semibold">Created</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => {
              const client = getClient(note.client_id, clients);
              const user = getUser(note.user_id, users);

              return (
                <tr
                  key={note.id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-slate-600">
                    {client ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="sm" />
                        <div>
                          <p className="text-slate-900 font-medium">{client.name}</p>
                          <p className="text-xs text-slate-500">{client.company || "No company"}</p>
                        </div>
                      </div>
                    ) : (
                      `#${note.client_id}`
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="text-slate-900 font-medium">{user.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-700 max-w-[420px]">
                    <div className="line-clamp-2">{note.text}</div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(note.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(note)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(note)}
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