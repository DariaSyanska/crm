"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { Task } from "@/types/task";

type Props = {
  task: Task;
  onUpdated: () => void;
};

const inputClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500";

const selectClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white";

const textareaClassName =
  "min-h-[140px] w-full rounded-2xl border border-slate-300 bg-white p-5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500";

export default function EditTaskForm({ task, onUpdated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);

  const [title, setTitle] = useState(task.title);

  const [description, setDescription] = useState(task.description || "");

  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 16) : "",
  );

  const [status, setStatus] = useState(task.status);

  const [clientId, setClientId] = useState(
    task.client_id ? String(task.client_id) : "",
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients/");

        setClients(response.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(`/tasks/${task.id}`, {
        title,
        description: description || null,
        due_date: dueDate || null,
        status,
        client_id: clientId ? Number(clientId) : null,
      });

      onUpdated();
    } catch (error: any) {
      console.error("Failed to update task:", error);

      alert(error?.response?.data?.detail || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClassName}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className={selectClassName}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>

          <option value="in_progress">In progress</option>

          <option value="done">Done</option>
        </select>

        <select
          className={selectClassName}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">No client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className={inputClassName}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <textarea
          className={`${textareaClassName} md:col-span-2`}
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl bg-blue-600 px-5 py-3
            font-medium text-white shadow
            transition-all duration-200

            hover:scale-[1.02]
            hover:bg-blue-700

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
