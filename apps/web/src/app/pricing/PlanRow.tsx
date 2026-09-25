"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * The plan cards. On phones they sit in one row you swipe through, starting
 * on the highlighted plan; on wider screens they're a plain grid.
 */
export function PlanRow({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const card = row.querySelector<HTMLElement>("[data-highlight]");
    if (card) row.scrollLeft = card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;
  }, []);
  return (
    <div ref={ref} className={className} role="region" aria-label="Plans" tabIndex={0}>
      {children}
    </div>
  );
}
