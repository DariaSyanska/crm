"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Task } from "@/types/task";
import { useChartSize } from "@/components/dashboard/useChartSize";

type Props = {
  tasks: Task[];
};

const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

export default function TasksStatusChart({ tasks }: Props) {
  const [mounted, setMounted] = useState(false);
  const { ref, width } = useChartSize();

  useEffect(() => {
    setMounted(true);
  }, []);

  const statuses = ["open", "in_progress", "done"];

  const data = statuses.map((status) => ({
    name: status.replace("_", " "),
    value: tasks.filter((task) => task.status.toLowerCase() === status).length,
  }));

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Tasks by Status
      </h3>

      <div ref={ref} className="h-[320px] w-full min-w-0">
        {mounted && width > 0 ? (
          <PieChart width={width} height={320}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              cx="50%"
              cy="50%"
              label={{ fill: "#94a3b8" }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#f8fafc" }}
            />

            <Legend
              wrapperStyle={{
                color: "#94a3b8",
              }}
            />
          </PieChart>
        ) : null}
      </div>
    </div>
  );
}
