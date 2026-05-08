"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
  textareaClassName,
} from "@/components/ui/formStyles";

type Props = {
  onCreated: () => void;
};

type Errors = {
  title?: string;
  form?: string;
};

export default function TaskForm({ onCreated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("open");
  const [clientId, setClientId] = useState("");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/tasks/", {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        status,
        client_id: clientId ? Number(clientId) : null,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("open");
      setClientId("");
      setErrors({});

      onCreated();
    } catch (error: any) {
      console.error("Failed to create task:", error);

      setErrors({
        form: error?.response?.data?.detail || "Failed to create task",
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
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: "" }));
              }
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
          {loading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
}
