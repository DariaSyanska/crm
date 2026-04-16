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

function getManager(managerId: number | null | undefined, users: User[]) {
  if (!managerId) return null;
  return users.find((u) => u.id === managerId) || null;
}

function getUser(userId: number | null | undefined, users: User[]) {
  if (!userId) return null;
  return users.find((u) => u.id === userId) || null;
}

function statusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-slate-200 text-slate-700";
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

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [clientRes, usersRes, dealsRes, tasksRes, notesRes] = await Promise.all([
        api.get(`/clients/${clientId}`),
        api.get("/users/"),
        api.get("/deals/"),
        api.get("/tasks/"),
        api.get("/notes/"),
      ]);

      setClient(clientRes.data);
      setUsers(usersRes.data);
      setDeals(dealsRes.data);
      setTasks(tasksRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error("Failed to fetch client details:", error);
      router.push("/clients");
    } finally {
      setLoading(false);
    }
  }, [clientId, router]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    if (!clientId || Number.isNaN(clientId)) {
      router.push("/clients");
      return;
    }

    fetchData();
  }, [clientId, router, fetchData]);

  const manager = useMemo(() => getManager(client?.manager_id, users), [client, users]);
  const clientDeals = useMemo(
    () => deals.filter((deal) => deal.client_id === clientId),
    [deals, clientId]
  );
  const clientTasks = useMemo(
    () => tasks.filter((task) => task.client_id === clientId),
    [tasks, clientId]
  );
  const clientNotes = useMemo(
    () => notes.filter((note) => note.client_id === clientId),
    [notes, clientId]
  );

  if (loading) {
    return (
      <AppShell title="Client Details" subtitle="Loading client information...">
        <p className="text-slate-500">Loading...</p>
      </AppShell>
    );
  }

  if (!client) {
    return (
      <AppShell title="Client Details" subtitle="Client not found.">
        <Link href="/clients" className="text-blue-600 hover:underline">
          Back to clients
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell title="Client Details" subtitle="Full customer profile and activity.">
      <div className="mb-6">
        <Link href="/clients" className="text-sm text-blue-600 hover:underline">
          ← Back to clients
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <Avatar name={client.name} />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{client.name}</h2>
              <p className="text-slate-500 mt-1">{client.company || "No company"}</p>
              <div className="mt-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBadge(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-900 font-medium">{client.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="text-slate-900 font-medium">{client.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Client ID</p>
              <p className="text-slate-900 font-medium">#{client.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="text-slate-900 font-medium">{formatDate(client.created_at || null)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Owner</h3>
          {manager ? (
            <div className="flex items-center gap-3">
              <Avatar name={manager.name} />
              <div>
                <p className="text-slate-900 font-medium">{manager.name}</p>
                <p className="text-sm text-slate-500 capitalize">{manager.role}</p>
                <p className="text-sm text-slate-500">{manager.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No manager assigned.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Deals</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{clientDeals.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Tasks</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{clientTasks.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Notes</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{clientNotes.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 mt-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Deals</h3>
          <div className="space-y-3">
            {clientDeals.length === 0 ? (
              <p className="text-slate-500">No deals yet.</p>
            ) : (
              clientDeals.map((deal) => (
                <div key={deal.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{deal.title}</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBadge(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2">${Number(deal.amount).toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-2">{formatDate(deal.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Tasks</h3>
          <div className="space-y-3">
            {clientTasks.length === 0 ? (
              <p className="text-slate-500">No tasks yet.</p>
            ) : (
              clientTasks.map((task) => {
                const assignedUser = getUser(task.user_id, users);

                return (
                  <div key={task.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBadge(task.status)}`}>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notes</h3>
          <div className="space-y-3">
            {clientNotes.length === 0 ? (
              <p className="text-slate-500">No notes yet.</p>
            ) : (
              clientNotes.map((note) => {
                const author = getUser(note.user_id, users);

                return (
                  <div key={note.id} className="border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-500 mt-3">
                      Author: {author ? author.name : "-"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(note.created_at)}</p>
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