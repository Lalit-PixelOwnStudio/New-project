"use client";
import { useEffect, useRef } from "react";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./AdSlot.module.css";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const PLACEHOLDERS = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "1";

/** Slot ids are configured per placement in the AdSense dashboard. */
const SLOTS: Record<Placement, string | undefined> = {
  editor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR,
  export: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXPORT,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE,
};

export type Placement = "editor" | "export" | "article";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A display ad for free users. Pro users get nothing at all: no markup, no
 * script. Space is reserved up front so the page never shifts when it fills.
 */
export function AdSlot({ placement, className }: { placement: Placement; className?: string }) {
  const { entitlements, loading } = useEntitlements();
  const pushed = useRef(false);
  const slot = SLOTS[placement];
  const show = !loading && entitlements.limits.ads;

  useEffect(() => {
    if (!show || !CLIENT || !slot || pushed.current) return;
    pushed.current = true;
    if (!document.querySelector("script[data-adsense]")) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      script.crossOrigin = "anonymous";
      script.dataset.adsense = "1";
      document.head.appendChild(script);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocked by an extension: nothing to do.
    }
  }, [show, slot]);

  if (!show) return null;
  if (!CLIENT || !slot) {
    return PLACEHOLDERS ? (
      <div className={[s.slot, s[placement], s.placeholder, className].filter(Boolean).join(" ")} aria-hidden="true">
        Ad · {placement}
      </div>
    ) : null;
  }
  return (
    <div className={[s.slot, s[placement], className].filter(Boolean).join(" ")}>
      <span className={s.label}>Advertisement</span>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}
