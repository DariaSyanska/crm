"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditClientForm from "@/components/EditClientForm";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { User } from "@/types/user";

export default function ClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get("/clients/");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setUsers([]);
        return;
      }

      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    fetchClients();
    fetchUsers();
  }, [router, fetchClients, fetchUsers]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesStatus =
        statusFilter === "all" ||
        client.status.toLowerCase() === statusFilter.toLowerCase();

      const manager = users.find((u) => u.id === client.manager_id);

      const matchesSearch =
        query === "" ||
        client.name.toLowerCase().includes(query) ||
        (client.email || "").toLowerCase().includes(query) ||
        (client.company || "").toLowerCase().includes(query) ||
        (client.phone || "").toLowerCase().includes(query) ||
        (manager?.name || "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [clients, users, search, statusFilter]);

  const activeCount = clients.filter(
    (client) => client.status.toLowerCase() === "active",
  ).length;

  const handleCreated = async () => {
    await fetchClients();
    setIsCreateOpen(false);
    showToast("Client created successfully", "success");
  };

  const handleUpdated = async () => {
    await fetchClients();
    setEditingClient(null);
    showToast("Client updated successfully", "success");
  };

  const handleDelete = async () => {
    if (!deletingClient) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/clients/${deletingClient.id}`);
      await fetchClients();
      setDeletingClient(null);
      showToast("Client deleted successfully", "success");
    } catch (error: any) {
      console.error("Failed to delete client:", error);
      showToast(
        error?.response?.data?.detail || "Failed to delete client",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppShell title="Clients" subtitle="Manage customer records and ownership.">
      <StatsCards
        items={[
          { label: "Total Clients", value: clients.length },
          { label: "Active Clients", value: activeCount },
          { label: "Visible", value: filteredClients.length },
        ]}
      />

      <PageActions
        buttonText="+ New Client"
        onClick={() => setIsCreateOpen(true)}
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients, companies, email, phone, manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="crm-input"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setStatusFilter("lead")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "lead"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Lead
        </button>

        <button
          onClick={() => setStatusFilter("active")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "active"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setStatusFilter("inactive")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            statusFilter === "inactive"
              ? "bg-slate-500 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Inactive
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading clients...</p>
      ) : filteredClients.length === 0 ? (
        <EmptyState
          title={clients.length === 0 ? "No clients yet" : "No clients found"}
          description={
            clients.length === 0
              ? "Create your first client to start managing customer relationships."
              : "Try changing your search or filter settings."
          }
          action={
            clients.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                + Create Client
              </button>
            ) : null
          }
        />
      ) : (
        <ClientList
          clients={filteredClients}
          users={users}
          onEdit={setEditingClient}
          onDelete={setDeletingClient}
        />
      )}

      <Modal
        open={isCreateOpen}
        title="Create New Client"
        onClose={() => setIsCreateOpen(false)}
      >
        <ClientForm onCreated={handleCreated} />
      </Modal>

      <Modal
        open={!!editingClient}
        title="Edit Client"
        onClose={() => setEditingClient(null)}
      >
        {editingClient && (
          <EditClientForm client={editingClient} onUpdated={handleUpdated} />
        )}
      </Modal>

      <Modal
        open={!!deletingClient}
        title="Delete Client"
        onClose={() => setDeletingClient(null)}
      >
        {deletingClient && (
          <DeleteConfirm
            title="Delete client?"
            description={`Are you sure you want to delete "${deletingClient.name}"? This action cannot be undone.`}
            confirmText="Delete Client"
            loading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setDeletingClient(null)}
          />
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppShell>
  );
}
