"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useEntitlements } from "@/lib/entitlements-client";
import type { Currency, ProductId } from "@/lib/pricing";
import { Button } from "./ui/Button";
import s from "./BuyButton.module.css";

interface CheckoutStart {
  orderId: string;
  provider: "razorpay" | "paypal";
  providerOrderId: string;
  amount: number;
  currency: string;
  description: string;
  razorpayKey?: string;
  email: string;
  name: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void; on(event: string, cb: (r: unknown) => void): void };
    paypal?: { Buttons(options: Record<string, unknown>): { render(el: HTMLElement): Promise<void>; close?: () => void } };
  }
}

const scripts = new Map<string, Promise<void>>();
function loadScript(src: string) {
  let p = scripts.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => {
        scripts.delete(src);
        reject(new Error("Couldn't load the payment window. Check your connection or ad blocker."));
      };
      document.head.appendChild(el);
    });
    scripts.set(src, p);
  }
  return p;
}

/**
 * Starts a one-time purchase. India pays through Razorpay Checkout (UPI,
 * cards, net banking); everyone else through PayPal. Signing in is required
 * first so the purchase lands on an account.
 */
export function BuyButton({
  product,
  currency,
  children,
  variant = "primary",
  wide,
  size = "m",
}: {
  product: ProductId;
  /** Only honoured for India, which may pay in USD instead of INR. */
  currency?: Currency;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  wide?: boolean;
  size?: "s" | "m" | "l";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { refresh } = useEntitlements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [paypal, setPaypal] = useState<CheckoutStart | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const succeed = async () => {
    await refresh();
    setDone(true);
    setPaypal(null);
    router.refresh();
  };

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, currency }),
      });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname + window.location.search)}`);
        return;
      }
      const data = (await res.json()) as CheckoutStart & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      if (data.provider === "razorpay") {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!window.Razorpay || !data.razorpayKey) throw new Error("Razorpay is unavailable");
        const rzp = new window.Razorpay({
          key: data.razorpayKey,
          order_id: data.providerOrderId,
          amount: data.amount,
          currency: data.currency,
          name: "Truehand",
          description: data.description,
          prefill: { email: data.email, name: data.name },
          theme: { color: "#111216" },
          handler: async (resp: Record<string, string>) => {
            const verify = await fetch("/api/checkout/razorpay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            if (verify.ok) await succeed();
            else setError("Payment received, but we couldn't confirm it yet. It will apply automatically within a few minutes.");
          },
          modal: { ondismiss: () => setBusy(false) },
        });
        rzp.on("payment.failed", () => setError("The payment didn't go through. You haven't been charged."));
        rzp.open();
      } else {
        setPaypal(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  // PayPal renders its own buttons into a dialog once the order exists.
  useEffect(() => {
    if (!paypal) return;
    dialog.current?.showModal();
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal is not configured yet.");
      return;
    }
    let cancelled = false;
    loadScript(`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons`)
      .then(() => {
        if (cancelled || !window.paypal || !paypalRef.current) return;
        paypalRef.current.innerHTML = "";
        return window.paypal
          .Buttons({
            style: { layout: "vertical", color: "black", shape: "rect", label: "pay" },
            createOrder: () => paypal.providerOrderId,
            onApprove: async (data: { orderID: string }) => {
              const res = await fetch("/api/checkout/paypal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paypalOrderId: data.orderID }),
              });
              if (res.ok) await succeed();
              else setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Payment failed");
            },
            onError: () => setError("PayPal ran into a problem. You haven't been charged."),
          })
          .render(paypalRef.current);
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [paypal]);

  if (done) {
    return (
      <p className={s.done} role="status">
        Done. It&rsquo;s on your account now.
      </p>
    );
  }

  return (
    <>
      <Button type="button" variant={variant} wide={wide} size={size} onClick={start} disabled={busy}>
        {busy ? "Opening checkout…" : children}
      </Button>
      {error && !paypal && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <dialog ref={dialog} className={s.dialog} onClose={() => setPaypal(null)} aria-label="Pay with PayPal">
        {paypal && (
          <div className={s.pay}>
            <p className={s.summary}>
              <span>{paypal.description}</span>
              <strong>${(paypal.amount / 100).toFixed(2)}</strong>
            </p>
            <div ref={paypalRef} className={s.buttons} />
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <button type="button" className={s.cancel} onClick={() => dialog.current?.close()}>
              Cancel
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
