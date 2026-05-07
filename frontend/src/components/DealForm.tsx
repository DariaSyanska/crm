"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";

type Props = {
  onCreated: () => void;
};

const inputClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500";

const selectClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white";

export default function DealForm({ onCreated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState("lead");
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
      await api.post("/deals/", {
        client_id: Number(clientId),
        title,
        amount: Number(amount),
        stage,
      });

      setClientId("");
      setTitle("");
      setAmount("");
      setStage("lead");

      onCreated();
    } catch (error: any) {
      console.error("Failed to create deal:", error);
      alert(error?.response?.data?.detail || "Failed to create deal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <select
          className={selectClassName}
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

        <input
          className={inputClassName}
          placeholder="Deal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          className={inputClassName}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          className={selectClassName}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="lead">Lead</option>
          <option value="contacted">Contacted</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="
          rounded-xl bg-blue-600 px-5 py-3
          font-medium text-white shadow
          transition-all duration-200

          hover:bg-blue-700
          hover:scale-[1.02]

          disabled:cursor-not-allowed
          disabled:opacity-60
          "
        >
          {loading ? "Creating..." : "Create Deal"}
        </button>
      </div>
    </form>
  );
}
