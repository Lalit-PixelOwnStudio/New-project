import { describe, expect, it } from "vitest";
import { FREE_ENTITLEMENTS, LIMITS, type Entitlements } from "@/lib/plans";
import { decide, QuotaError } from "@/server/quota";

const free: Entitlements = FREE_ENTITLEMENTS;
const plan = (id: "week" | "month" | "year", credits: number): Entitlements => ({
  ...FREE_ENTITLEMENTS,
  plan: id,
  limits: LIMITS[id],
  credits,
  signedIn: true,
});

describe("export quota", () => {
  it("caps free exports per download and per day", () => {
    expect(decide({ pages: 5, dpi: 150, pro: [] }, free, 0)).toMatchObject({ allowed: 3, creditsUsed: 0, freeLeftToday: 7 });
    expect(decide({ pages: 5, dpi: 150, pro: [] }, free, 9)).toMatchObject({ allowed: 1, freeLeftToday: 0 });
  });

  it("refuses when the day is used up and there are no credits", () => {
    expect(() => decide({ pages: 1, dpi: 150, pro: [] }, free, 10)).toThrowError(QuotaError);
  });

  it("spends page credits beyond the free allowance", () => {
    const withCredits = { ...free, signedIn: true, credits: 50 };
    expect(decide({ pages: 20, dpi: 150, pro: [] }, withCredits, 0)).toMatchObject({ allowed: 20, creditsUsed: 17, creditsLeft: 33 });
    expect(decide({ pages: 5, dpi: 150, pro: [] }, withCredits, 10)).toMatchObject({ allowed: 5, creditsUsed: 5 });
  });

  it("requires Pro for Pro choices and print quality", () => {
    expect(() => decide({ pages: 1, dpi: 300, pro: [] }, free, 0)).toThrowError(/Pro/);
    expect(() => decide({ pages: 1, dpi: 150, pro: ["style:celeste"] }, free, 0)).toThrowError(/Pro/);
    expect(decide({ pages: 1, dpi: 150, pro: ["style:celeste"] }, { ...free, unlockedStyles: ["celeste"] }, 0).allowed).toBe(1);
  });

  it("spends a plan's pages once the free pages are used", () => {
    const month = plan("month", 800);
    expect(decide({ pages: 40, dpi: 300, pro: ["style:celeste", "effect:photo"] }, month, 0)).toMatchObject({ allowed: 40, creditsUsed: 37, creditsLeft: 763 });
    expect(decide({ pages: 40, dpi: 300, pro: [] }, month, 10)).toMatchObject({ allowed: 40, creditsUsed: 40 });
  });

  it("stops a plan when its pages and the day's free pages are used up", () => {
    expect(() => decide({ pages: 1, dpi: 150, pro: [] }, plan("month", 0), 10)).toThrowError(QuotaError);
    expect(decide({ pages: 5, dpi: 150, pro: [] }, plan("week", 0), 0)).toMatchObject({ allowed: 3 });
  });

  it("gives Week 2K and every hand, but keeps 4K and finishes for Month and Year", () => {
    const week = plan("week", 150);
    expect(decide({ pages: 2, dpi: 200, pro: ["style:celeste", "paper:kraft", "pen:fountain"] }, week, 0).allowed).toBe(2);
    expect(() => decide({ pages: 1, dpi: 300, pro: [] }, week, 0)).toThrowError(/Pro/);
    expect(() => decide({ pages: 1, dpi: 200, pro: ["effect:scan"] }, week, 0)).toThrowError(/Pro/);
    expect(decide({ pages: 1, dpi: 300, pro: ["effect:scan", "transparent"] }, plan("year", 10), 0).allowed).toBe(1);
  });
});
