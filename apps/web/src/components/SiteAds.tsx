"use client";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdBand } from "./AdBand";
import { AdSlot, useAdsVisible, useMedia } from "./AdSlot";
import s from "./SiteAds.module.css";

/** Pages where ads would get in the way of paying, signing in or reading terms. */
const NO_ADS = [/^\/pricing/, /^\/login/, /^\/account/, /^\/legal\//];

const PHONE = "(max-width: 960px)";
/** Side rails only where they fit beside the 1360px page without covering it. */
const WIDE = "(min-width: 1760px)";
const ANCHOR_H = "78px";

/**
 * Ads that sit around every page rather than in it: a banner above the
 * footer, a closable strip pinned to the bottom of phones, and skyscrapers
 * in the side margins of very wide screens.
 */
export function SiteAds() {
  const path = usePathname();
  if (NO_ADS.some((re) => re.test(path))) return null;
  return (
    // One landmark for the ads that live outside the page's main content.
    <aside aria-label="Advertisements">
      <AdBand placement="footer" />
      <Anchor />
      <AdSlot placement="rail" media={WIDE} className={`${s.rail} ${s.railLeft}`} />
      <AdSlot placement="rail" media={WIDE} className={`${s.rail} ${s.railRight}`} />
    </aside>
  );
}

function Anchor() {
  const visible = useAdsVisible();
  const phone = useMedia(PHONE);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("th_anchor_closed")) setClosed(true);
    } catch {
      // Storage blocked: the strip just shows again.
    }
  }, []);

  const open = visible && phone && !closed;

  // Lets the page (and the editor's download bar) keep clear of the strip.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.setProperty("--anchor-h", ANCHOR_H);
    return () => {
      document.documentElement.style.removeProperty("--anchor-h");
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className={s.anchor}>
      <AdSlot placement="anchor" />
      <button
        type="button"
        className={s.close}
        aria-label="Close ad"
        onClick={() => {
          setClosed(true);
          try {
            sessionStorage.setItem("th_anchor_closed", "1");
          } catch {
            // Closed for this page view only.
          }
        }}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
