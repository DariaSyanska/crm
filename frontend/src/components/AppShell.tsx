"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/deals", label: "Deals" },
  { href: "/tasks", label: "Tasks" },
  { href: "/notes", label: "Notes" },
];

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AppShell({ title, subtitle, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 hidden md:flex md:flex-col">
          <div className="px-6 py-6 border-b border-slate-800">
            <div className="text-2xl font-bold">CRM</div>
            <p className="text-sm text-slate-400 mt-1">Sales workspace</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}