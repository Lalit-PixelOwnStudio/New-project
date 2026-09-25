"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { FREE_ENTITLEMENTS, type Entitlements } from "./plans";

interface Ctx {
  entitlements: Entitlements;
  loading: boolean;
  refresh: () => Promise<void>;
}

const EntitlementsContext = createContext<Ctx>({ entitlements: FREE_ENTITLEMENTS, loading: false, refresh: async () => {} });

export function EntitlementsProvider({ children }: { children: ReactNode }) {
  const [entitlements, setEntitlements] = useState<Entitlements>(FREE_ENTITLEMENTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) setEntitlements((await res.json()) as Entitlements);
    } catch {
      // Offline or API unavailable: stay on the free experience.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Ad spaces are reserved in the server HTML so nothing jumps when ads load;
  // for Pro they collapse (see [data-ads="off"] in the CSS).
  const ads = entitlements.limits.ads;
  useEffect(() => {
    if (ads) delete document.documentElement.dataset.ads;
    else document.documentElement.dataset.ads = "off";
  }, [ads]);

  return <EntitlementsContext.Provider value={{ entitlements, loading, refresh }}>{children}</EntitlementsContext.Provider>;
}

export const useEntitlements = () => useContext(EntitlementsContext);

/** True if the user may export with this Pro style (Pro plan or bought individually). */
export const canUseStyle = (e: Entitlements, styleId: string, tier: "free" | "pro") =>
  tier === "free" || e.limits.proStyles || e.unlockedStyles.includes(styleId);
