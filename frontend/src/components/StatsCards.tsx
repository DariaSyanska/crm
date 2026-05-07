"use client";

import { useEffect, useMemo, useState } from "react";

type StatItem = {
  label: string;
  value: string | number;
  helper?: string;
  trend?: string;
  tone?: "blue" | "green" | "purple" | "orange" | "red";
  icon?: "clients" | "deals" | "revenue" | "tasks" | "notes" | "default";
};

type Props = {
  items: StatItem[];
};

const toneClasses = {
  blue: {
    icon: "bg-blue-500/15 text-blue-500 dark:text-blue-400",
    glow: "from-blue-500/20",
    border: "hover:border-blue-500/30",
    trend: "text-blue-600 dark:text-blue-400",
  },
  green: {
    icon: "bg-green-500/15 text-green-500 dark:text-green-400",
    glow: "from-green-500/20",
    border: "hover:border-green-500/30",
    trend: "text-green-600 dark:text-green-400",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-500 dark:text-purple-400",
    glow: "from-purple-500/20",
    border: "hover:border-purple-500/30",
    trend: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    icon: "bg-orange-500/15 text-orange-500 dark:text-orange-400",
    glow: "from-orange-500/20",
    border: "hover:border-orange-500/30",
    trend: "text-orange-600 dark:text-orange-400",
  },
  red: {
    icon: "bg-red-500/15 text-red-500 dark:text-red-400",
    glow: "from-red-500/20",
    border: "hover:border-red-500/30",
    trend: "text-red-600 dark:text-red-400",
  },
};

const icons = {
  clients: "👥",
  deals: "💼",
  revenue: "💰",
  tasks: "✅",
  notes: "📝",
  default: "✦",
};

function extractNumber(value: string | number) {
  if (typeof value === "number") return value;

  const number = Number(value.replace(/[^0-9.-]+/g, ""));
  return Number.isNaN(number) ? null : number;
}

function formatValue(originalValue: string | number, animatedValue: number) {
  if (typeof originalValue === "number") {
    return Math.round(animatedValue).toLocaleString();
  }

  if (originalValue.includes("$")) {
    return `$${Math.round(animatedValue).toLocaleString()}`;
  }

  return originalValue;
}

function AnimatedValue({ value }: { value: string | number }) {
  const target = useMemo(() => extractNumber(value), [value]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    if (target === null) return;

    let frame = 0;
    const frames = 35;

    const timer = setInterval(() => {
      frame += 1;

      const progress = frame / frames;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(target * eased);

      if (frame >= frames) {
        clearInterval(timer);
        setCurrent(target);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <p
      className={`mt-3 text-3xl font-bold tracking-tight text-slate-950 transition-all duration-500 dark:text-white ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {target === null ? value : formatValue(value, current)}
    </p>
  );
}

export default function StatsCards({ items }: Props) {
  return (
    <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const tone = item.tone || "blue";
        const styles = toneClasses[tone];
        const icon = icons[item.icon || "default"];

        return (
          <div
            key={item.label}
            className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${styles.border}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
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
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm transition duration-300 group-hover:scale-110 ${styles.icon}`}
              >
                {icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
