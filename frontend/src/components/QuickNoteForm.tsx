"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

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

      setError("");

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
      className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Quick Add Note</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add a note for this client without leaving the page.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your note here..."
        rows={5}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
      />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}