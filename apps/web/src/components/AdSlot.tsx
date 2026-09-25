"use client";
import { useEffect, useRef } from "react";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./AdSlot.module.css";

export type Placement = "editor" | "export" | "article" | "banner";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
/** Until AdSense is live, reserved ad spaces show as labelled placeholders. Set to "0" to hide them. */
const PLACEHOLDERS = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS !== "0";

/** Slot ids are created per placement in the AdSense dashboard. */
const SLOTS: Record<Placement, string | undefined> = {
  editor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR,
  export: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXPORT,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE,
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
};

const SIZE_HINT: Record<Placement, string> = {
  editor: "728 × 90 · responsive",
  export: "336 × 280",
  article: "In-article · responsive",
  banner: "970 × 90 · responsive",
};

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
  const live = Boolean(CLIENT && slot);

  useEffect(() => {
    if (!show || !live || pushed.current) return;
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
  }, [show, live]);

  if (!show || (!live && !PLACEHOLDERS)) return null;
  const cls = [s.slot, s[placement], live ? "" : s.placeholder, className].filter(Boolean).join(" ");
  return (
    <aside className={cls} aria-label="Advertisement">
      <span className={s.label}>Advertisement</span>
      {live ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format={placement === "export" ? "rectangle" : "auto"}
          data-full-width-responsive="true"
        />
      ) : (
        <span className={s.hint}>Ad space · {SIZE_HINT[placement]}</span>
      )}
    </aside>
  );
}
