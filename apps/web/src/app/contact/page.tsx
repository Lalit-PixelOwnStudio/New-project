import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <Prose eyebrow="Contact" title="Talk to us">
      <p>
        For help with a purchase, a refund, your account, or anything else, email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. We usually reply
        within one working day.
      </p>
      <p>For purchases, include the payment reference from your receipt or the account page, so we can find it quickly.</p>
      <h2>Business and API</h2>
      <p>
        Sending letters at volume, or want handwriting inside your own product? Join the API list on the <a href="/business#api">business page</a>, or email us
        with what you have in mind.
      </p>
      <h2>Company</h2>
      <p>
        {BUSINESS.legalName}
        {BUSINESS.address && (
          <>
            <br />
            {BUSINESS.address}
          </>
        )}
        {BUSINESS.phone && (
          <>
            <br />
            Phone: {BUSINESS.phone}
          </>
        )}
        <br />
        Email: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
      </p>
    </Prose>
  );
}
