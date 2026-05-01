"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";
import StatsCards from "@/components/StatsCards";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import RevenueCard from "@/components/dashboard/RevenueCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import { Task } from "@/types/task";

const DealsStageChart = dynamic(
  () => import("@/components/dashboard/DealsStageChart"),
  { ssr: false },
);

const TasksStatusChart = dynamic(
  () => import("@/components/dashboard/TasksStatusChart"),
  { ssr: false },
);

export default function DashboardPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [, clientsRes, dealsRes, tasksRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/clients/"),
          api.get("/deals/"),
          api.get("/tasks/"),
        ]);

        setClients(clientsRes.data);
        setDeals(dealsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const activeDeals = deals.filter((deal) => {
    const stage = deal.stage.toLowerCase();
    return stage !== "won" && stage !== "lost";
  });

  const wonRevenue = deals
    .filter((deal) => deal.stage.toLowerCase() === "won")
    .reduce((total, deal) => total + Number(deal.amount || 0), 0);

  const tasksDueToday = tasks.filter((task) => {
    if (!task.due_date || task.status.toLowerCase() === "done") return false;
    return task.due_date.slice(0, 10) === todayKey;
  }).length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <AppShell title="Dashboard" subtitle="Overview of your CRM workspace.">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <StatsCards
            items={[
              {
                label: "Total Clients",
                value: clients.length,
                helper: "All clients in your CRM",
              },
              {
                label: "Active Deals",
                value: activeDeals.length,
                helper: "Open pipeline opportunities",
              },
              {
                label: "Revenue",
                value: formatCurrency(wonRevenue),
                helper: "Total from won deals",
              },
              {
                label: "Tasks Due Today",
                value: tasksDueToday,
                helper: "Open tasks for today",
              },
            ]}
          />

          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <DealsStageChart deals={deals} />
            </div>
            <div className="min-w-0">
              <RevenueCard deals={deals} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="min-w-0 xl:col-span-1">
              <TasksStatusChart tasks={tasks} />
            </div>

            <div className="min-w-0 xl:col-span-2">
              <RecentActivity clients={clients} deals={deals} tasks={tasks} />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
