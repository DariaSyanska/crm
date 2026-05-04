"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import DealForm from "@/components/DealForm";
import DealsKanban from "@/components/DealsKanban";
import DeleteConfirm from "@/components/DeleteConfirm";
import EditDealForm from "@/components/EditDealForm";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageActions from "@/components/PageActions";
import StatsCards from "@/components/StatsCards";
import Toast from "@/components/Toast";
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

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

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

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deals.filter((deal) => {
      const matchesStage =
        stageFilter === "all" ||
        deal.stage.toLowerCase() === stageFilter.toLowerCase();

      const client = clients.find((c) => c.id === deal.client_id);

      const matchesSearch =
        query === "" ||
        deal.title.toLowerCase().includes(query) ||
        String(deal.amount).toLowerCase().includes(query) ||
        deal.stage.toLowerCase().includes(query) ||
        (client?.name || "").toLowerCase().includes(query) ||
        (client?.company || "").toLowerCase().includes(query);

      return matchesStage && matchesSearch;
    });
  }, [deals, clients, search, stageFilter]);

  const totalAmount = deals.reduce((sum, deal) => sum + Number(deal.amount), 0);
  const visibleAmount = filteredDeals.reduce(
    (sum, deal) => sum + Number(deal.amount),
    0,
  );
  const wonDeals = deals.filter(
    (deal) => deal.stage.toLowerCase() === "won",
  ).length;

  const handleCreated = async () => {
    await fetchDeals();
    setIsCreateOpen(false);
    showToast("Deal created successfully", "success");
  };

  const handleUpdated = async () => {
    await fetchDeals();
    setEditingDeal(null);
    showToast("Deal updated successfully", "success");
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/deals/${deletingDeal.id}`);
      await fetchDeals();
      setDeletingDeal(null);
      showToast("Deal deleted successfully", "success");
    } catch (error: any) {
      console.error("Failed to delete deal:", error);
      showToast(
        error?.response?.data?.detail || "Failed to delete deal",
        "error",
      );
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
          {
            label: "Visible Value",
            value: `$${visibleAmount.toLocaleString()}`,
          },
        ]}
      />

      <PageActions
        buttonText="+ New Deal"
        onClick={() => setIsCreateOpen(true)}
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search deals, clients, companies, stage, amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="crm-input"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "lead", label: "Lead" },
          { value: "negotiation", label: "Negotiation" },
          { value: "won", label: "Won" },
          { value: "lost", label: "Lost" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setStageFilter(item.value)}
            className={
              stageFilter === item.value
                ? "crm-filter-button-active"
                : "crm-filter-button"
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading deals...</p>
      ) : filteredDeals.length === 0 ? (
        <EmptyState
          title={deals.length === 0 ? "No deals yet" : "No deals found"}
          description={
            deals.length === 0
              ? "Create your first deal to start tracking opportunities in your sales pipeline."
              : "Try changing your search or stage filter."
          }
          action={
            deals.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="crm-primary-button"
              >
                + Create Deal
              </button>
            ) : null
          }
        />
      ) : (
        <DealsKanban
          deals={filteredDeals}
          clients={clients}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
          onStageChanged={fetchDeals}
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

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppShell>
  );
}
