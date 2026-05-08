"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import FormField from "@/components/ui/FormField";
import {
  primaryButtonClassName,
  textareaClassName,
} from "@/components/ui/formStyles";

type Props = {
  clientId: number;
  onCreated: () => Promise<void> | void;
};

export default function QuickNoteForm({ clientId, onCreated }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");

    if (!text.trim()) {
      setError("Note cannot be empty");
      return;
    }

    setLoading(true);

    try {
      await api.post("/notes/", {
        text: text.trim(),
        client_id: clientId,
      });

      setText("");

      await onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create note");
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
          Quick Add Note
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add a note for this client without leaving the page.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <FormField label="Note">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (error) {
              setError("");
            }
          }}
          placeholder="Type your note here..."
          className={textareaClassName}
        />
      </FormField>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={primaryButtonClassName}
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
