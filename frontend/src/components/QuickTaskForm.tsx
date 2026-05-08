"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  textareaClassName,
} from "@/components/ui/formStyles";

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
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Quick Add Task
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create a task for this client without leaving the page.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <FormField label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="Call Anna Novak"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className={textareaClassName}
          />
        </FormField>

        <FormField label="Due date">
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClassName}
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={primaryButtonClassName}
        >
          {loading ? "Saving..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
