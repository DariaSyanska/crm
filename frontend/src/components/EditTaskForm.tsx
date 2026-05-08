"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { Task } from "@/types/task";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
  textareaClassName,
} from "@/components/ui/formStyles";

type Props = {
  task: Task;
  onUpdated: () => void;
};

type Errors = {
  title?: string;
  form?: string;
};

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
  const [errors, setErrors] = useState<Errors>({});

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

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!title.trim()) {
      nextErrors.title = "Task title is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field: keyof Errors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.put(`/tasks/${task.id}`, {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        status,
        client_id: clientId ? Number(clientId) : null,
      });

      setErrors({});
      onUpdated();
    } catch (error: any) {
      console.error("Failed to update task:", error);

      setErrors({
        form: error?.response?.data?.detail || "Failed to update task",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.form ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {errors.form}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" error={errors.title}>
          <input
            className={inputClassName}
            placeholder="Call Anna Novak"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
          />
        </FormField>

        <FormField label="Status">
          <select
            className={selectClassName}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </FormField>

        <FormField label="Client">
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
        </FormField>

        <FormField label="Due date">
          <input
            type="datetime-local"
            className={inputClassName}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Description">
            <textarea
              className={textareaClassName}
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={primaryButtonClassName}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
