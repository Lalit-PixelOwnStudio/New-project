import { describe, expect, it } from "vitest";
import { FREE_ENTITLEMENTS, LIMITS, type Entitlements } from "@/lib/plans";
import { decide, QuotaError } from "@/server/quota";

const free: Entitlements = FREE_ENTITLEMENTS;
const pro: Entitlements = { ...FREE_ENTITLEMENTS, plan: "pro", limits: LIMITS.pro, signedIn: true };

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

  it("lets Pro export long documents at 300 dpi", () => {
    expect(decide({ pages: 40, dpi: 300, pro: ["style:celeste", "effect:photo"] }, pro, 500)).toMatchObject({ allowed: 40, creditsUsed: 0 });
  });
});
