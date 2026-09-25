/**
 * What each plan allows. Shared by the server (enforcement) and the client
 * (what to show). Prices live in pricing.ts.
 */
/** Free, or one of the three paid plans. Month and Year unlock the same things. */
export type PlanId = "free" | "week" | "month" | "year";
export type PaidPlan = Exclude<PlanId, "free">;

export interface Limits {
  /** Pages per download before page credits are used. */
  pagesPerExport: number;
  /** Pages per rolling day before page credits are used. */
  pagesPerDay: number;
  /** Highest download resolution, in dots per inch (see resolution.ts). */
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

/** Everyone gets these free pages; a plan's pages come on top as page credits. */
const FREE_PAGES = { pagesPerExport: 3, pagesPerDay: 10 };

const FULL: Limits = {
  ...FREE_PAGES,
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
};

export const LIMITS: Record<PlanId, Limits> = {
  free: {
    ...FREE_PAGES,
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
  week: { ...FULL, maxDpi: 200, effects: false, fatigue: false, transparent: false, batch: false },
  month: FULL,
  // Year has no page limit; these only stop abuse (fair use, stated on the pricing page).
  year: { ...FULL, pagesPerExport: 300, pagesPerDay: 1000 },
};

/** What each paid plan includes; `pages: null` means no page limit. Prices live in pricing.ts. */
export const PLANS: Record<PaidPlan, { name: string; days: number; pages: number | null; bestFor: string }> = {
  week: { name: "Week", days: 7, pages: 150, bestFor: "One assignment, or a week of deadlines." },
  month: { name: "Month", days: 31, pages: 800, bestFor: "A term of assignments, notes and lab records." },
  year: { name: "Year", days: 366, pages: null, bestFor: "The whole school year, with no page limit." },
};

/** Higher wins when several plans are active at once. */
export const PLAN_RANK: Record<PlanId, number> = { free: 0, week: 1, month: 2, year: 3 };

export const planName = (plan: PlanId) => (plan === "free" ? "Free" : `${PLANS[plan].name} plan`);

export interface Entitlements {
  plan: PlanId;
  /** ISO date when the paid plans the user has run out, if any. */
  proUntil: string | null;
  /** Page credits from plans and page packs; spent on pages beyond the free limits. */
  credits: number;
  /** Pro styles bought individually. */
  unlockedStyles: string[];
  limits: Limits;
  signedIn: boolean;
  email?: string | null;
  name?: string | null;
}

export const FREE_ENTITLEMENTS: Entitlements = {
  plan: "free",
  proUntil: null,
  credits: 0,
  unlockedStyles: [],
  limits: LIMITS.free,
  signedIn: false,
};
