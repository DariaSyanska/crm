import { Client } from "@/types/client";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";

function getTaskStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "done":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getClient(clientId: number | null | undefined, clients: Client[]) {
  if (!clientId) return null;
  return clients.find((c) => c.id === clientId) || null;
}

function getUser(userId: number | null | undefined, users: User[]) {
  if (!userId) return null;
  return users.find((u) => u.id === userId) || null;
}

type Props = {
  tasks: Task[];
  clients: Client[];
  users: User[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function TaskList({ tasks, clients, users, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center text-slate-500">
        No tasks yet. Create your first task ✅
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
              <th className="text-left px-6 py-4 font-semibold">Description</th>
              <th className="text-left px-6 py-4 font-semibold">Client</th>
              <th className="text-left px-6 py-4 font-semibold">Assigned User</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Due Date</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const client = getClient(task.client_id, clients);
              const user = getUser(task.user_id, users);

              return (
                <tr
                  key={task.id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">Task #{task.id}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">{task.description || "-"}</td>

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
                      "-"
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

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusClasses(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(task)}
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