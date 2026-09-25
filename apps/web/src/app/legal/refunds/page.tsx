import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { RAZORPAY_ABROAD } from "@/lib/pricing";
import { BUSINESS, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = { title: "Refunds, cancellation and delivery", alternates: { canonical: "/legal/refunds" } };

export default function RefundsPage() {
  return (
    <Prose eyebrow="Legal" title="Refunds, cancellation and delivery" updated={LEGAL_UPDATED}>
      <h2>Delivery</h2>
      <p>
        Everything Truehand sells is digital. Plans (Week, Month and Year), their pages, page packs and the Your own handwriting unlock are added to your
        account as soon as the payment is confirmed, usually within seconds. Nothing is shipped (see <a href="/legal/shipping">shipping and delivery</a>). If a
        purchase hasn&rsquo;t appeared after 15 minutes, email us with your payment reference.
      </p>

      <h2>No subscriptions to cancel</h2>
      <p>All purchases are one-time payments. Nothing renews automatically, so there is nothing to cancel: a plan simply ends on its end date.</p>

      <h2>Refunds</h2>
      <ul>
        <li>
          <strong>Within 7 days of buying</strong>, if Truehand didn&rsquo;t work for you, write to us and we&rsquo;ll refund the unused part of a plan, or
          unused pages from a page pack, in full.
        </li>
        <li>
          <strong>Charged twice or for the wrong thing</strong>: we refund the extra charge in full, at any time.
        </li>
        <li>The Your own handwriting unlock is refundable within 7 days if you haven&rsquo;t downloaded any pages written in your handwriting.</li>
      </ul>
      <p>
        Refunds go back to the original payment method. Razorpay refunds usually arrive in 5 to 7 working days
        {RAZORPAY_ABROAD ? "" : "; PayPal refunds usually within 3 to 5"}. Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> from the address on
        your account, with the payment reference from your receipt.
      </p>

      <h2>Your legal rights</h2>
      <p>This policy adds to, and does not replace, any rights you have under consumer law where you live.</p>
    </Prose>
  );
}
