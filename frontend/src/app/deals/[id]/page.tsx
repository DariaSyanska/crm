"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import { Note } from "@/types/note";
import { Task } from "@/types/task";
import { User } from "@/types/user";

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";

  const normalized = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T");

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function badge(stage: string) {
  switch (stage.toLowerCase()) {
    case "lead":
      return "bg-yellow-100 text-yellow-700";
    case "contacted":
      return "bg-blue-100 text-blue-700";
    case "negotiation":
      return "bg-purple-100 text-purple-700";
    case "won":
      return "bg-green-100 text-green-700";
    case "lost":
      return "bg-red-100 text-red-700";
    case "open":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "done":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getUser(userId: number | null | undefined, users: User[]) {
  if (!userId) return null;
  return users.find((u) => u.id === userId) || null;
}

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = Number(params.id);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const dealRes = await api.get(`/deals/${dealId}`);
      const currentDeal: Deal = dealRes.data;
      setDeal(currentDeal);

      const [clientRes, usersRes, tasksRes, notesRes] = await Promise.all([
        api.get(`/clients/${currentDeal.client_id}`),
        api.get("/users/"),
        api.get("/tasks/"),
        api.get("/notes/"),
      ]);

      setClient(clientRes.data);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error("Failed to fetch deal details:", error);
      router.push("/deals");
    } finally {
      setLoading(false);
    }
  }, [dealId, router]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    if (!dealId || Number.isNaN(dealId)) {
      router.push("/deals");
      return;
    }

    fetchData();
  }, [dealId, router, fetchData]);

  const relatedTasks = useMemo(() => {
    if (!deal) return [];
    return tasks.filter((task) => task.client_id === deal.client_id);
  }, [tasks, deal]);

  const relatedNotes = useMemo(() => {
    if (!deal) return [];
    return notes.filter((note) => note.client_id === deal.client_id);
  }, [notes, deal]);

  if (loading) {
    return (
      <AppShell title="Deal Details" subtitle="Loading deal information...">
        <p className="text-slate-500">Loading...</p>
      </AppShell>
    );
  }

  if (!deal || !client) {
    return (
      <AppShell title="Deal Details" subtitle="Deal not found.">
        <Link href="/deals" className="text-blue-600 hover:underline">
          Back to deals
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell title="Deal Details" subtitle="Pipeline entry overview.">
      <div className="mb-6">
        <Link href="/deals" className="text-sm text-blue-600 hover:underline">
          ← Back to deals
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{deal.title}</h2>
              <p className="text-slate-500 mt-1">Deal #{deal.id}</p>
            </div>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${badge(deal.stage)}`}>
              {deal.stage}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div>
              <p className="text-sm text-slate-500">Amount</p>
              <p className="text-slate-900 font-medium">${Number(deal.amount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="text-slate-900 font-medium">{formatDate(deal.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Stage</p>
              <p className="text-slate-900 font-medium capitalize">{deal.stage}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Client ID</p>
              <p className="text-slate-900 font-medium">#{deal.client_id}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Client</h3>
          <Link href={`/clients/${client.id}`} className="flex items-center gap-3 group">
            <Avatar name={client.name} />
            <div>
              <p className="text-slate-900 font-medium group-hover:text-blue-600 transition">
                {client.name}
              </p>
              <p className="text-sm text-slate-500">{client.company || "No company"}</p>
              <p className="text-sm text-slate-500">{client.email || "-"}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Related Tasks</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{relatedTasks.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Client Notes</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{relatedNotes.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Pipeline Stage</p>
          <p className="text-4xl font-bold text-slate-900 mt-2 capitalize">{deal.stage}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Tasks</h3>
          <div className="space-y-3">
            {relatedTasks.length === 0 ? (
              <p className="text-slate-500">No tasks for this client yet.</p>
            ) : (
              relatedTasks.map((task) => {
                const assignedUser = getUser(task.user_id, users);

                return (
                  <div key={task.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${badge(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-2">{task.description || "-"}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Assigned: {assignedUser ? assignedUser.name : "-"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Due: {task.due_date ? formatDate(task.due_date) : "-"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Notes</h3>
          <div className="space-y-3">
            {relatedNotes.length === 0 ? (
              <p className="text-slate-500">No notes for this client yet.</p>
            ) : (
              relatedNotes.map((note) => {
                const author = getUser(note.user_id, users);

                return (
                  <div key={note.id} className="border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-500 mt-3">
                      Author: {author ? author.name : "-"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(note.created_at)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}