"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useChartSize } from "@/components/dashboard/useChartSize";
import { Deal } from "@/types/deal";

type Props = {
  deals: Deal[];
};

const stages = ["lead", "contacted", "negotiation", "won", "lost"];

const formatStage = (stage: string) =>
  stage.charAt(0).toUpperCase() + stage.slice(1);

type TooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <p className="font-semibold text-slate-900 dark:text-white">{label}</p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Deals:{" "}
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {item.count}
        </span>
      </p>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Value:{" "}
        <span className="font-medium text-green-600 dark:text-green-400">
          ${item.value.toLocaleString()}
        </span>
      </p>
    </div>
  );
}

export default function DealsStageChart({ deals }: Props) {
  const [mounted, setMounted] = useState(false);
  const { ref, width } = useChartSize();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const data = stages.map((stage) => {
    const stageDeals = deals.filter(
      (deal) => deal.stage.toLowerCase() === stage,
    );

    return {
      stage: formatStage(stage),
      count: stageDeals.length,
      value: stageDeals.reduce(
        (total, deal) => total + Number(deal.amount || 0),
        0,
      ),
    };
  });

  const chartWidth = Math.max(width || 0, 300);

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Deals by Stage
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pipeline overview by deal status and potential value.
        </p>
      </div>

      <div
        ref={ref}
        className="relative h-[320px] w-full min-w-0 overflow-hidden"
      >
        {mounted ? (
          <BarChart width={chartWidth} height={320} data={data} barSize={38}>
            <defs>
              <linearGradient id="dealBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
            />

            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
            />

            <Tooltip
              cursor={{
                fill: "rgba(148, 163, 184, 0.16)",
                radius: 12,
              }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="count"
              fill="url(#dealBarGradient)"
              radius={[12, 12, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}
