"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
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
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 min-w-0">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Tasks by Status</h3>

      <div ref={ref} className="w-full h-[320px] min-w-0">
        {mounted && width > 0 ? (
          <PieChart width={width} height={320}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              cx="50%"
              cy="50%"
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : null}
      </div>
    </div>
  );
}