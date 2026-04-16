"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import ClientsToolbar from "@/components/ClientsToolbar";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditClientForm from "@/components/EditClientForm";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
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
    } catch (error) {
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
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        (client.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (client.company || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        client.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const activeCount = clients.filter(
    (client) => client.status.toLowerCase() === "active"
  ).length;

  const handleCreated = async () => {
    await fetchClients();
    setIsCreateOpen(false);
  };

  const handleUpdated = async () => {
    await fetchClients();
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (!deletingClient) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/clients/${deletingClient.id}`);
      await fetchClients();
      setDeletingClient(null);
    } catch (error: any) {
      console.error("Failed to delete client:", error);
      alert(error?.response?.data?.detail || "Failed to delete client");
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
          { label: "Filtered Results", value: filteredClients.length },
        ]}
      />

      <ClientsToolbar
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        total={filteredClients.length}
      />

      <PageActions buttonText="+ New Client" onClick={() => setIsCreateOpen(true)} />

      {loading ? (
        <p className="text-slate-500">Loading clients...</p>
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
    </AppShell>
  );
}