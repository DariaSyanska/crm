"use client";

import Link from "next/link";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import { Task } from "@/types/task";

type ActivityType = "Client" | "Deal" | "Task";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  badge: ActivityType;
};

type Props = {
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
};

const formatDate = (date?: string | null) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "No date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const getActivityStyles = (badge: ActivityType) => {
  switch (badge) {
    case "Client":
      return {
        dot: "bg-blue-500 shadow-blue-500/30",
        badge:
          "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
        icon: "👥",
      };
    case "Deal":
      return {
        dot: "bg-purple-500 shadow-purple-500/30",
        badge:
          "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
        icon: "💼",
      };
    case "Task":
      return {
        dot: "bg-emerald-500 shadow-emerald-500/30",
        badge:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        icon: "✅",
      };
  }
};

export default function RecentActivity({ clients, deals, tasks }: Props) {
  const activities: ActivityItem[] = [
    ...clients.map((client) => ({
      id: `client-${client.id}`,
      title: client.name,
      description: client.company
        ? `New client from ${client.company}`
        : "New client added",
      href: `/clients/${client.id}`,
      createdAt: client.created_at || "",
      badge: "Client" as const,
    })),

    ...deals.map((deal) => ({
      id: `deal-${deal.id}`,
      title: deal.title,
      description: `${deal.stage} · $${Number(
        deal.amount || 0,
      ).toLocaleString()}`,
      href: `/deals/${deal.id}`,
      createdAt: deal.created_at,
      badge: "Deal" as const,
    })),

    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: task.due_date
        ? `Due ${formatDate(task.due_date)} · ${task.status}`
        : `Task · ${task.status}`,
      href: "/tasks",
      createdAt: task.due_date || "",
      badge: "Task" as const,
    })),
  ]
    .sort((a, b) => {
      const firstDate = new Date(a.createdAt).getTime() || 0;
      const secondDate = new Date(b.createdAt).getTime() || 0;
      return secondDate - firstDate;
    })
    .slice(0, 7);

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Timeline
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
            Recent Activity
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest clients, deals, and task updates.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {activities.length} updates
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm dark:bg-slate-900">
            ✦
          </div>

          <p className="font-medium text-slate-900 dark:text-white">
            No activity yet
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add clients, deals, or tasks to see them here.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const styles = getActivityStyles(activity.badge);

              return (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className="group relative flex gap-4 rounded-2xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
                    <span
                      className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full shadow-lg ${styles.dot}`}
                    />
                    <span className="text-base">{styles.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-700">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {activity.title}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {activity.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                      >
                        {activity.badge}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span>{formatDate(activity.createdAt)}</span>
                      <span className="opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="absolute right-4 top-1 rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      Latest
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
