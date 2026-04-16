"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";

type Props = {
  onCreated: () => void;
};

export default function NoteForm({ onCreated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [text, setText] = useState("");
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
      await api.post("/notes/", {
        client_id: Number(clientId),
        text,
      });

      setClientId("");
      setText("");
      onCreated();
    } catch (error: any) {
      console.error("Failed to create note:", error);
      alert(error?.response?.data?.detail || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <select
          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.company || "No company"})
            </option>
          ))}
        </select>

        <textarea
          className="w-full border border-slate-300 rounded-xl px-4 py-3 min-h-[160px] outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write note text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow font-medium"
        >
          {loading ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  );
}