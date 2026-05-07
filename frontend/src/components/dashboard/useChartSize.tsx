"use client";

import { useEffect, useRef, useState } from "react";

export function useChartSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      const rect = element.getBoundingClientRect();
      const nextWidth = Math.floor(rect.width);

      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
