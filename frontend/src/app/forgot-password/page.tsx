"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import Toast from "@/components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        new_password: newPassword,
      });

      showToast("Password updated successfully", "success");
      setEmail("");
      setNewPassword("");
    } catch (err: any) {
      showToast(err?.response?.data?.detail || "Failed to reset password", "error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
      >
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 rounded-xl px-4 py-3 bg-slate-900 border border-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 rounded-xl px-4 py-3 bg-slate-900 border border-white/10"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 rounded-xl py-3 font-semibold">
          Reset password
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}