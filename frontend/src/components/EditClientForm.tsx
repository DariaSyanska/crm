"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
} from "@/components/ui/formStyles";

type Props = {
  client: Client;
  onUpdated: () => void;
};

type Errors = {
  name?: string;
  email?: string;
  form?: string;
};

export default function EditClientForm({ client, onUpdated }: Props) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone || "");
  const [email, setEmail] = useState(client.email || "");
  const [company, setCompany] = useState(client.company || "");
  const [status, setStatus] = useState(client.status);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!name.trim()) {
      nextErrors.name = "Client name is required";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
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
      await api.put(`/clients/${client.id}`, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        company: company.trim(),
        status,
      });

      setErrors({});
      onUpdated();
    } catch (error: any) {
      console.error("Failed to update client:", error);

      setErrors({
        form: error?.response?.data?.detail || "Failed to update client",
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
        <FormField label="Name" error={errors.name}>
          <input
            className={inputClassName}
            placeholder="Anna Novak"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
          />
        </FormField>

        <FormField label="Phone">
          <input
            className={inputClassName}
            placeholder="+420777123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input
            className={inputClassName}
            placeholder="anna@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
          />
        </FormField>

        <FormField label="Company">
          <input
            className={inputClassName}
            placeholder="Novak Marketing"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Status">
            <select
              className={selectClassName}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
