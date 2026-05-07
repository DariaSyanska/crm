"use client";

import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Task } from "@/types/task";
import { useChartSize } from "@/components/dashboard/useChartSize";

type Props = {
  tasks: Task[];
};

type TooltipProps = {
  active?: boolean;
  payload?: any[];
};

const statuses = [
  { key: "open", label: "Open", color: "#3b82f6" },
  { key: "in_progress", label: "In Progress", color: "#f59e0b" },
  { key: "done", label: "Done", color: "#22c55e" },
];

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <p className="font-semibold text-slate-900 dark:text-white">
        {item.name}
      </p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Tasks:{" "}
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {item.value}
        </span>
      </p>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Share:{" "}
        <span className="font-medium text-green-600 dark:text-green-400">
          {item.percent}%
        </span>
      </p>
    </div>
  );
}

export default function TasksStatusChart({ tasks }: Props) {
  const [mounted, setMounted] = useState(false);
  const { ref, width } = useChartSize();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const totalTasks = tasks.length;

  const data = statuses.map((status) => {
    const value = tasks.filter(
      (task) => task.status.toLowerCase() === status.key,
    ).length;

    return {
      name: status.label,
      value,
      color: status.color,
      percent: totalTasks ? Math.round((value / totalTasks) * 100) : 0,
    };
  });

  const hasData = data.some((item) => item.value > 0);
  const chartWidth = Math.max(width || 0, 300);

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tasks by Status
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Task distribution by current workflow status.
        </p>
      </div>

      <div
        ref={ref}
        className="relative h-[320px] w-full min-w-0 overflow-hidden"
      >
        {mounted ? (
          hasData ? (
            <PieChart width={chartWidth} height={320}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={95}
                cx="50%"
                cy="50%"
                paddingAngle={4}
                cornerRadius={10}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />

              <Legend
                iconType="circle"
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-950">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  No tasks yet
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create tasks to see status analytics.
                </p>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
