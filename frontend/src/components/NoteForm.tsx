"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import FormField from "@/components/ui/FormField";
import {
  primaryButtonClassName,
  selectClassName,
  textareaClassName,
} from "@/components/ui/formStyles";

type Props = {
  onCreated: () => void;
};

type Errors = {
  clientId?: string;
  text?: string;
  form?: string;
};

export default function NoteForm({ onCreated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [text, setText] = useState("");
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

    if (!clientId) {
      nextErrors.clientId = "Client is required";
    }

    if (!text.trim()) {
      nextErrors.text = "Note text is required";
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
      await api.post("/notes/", {
        client_id: Number(clientId),
        text: text.trim(),
      });

      setClientId("");
      setText("");
      setErrors({});

      onCreated();
    } catch (error: any) {
      console.error("Failed to create note:", error);

      setErrors({
        form: error?.response?.data?.detail || "Failed to create note",
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

      <div className="grid gap-4">
        <FormField label="Client" error={errors.clientId}>
          <select
            className={selectClassName}
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              clearError("clientId");
            }}
          >
            <option value="">Select client</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.company || "No company"})
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Note text" error={errors.text}>
          <textarea
            className={textareaClassName}
            placeholder="Write note text..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              clearError("text");
            }}
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={primaryButtonClassName}
        >
          {loading ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  );
}
