import { Client } from "@/types/client";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/StatusBadge";

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
  onComplete: (taskId: number) => void;
};

export default function TaskList({
  tasks,
  clients,
  users,
  onEdit,
  onDelete,
  onComplete,
}: Props) {
  if (tasks.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Client</th>
              <th className="px-6 py-4 text-left font-semibold">
                Assigned User
              </th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => {
              const client = getClient(task.client_id, clients);
              const user = getUser(task.user_id, users);
              const isOverdue =
                task.due_date &&
                new Date(task.due_date) < new Date() &&
                task.status.toLowerCase() !== "done";

              return (
                <tr
                  key={task.id}
                  className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Task #{task.id}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {task.description || "-"}
                  </td>

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
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.name}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-6 py-4">
                    {task.due_date ? (
                      <span
                        className={
                          isOverdue
                            ? "font-medium text-red-600 dark:text-red-400"
                            : "text-slate-700 dark:text-slate-300"
                        }
                      >
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300">
                        -
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {task.status.toLowerCase() !== "done" && (
                        <button
                          type="button"
                          onClick={() => onComplete(task.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(task)}
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
