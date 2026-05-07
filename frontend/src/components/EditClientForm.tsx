"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";

type Props = {
  client: Client;
  onUpdated: () => void;
};

const inputClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500";

const selectClassName =
  "h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white";

export default function EditClientForm({ client, onUpdated }: Props) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone || "");
  const [email, setEmail] = useState(client.email || "");
  const [company, setCompany] = useState(client.company || "");
  const [status, setStatus] = useState(client.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(`/clients/${client.id}`, {
        name,
        phone,
        email,
        company,
        status,
      });

      onUpdated();
    } catch (error: any) {
      console.error("Failed to update client:", error);

      alert(error?.response?.data?.detail || "Failed to update client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClassName}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className={inputClassName}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className={inputClassName}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={inputClassName}
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <select
          className={`${selectClassName} md:col-span-2`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="new">New</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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

            hover:scale-[1.02]
            hover:bg-blue-700

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
