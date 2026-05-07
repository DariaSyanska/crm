"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

type Props = {
  clientId: number;
  onCreated: () => Promise<void> | void;
};

const textareaClassName =
  "min-h-[160px] w-full rounded-2xl border border-slate-300 bg-white p-5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500";

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
      className="
        rounded-3xl border border-slate-200
        bg-white p-6 shadow-sm

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Quick Add Note
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add a note for this client without leaving the page.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your note here..."
        className={textareaClassName}
      />

      {error && (
        <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
      )}

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
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
