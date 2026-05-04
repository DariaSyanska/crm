"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import DealStageBadge from "@/components/DealStageBadge";
import { api } from "@/lib/api";

const stages = ["lead", "negotiation", "won", "lost"];

function formatStage(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function getClientName(clientId: number, clients: Client[]) {
  const client = clients.find((c) => c.id === clientId);
  return client
    ? `${client.name} (${client.company || "No company"})`
    : `#${clientId}`;
}

function findStageByDealId(deals: Deal[], dealId: number) {
  return deals.find((deal) => deal.id === dealId)?.stage.toLowerCase();
}

type DealCardProps = {
  deal: Deal;
  clients: Client[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
};

function DealCard({ deal, clients, onEdit, onDelete }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(deal.id),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 ${
        isDragging
          ? "z-50 opacity-50"
          : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {deal.title}
            </h4>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {getClientName(deal.client_id, clients)}
            </p>
          </div>

          <DealStageBadge stage={deal.stage} />
        </div>

        <div className="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              Amount:
            </span>{" "}
            ${Number(deal.amount).toLocaleString()}
          </p>

          <p>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              Created:
            </span>{" "}
            {new Date(deal.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/deals/${deal.id}`}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          View
        </Link>

        <button
          type="button"
          onClick={() => onEdit(deal)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(deal)}
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

type ColumnProps = {
  stage: string;
  deals: Deal[];
  clients: Client[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
};

function KanbanColumn({
  stage,
  deals,
  clients,
  onEdit,
  onDelete,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 ${
        isOver ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {formatStage(stage)}
        </h3>

        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {deals.length}
        </span>
      </div>

      <SortableContext
        items={deals.map((deal) => String(deal.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[180px] space-y-3">
          {deals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500">
              Drop deal here
            </div>
          ) : (
            deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                clients={clients}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}

type Props = {
  deals: Deal[];
  clients: Client[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onStageChanged?: () => void;
};

export default function DealsKanban({
  deals,
  clients,
  onEdit,
  onDelete,
  onStageChanged,
}: Props) {
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const dealsByStage = useMemo(() => {
    return stages.reduce<Record<string, Deal[]>>((acc, stage) => {
      acc[stage] = localDeals.filter(
        (deal) => deal.stage.toLowerCase() === stage,
      );
      return acc;
    }, {});
  }, [localDeals]);

  const handleDragStart = (event: DragStartEvent) => {
    const dealId = Number(event.active.id);
    const deal = localDeals.find((item) => item.id === dealId) || null;
    setActiveDeal(deal);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = String(over.id);

    const activeStage = findStageByDealId(localDeals, activeId);

    const overIsColumn = stages.includes(overId);
    const overStage = overIsColumn
      ? overId
      : findStageByDealId(localDeals, Number(overId));

    if (!activeStage || !overStage || activeStage === overStage) return;

    setLocalDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === activeId ? { ...deal, stage: overStage } : deal,
      ),
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveDeal(null);

    if (!over) {
      setLocalDeals(deals);
      return;
    }

    const activeId = Number(active.id);
    const overId = String(over.id);

    const originalDeal = deals.find((deal) => deal.id === activeId);
    const updatedDeal = localDeals.find((deal) => deal.id === activeId);

    if (!originalDeal || !updatedDeal) return;

    let nextStage = updatedDeal.stage.toLowerCase();

    if (stages.includes(overId)) {
      nextStage = overId;
    } else {
      const overDeal = localDeals.find((deal) => deal.id === Number(overId));
      if (overDeal) nextStage = overDeal.stage.toLowerCase();
    }

    setLocalDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === activeId ? { ...deal, stage: nextStage } : deal,
      ),
    );

    if (originalDeal.stage.toLowerCase() === nextStage) return;

    try {
      await api.put(`/deals/${activeId}`, {
        ...originalDeal,
        stage: nextStage,
      });

      onStageChanged?.();
    } catch (error) {
      console.error("Failed to update deal stage:", error);
      setLocalDeals(deals);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            deals={dealsByStage[stage] || []}
            clients={clients}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}
