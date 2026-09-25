import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCheckoutSignature, verifyWebhookSignature } from "@/server/payments/razorpay";

describe("razorpay signatures", () => {
  it("accepts a valid checkout signature and rejects tampering", () => {
    const sig = createHmac("sha256", "secret").update("order_1|pay_1").digest("hex");
    expect(verifyCheckoutSignature("order_1", "pay_1", sig, "secret")).toBe(true);
    expect(verifyCheckoutSignature("order_1", "pay_2", sig, "secret")).toBe(false);
    expect(verifyCheckoutSignature("order_1", "pay_1", sig, "other")).toBe(false);
    expect(verifyCheckoutSignature("order_1", "pay_1", "zz", "secret")).toBe(false);
  });

  it("verifies webhook bodies", () => {
    const body = JSON.stringify({ event: "payment.captured" });
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "whsec")).toBe(true);
    expect(verifyWebhookSignature(body + " ", sig, "whsec")).toBe(false);
    expect(verifyWebhookSignature(body, sig, "")).toBe(false);
  });
});
