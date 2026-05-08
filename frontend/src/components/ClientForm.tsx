"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import FormField from "@/components/ui/FormField";
import {
  inputClassName,
  primaryButtonClassName,
  selectClassName,
} from "@/components/ui/formStyles";

type Props = {
  onCreated: () => void;
};

type Errors = {
  name?: string;
  email?: string;
};

export default function ClientForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("new");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/clients/", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        company: company.trim(),
        status,
      });

      setName("");
      setPhone("");
      setEmail("");
      setCompany("");
      setStatus("new");
      setErrors({});

      onCreated();
    } catch (error) {
      console.error(error);
      setErrors({
        name: "Failed to create client. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" error={errors.name}>
          <input
            className={inputClassName}
            placeholder="Anna Novak"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
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
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
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
          {loading ? "Creating..." : "Create Client"}
        </button>
      </div>
    </form>
  );
}
