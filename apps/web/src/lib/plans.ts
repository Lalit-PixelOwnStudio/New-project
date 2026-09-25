/**
 * What each plan allows. Shared by the server (enforcement) and the client
 * (what to show). Prices live in pricing.ts.
 */
export type PlanId = "free" | "pro";

export interface Limits {
  pagesPerExport: number;
  pagesPerDay: number;
  maxDpi: number;
  proStyles: boolean;
  proPapers: boolean;
  proPens: boolean;
  effects: boolean;
  customInk: boolean;
  fatigue: boolean;
  transparent: boolean;
  batch: boolean;
  cloudDocuments: boolean;
  ads: boolean;
}

export const LIMITS: Record<PlanId, Limits> = {
  free: {
    pagesPerExport: 3,
    pagesPerDay: 10,
    maxDpi: 150,
    proStyles: false,
    proPapers: false,
    proPens: false,
    effects: false,
    customInk: false,
    fatigue: false,
    transparent: false,
    batch: false,
    cloudDocuments: false,
    ads: true,
  },
  pro: {
    pagesPerExport: 200,
    pagesPerDay: 1000,
    maxDpi: 300,
    proStyles: true,
    proPapers: true,
    proPens: true,
    effects: true,
    customInk: true,
    fatigue: true,
    transparent: true,
    batch: true,
    cloudDocuments: true,
    ads: false,
  },
};

export interface Entitlements {
  plan: PlanId;
  /** ISO date when Pro (subscription or pass) ends, if any. */
  proUntil: string | null;
  /** Page credits from page packs; spent on pages beyond the free limits. */
  credits: number;
  /** Pro styles bought individually. */
  unlockedStyles: string[];
  limits: Limits;
  signedIn: boolean;
}

export const FREE_ENTITLEMENTS: Entitlements = {
  plan: "free",
  proUntil: null,
  credits: 0,
  unlockedStyles: [],
  limits: LIMITS.free,
  signedIn: false,
};
