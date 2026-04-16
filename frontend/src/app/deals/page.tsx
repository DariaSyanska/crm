"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import DealForm from "@/components/DealForm";
import DealsKanban from "@/components/DealsKanban";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditDealForm from "@/components/EditDealForm";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";

export default function DealsPage() {
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      const response = await api.get("/deals/");
      setDeals(response.data);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get("/clients/");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    fetchDeals();
    fetchClients();
  }, [router, fetchDeals, fetchClients]);

  const totalAmount = deals.reduce((sum, deal) => sum + Number(deal.amount), 0);
  const wonDeals = deals.filter((deal) => deal.stage.toLowerCase() === "won").length;

  const handleCreated = async () => {
    await fetchDeals();
    setIsCreateOpen(false);
  };

  const handleUpdated = async () => {
    await fetchDeals();
    setEditingDeal(null);
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/deals/${deletingDeal.id}`);
      await fetchDeals();
      setDeletingDeal(null);
    } catch (error: any) {
      console.error("Failed to delete deal:", error);
      alert(error?.response?.data?.detail || "Failed to delete deal");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppShell title="Deals" subtitle="Manage your sales pipeline.">
      <StatsCards
        items={[
          { label: "Total Deals", value: deals.length },
          { label: "Total Value", value: `$${totalAmount.toLocaleString()}` },
          { label: "Won Deals", value: wonDeals },
        ]}
      />

      <PageActions buttonText="+ New Deal" onClick={() => setIsCreateOpen(true)} />

      {loading ? (
        <p className="text-slate-500">Loading deals...</p>
      ) : (
        <DealsKanban
          deals={deals}
          clients={clients}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
        />
      )}

      <Modal
        open={isCreateOpen}
        title="Create New Deal"
        onClose={() => setIsCreateOpen(false)}
      >
        <DealForm onCreated={handleCreated} />
      </Modal>

      <Modal
        open={!!editingDeal}
        title="Edit Deal"
        onClose={() => setEditingDeal(null)}
      >
        {editingDeal && (
          <EditDealForm deal={editingDeal} onUpdated={handleUpdated} />
        )}
      </Modal>

      <Modal
        open={!!deletingDeal}
        title="Delete Deal"
        onClose={() => setDeletingDeal(null)}
      >
        {deletingDeal && (
          <DeleteConfirm
            title="Delete deal?"
            description={`Are you sure you want to delete "${deletingDeal.title}"? This action cannot be undone.`}
            confirmText="Delete Deal"
            loading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setDeletingDeal(null)}
          />
        )}
      </Modal>
    </AppShell>
  );
}