"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Deal } from "@/types/deal";
import { useChartSize } from "@/components/dashboard/useChartSize";

type Props = {
  deals: Deal[];
};

export default function DealsStageChart({ deals }: Props) {
  const [mounted, setMounted] = useState(false);
  const { ref, width } = useChartSize();

  useEffect(() => {
    setMounted(true);
  }, []);

  const stages = ["lead", "contacted", "negotiation", "won", "lost"];

  const data = stages.map((stage) => ({
    stage,
    count: deals.filter((deal) => deal.stage.toLowerCase() === stage).length,
  }));

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 min-w-0">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Deals by Stage</h3>

      <div ref={ref} className="w-full h-[320px] min-w-0">
        {mounted && width > 0 ? (
          <BarChart width={width} height={320} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}