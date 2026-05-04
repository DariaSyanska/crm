"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Deal } from "@/types/deal";
import { useChartSize } from "@/components/dashboard/useChartSize";

type Props = {
  deals: Deal[];
};

const stages = ["lead", "contacted", "negotiation", "won", "lost"];

const formatStage = (stage: string) =>
  stage.charAt(0).toUpperCase() + stage.slice(1);

export default function DealsStageChart({ deals }: Props) {
  const [mounted, setMounted] = useState(false);
  const { ref, width } = useChartSize();

  useEffect(() => {
    setMounted(true);
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

      <div ref={ref} className="h-[320px] w-full min-w-0">
        {mounted && width > 0 ? (
          <BarChart width={width} height={320} data={data} barSize={36}>
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
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "value") {
                  return [
                    `$${Number(value).toLocaleString("en-US")}`,
                    "Pipeline value",
                  ];
                }

                return [value, "Deals"];
              }}
              labelStyle={{ fontWeight: 600, color: "#0f172a" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#3b82f6" />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}
