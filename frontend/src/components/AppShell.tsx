"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

type Me = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/deals", label: "Deals" },
  { href: "/tasks", label: "Tasks" },
  { href: "/notes", label: "Notes" },
];

export default function AppShell({ title, subtitle, children }: Props) {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/auth/me");
        setMe(response.data);
      } catch {
        setMe(null);
      }
    };

    fetchMe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/dashboard"
              className="text-2xl font-bold tracking-tight text-slate-900 transition-colors dark:text-white"
            >
              CRM
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sales workspace
            </p>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu name={me?.name} email={me?.email} role={me?.role} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
