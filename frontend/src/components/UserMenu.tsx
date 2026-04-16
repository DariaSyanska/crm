"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

type Props = {
  name?: string;
  email?: string;
};

export default function UserMenu({ name, email }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-semibold text-slate-900">{name || "User"}</p>
        <p className="text-xs text-slate-500">{email || ""}</p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Logout
      </button>
    </div>
  );
}