"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatsCards from "@/components/StatsCards";
import dynamic from "next/dynamic";
import RevenueCard from "@/components/dashboard/RevenueCard";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { User } from "@/types/user";
import { Deal } from "@/types/deal";
import { Task } from "@/types/task";

const DealsStageChart = dynamic(
  () => import("@/components/dashboard/DealsStageChart"),
  { ssr: false }
);

const TasksStatusChart = dynamic(
  () => import("@/components/dashboard/TasksStatusChart"),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
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
        const [userRes, dealsRes, tasksRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/deals/"),
          api.get("/tasks/"),
        ]);

        setUser(userRes.data);
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

  const wonDeals = deals.filter((deal) => deal.stage.toLowerCase() === "won").length;
  const doneTasks = tasks.filter((task) => task.status.toLowerCase() === "done").length;

  return (
    <AppShell title="Dashboard" subtitle="Overview of your CRM workspace.">
      <StatsCards
        items={[
          { label: "Current User", value: user?.name || "-" },
          { label: "Won Deals", value: wonDeals },
          { label: "Completed Tasks", value: doneTasks },
        ]}
      />

      {loading ? (
        <p className="text-slate-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-2 min-w-0">
              <DealsStageChart deals={deals} />
            </div>
            <div className="min-w-0">
              <RevenueCard deals={deals} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <TasksStatusChart tasks={tasks} />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="text-base font-medium text-slate-900">{user?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-base font-medium text-slate-900">{user?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="text-base font-medium text-slate-900 capitalize">{user?.role || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}