"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
} from "@/components/ui/formStyles";

type Props = {
  deal: Deal;
  onUpdated: () => void;
};

type Errors = {
  clientId?: string;
  title?: string;
  amount?: string;
  form?: string;
};

export default function EditDealForm({ deal, onUpdated }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(String(deal.client_id));
  const [title, setTitle] = useState(deal.title);
  const [amount, setAmount] = useState(String(deal.amount));
  const [stage, setStage] = useState(deal.stage);
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

    if (!title.trim()) {
      nextErrors.title = "Deal title is required";
    }

    if (!amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0 || Number.isNaN(Number(amount))) {
      nextErrors.amount = "Amount must be greater than 0";
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
      await api.put(`/deals/${deal.id}`, {
        client_id: Number(clientId),
        title: title.trim(),
        amount: Number(amount),
        stage,
      });

      setErrors({});
      onUpdated();
    } catch (error: any) {
      console.error("Failed to update deal:", error);

      setErrors({
        form: error?.response?.data?.detail || "Failed to update deal",
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

        <FormField label="Deal title" error={errors.title}>
          <input
            className={inputClassName}
            placeholder="Website redesign"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
          />
        </FormField>

        <FormField label="Amount" error={errors.amount}>
          <input
            type="number"
            min="0"
            step="1"
            className={inputClassName}
            placeholder="2500"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearError("amount");
            }}
          />
        </FormField>

        <FormField label="Stage">
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
        </FormField>
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
