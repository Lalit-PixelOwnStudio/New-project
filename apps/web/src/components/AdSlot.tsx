"use client";
import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT as CLIENT, AD_PLACEHOLDERS as PLACEHOLDERS } from "@/lib/ads";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./AdSlot.module.css";

export type Placement = "top" | "editor" | "feed" | "article" | "banner" | "footer" | "export" | "anchor" | "rail";

/**
 * One display ad unit (NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY) can fill every
 * placement; a placement's own unit, if set, takes over so it shows up
 * separately in AdSense reports.
 */
const DISPLAY = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY;
const SLOTS: Record<Placement, string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || DISPLAY,
  editor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR || DISPLAY,
  feed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED || DISPLAY,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || DISPLAY,
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || DISPLAY,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || DISPLAY,
  export: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXPORT || DISPLAY,
  anchor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR || DISPLAY,
  rail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL || DISPLAY,
};

const SIZE_HINT: Record<Placement, string> = {
  top: "728 × 90 · 320 × 100 on phones",
  editor: "728 × 90 · responsive",
  feed: "Responsive · 336 × 280 on phones",
  article: "In-article · responsive",
  banner: "970 × 90 · responsive",
  footer: "970 × 90 · responsive",
  export: "336 × 280",
  anchor: "320 × 50",
  rail: "160 × 600",
};

/** Fixed-size units; the rest are responsive. */
const FIXED: Partial<Record<Placement, { width: number; height: number }>> = {
  anchor: { width: 320, height: 50 },
  rail: { width: 160, height: 600 },
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Whether a media query matches; false until mounted, so hidden units never load. */
export function useMedia(query: string | undefined) {
  const [matches, setMatches] = useState(!query);
  useEffect(() => {
    if (!query) return;
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** Whether this visitor sees ads at all (free plan, and something to show). */
export function useAdsVisible() {
  const { entitlements, loading } = useEntitlements();
  return !loading && entitlements.limits.ads && (PLACEHOLDERS || Boolean(CLIENT));
}

/**
 * A display ad for free users. Pro users get nothing at all: no markup, no
 * script. Space is reserved up front so the page never shifts when it fills.
 * `media` limits the unit to screens matching a media query.
 */
export function AdSlot({ placement, className, media }: { placement: Placement; className?: string; media?: string }) {
  const visible = useAdsVisible();
  const fits = useMedia(media);
  const pushed = useRef(false);
  const slot = SLOTS[placement];
  const show = visible && fits;
  const live = Boolean(CLIENT && slot);
  const fixed = FIXED[placement];

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
    // A plain block rather than a landmark: pages hold several, and the visible label names each one.
    <div className={cls}>
      <span className={s.label}>Advertisement</span>
      {live ? (
        fixed ? (
          <ins className="adsbygoogle" style={{ display: "inline-block", ...fixed }} data-ad-client={CLIENT} data-ad-slot={slot} />
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={CLIENT}
            data-ad-slot={slot}
            data-ad-format={placement === "export" ? "rectangle" : "auto"}
            data-full-width-responsive="true"
          />
        )
      ) : (
        <span className={s.hint}>Ad space · {SIZE_HINT[placement]}</span>
      )}
    </div>
  );
}
