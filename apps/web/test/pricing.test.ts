import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/plans";
import { formatMoney, priceFor, PRODUCTS, regionFor, regionForCheckout, yearlyPerMonth } from "@/lib/pricing";

describe("regional pricing", () => {
  it("maps countries to regions and providers", () => {
    expect(regionFor("IN")).toBe("IN");
    expect(regionFor("in")).toBe("IN");
    expect(regionFor("US")).toBe("A");
    expect(regionFor("BR")).toBe("B");
    expect(regionFor("PK")).toBe("C");
    expect(regionFor(null)).toBe("A");
    expect(priceFor("pass_month", "IN").provider).toBe("razorpay");
    expect(priceFor("pass_month", "DE").provider).toBe("paypal");
  });

  it("charges India in rupees and everyone else in dollars", () => {
    expect(priceFor("pass_month", "IN")).toMatchObject({ currency: "INR", amount: 14900, display: "₹149" });
    expect(priceFor("pass_month", "US")).toMatchObject({ currency: "USD", amount: 599, display: "$5.99" });
    expect(priceFor("pass_year", "US").display).toBe("$39");
  });

  it("orders tiers from richest to cheapest", () => {
    for (const p of ["pass_week", "pass_month", "pass_year", "pages_100", "style"] as const) {
      expect(priceFor(p, "US").amount).toBeGreaterThanOrEqual(priceFor(p, "BR").amount);
      expect(priceFor(p, "BR").amount).toBeGreaterThanOrEqual(priceFor(p, "PK").amount);
    }
  });

  it("formats money", () => {
    expect(formatMoney(99900, "INR")).toBe("₹999");
    expect(formatMoney(99, "USD")).toBe("$0.99");
    expect(yearlyPerMonth("US")).toBe("$3.25");
  });

  it("lets India pay in dollars, and nobody else pay in rupees", () => {
    expect(regionForCheckout("IN", "USD")).toBe("A");
    expect(regionForCheckout("IN", "INR")).toBe("IN");
    expect(regionForCheckout("IN", null)).toBe("IN");
    expect(regionForCheckout("US", "INR")).toBe("A");
    expect(regionForCheckout("PK", "INR")).toBe("C");
    expect(priceFor("pass_month", "IN", "USD")).toMatchObject({ currency: "USD", display: "$5.99", provider: "paypal" });
  });

  it("gives each plan its pages", () => {
    expect(PRODUCTS.pass_week.grant).toEqual({ plan: "week", credits: PLANS.week.pages });
    expect(PRODUCTS.pass_month.grant).toEqual({ plan: "month", credits: PLANS.month.pages });
    // Year has no page limit, so it needs no page credits.
    expect(PRODUCTS.pass_year.grant).toEqual({ plan: "year" });
  });
});
