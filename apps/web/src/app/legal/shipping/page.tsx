import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { BUSINESS, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping and delivery",
  description: "Everything Truehand sells is digital and reaches your account within seconds. Nothing is shipped; available worldwide.",
  alternates: { canonical: "/legal/shipping" },
};

export default function ShippingPage() {
  return (
    <Prose eyebrow="Legal" title="Shipping and delivery" updated={LEGAL_UPDATED}>
      <h2>Nothing is shipped</h2>
      <p>
        Truehand, run by {BUSINESS.legalName}, sells digital services only. There are no physical products, so there is no shipping, no shipping charge and no
        delivery address to give.
      </p>

      <h2>How purchases are delivered</h2>
      <ul>
        <li>
          <strong>Plans</strong> (Week, Month and Year) and <strong>page packs</strong> are added to your Truehand account as soon as the payment is confirmed,
          usually within seconds.
        </li>
        <li>
          <strong>Your own handwriting</strong> is unlocked on your account the same way, for every handwriting you make.
        </li>
        <li>
          <strong>Your pages</strong> are made in your browser and download straight to your device as PDF or image files.
        </li>
      </ul>
      <p>Purchases are tied to the email you sign in with and work on every device where you sign in. Truehand is available worldwide, online.</p>

      <h2>If something hasn&rsquo;t arrived</h2>
      <p>
        If a purchase hasn&rsquo;t appeared on your account within 15 minutes of paying, email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with
        the payment reference from your receipt. We&rsquo;ll add it, or refund you in full. Refunds are covered in the{" "}
        <a href="/legal/refunds">refund policy</a>.
      </p>
    </Prose>
  );
}
