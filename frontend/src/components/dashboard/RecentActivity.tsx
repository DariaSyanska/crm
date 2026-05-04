"use client";

import Link from "next/link";
import { Client } from "@/types/client";
import { Deal } from "@/types/deal";
import { Task } from "@/types/task";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  badge: string;
};

type Props = {
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
};

const formatDate = (date?: string | null) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
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
      badge: "Client",
    })),
    ...deals.map((deal) => ({
      id: `deal-${deal.id}`,
      title: deal.title,
      description: `${deal.stage} · $${Number(deal.amount || 0).toLocaleString()}`,
      href: `/deals/${deal.id}`,
      createdAt: deal.created_at,
      badge: "Deal",
    })),
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: task.due_date
        ? `Due ${formatDate(task.due_date)} · ${task.status}`
        : `Task · ${task.status}`,
      href: "/tasks",
      createdAt: task.due_date || "",
      badge: "Task",
    })),
  ]
    .sort((a, b) => {
      const firstDate = new Date(a.createdAt).getTime() || 0;
      const secondDate = new Date(b.createdAt).getTime() || 0;
      return secondDate - firstDate;
    })
    .slice(0, 6);

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest clients, deals, and task updates.
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white">
            No activity yet
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add clients, deals, or tasks to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="group flex items-start gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            >
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-blue-400" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {activity.title}
                  </p>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {activity.badge}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {activity.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
