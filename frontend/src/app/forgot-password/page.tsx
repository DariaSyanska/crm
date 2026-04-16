"use client";

import { FormEvent, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        new_password: newPassword,
      });

      setMessage("Password successfully updated. You can now sign in.");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error");
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

        {error && <p className="text-red-400 mb-2">{error}</p>}
        {message && <p className="text-green-400 mb-2">{message}</p>}

        <button className="w-full bg-blue-600 rounded-xl py-3 font-semibold">
          Reset password
        </button>
      </form>
    </main>
  );
}