"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

type Props = {
  clientId: number;
  onCreated: () => Promise<void> | void;
};

export default function QuickTaskForm({ clientId, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    setLoading(true);

    try {
      await api.post("/tasks/", {
        title: title.trim(),
        description: description.trim() || null,
        status: "open",
        client_id: clientId,
        due_date: dueDate || null,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      await onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Quick Add Task</h3>
        <p className="mt-1 text-sm text-slate-500">
          Create a task for this client without leaving the page.
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={4}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}