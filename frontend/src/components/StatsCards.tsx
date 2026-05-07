"use client";

import { useEffect, useState } from "react";

type StatItem = {
  label: string;
  value: string | number;
  helper?: string;
  trend?: string;
  tone?: "blue" | "green" | "purple" | "orange" | "red";
};

type Props = {
  items: StatItem[];
};

const toneClasses = {
  blue: {
    icon: "bg-blue-500/15 text-blue-500",
    glow: "from-blue-500/10",
    trend: "text-blue-600 dark:text-blue-400",
  },
  green: {
    icon: "bg-green-500/15 text-green-500",
    glow: "from-green-500/10",
    trend: "text-green-600 dark:text-green-400",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-500",
    glow: "from-purple-500/10",
    trend: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    icon: "bg-orange-500/15 text-orange-500",
    glow: "from-orange-500/10",
    trend: "text-orange-600 dark:text-orange-400",
  },
  red: {
    icon: "bg-red-500/15 text-red-500",
    glow: "from-red-500/10",
    trend: "text-red-600 dark:text-red-400",
  },
};

function AnimatedValue({ value }: { value: string | number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      className={`mt-3 text-3xl font-bold tracking-tight text-slate-950 transition-all duration-500 dark:text-white ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {value}
    </p>
  );
}

export default function StatsCards({ items }: Props) {
  return (
    <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const tone = item.tone || "blue";
        const styles = toneClasses[tone];

        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            style={{
              transitionDelay: `${index * 40}ms`,
            }}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>

                <AnimatedValue value={item.value} />

                {item.helper && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {item.helper}
                  </p>
                )}

                {item.trend && (
                  <p className={`mt-3 text-sm font-semibold ${styles.trend}`}>
                    {item.trend}
                  </p>
                )}
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${styles.icon}`}
              >
                ✦
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
