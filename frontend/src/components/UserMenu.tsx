"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

type Props = {
  name?: string;
  email?: string;
  role?: string;
};

export default function UserMenu({ name, email, role }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {initials}
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-slate-900">{name || "User"}</p>
          <p className="text-xs text-slate-500">{role || "manager"}</p>
        </div>

        <svg
          className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{name || "User"}</p>
            <p className="mt-1 text-sm text-slate-500">{email || "No email"}</p>
            <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
              {role || "manager"}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/clients");
              }}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clients
            </button>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}