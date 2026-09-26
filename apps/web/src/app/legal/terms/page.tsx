import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { BUSINESS, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms for using Truehand: fair use, accounts, plans and one-time payments, and your rights.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <Prose eyebrow="Legal" title="Terms of use" updated={LEGAL_UPDATED}>
      <p>
        These terms are an agreement between you and {BUSINESS.legalName} for using Truehand. By using the site you accept them. If you don&rsquo;t, please
        don&rsquo;t use Truehand.
      </p>

      <h2>What Truehand is</h2>
      <p>
        Truehand turns text you provide into images and PDFs that look handwritten. The free version is supported by advertising and has usage limits. Plans,
        page packs and style unlocks are paid one-time purchases that add pages and features for the period or scope described at the time of purchase.
      </p>

      <h2>Your content</h2>
      <p>
        You own the text you write and the files you create with Truehand, and you may use them for any lawful purpose, including commercially. You are
        responsible for having the right to use any text you enter, and for how you use the output.
      </p>

      <h2>Use it honestly</h2>
      <p>You agree not to use Truehand to:</p>
      <ul>
        <li>
          forge signatures, or create documents meant to deceive someone about who wrote them where that matters legally (contracts, prescriptions, official
          forms, wills and the like);
        </li>
        <li>break the rules of a school, university or examination that requires work to be handwritten by you personally;</li>
        <li>harass, defraud or impersonate anyone, or send spam;</li>
        <li>attack, overload, scrape or reverse-engineer the service, or get around its limits in automated ways.</li>
      </ul>

      <h2>Accounts</h2>
      <p>
        You must be at least 13 to create an account. Keep access to your email secure, because sign-in codes are sent there. You can delete your account at any
        time from the account page; remaining plan time and pages are deleted with it.
      </p>

      <h2>Payments</h2>
      <p>
        Prices are shown before you pay, in rupees in India and US dollars elsewhere, and include any taxes we are required to collect unless stated otherwise.
        Purchases do not renew automatically. Refunds are covered by the <Link href="/legal/refunds">refund policy</Link>.
      </p>

      <h2>Fonts and third-party components</h2>
      <p>
        The handwriting styles are based on open-source fonts used under the SIL Open Font License and the Apache License 2.0; see{" "}
        <Link href="/credits">font credits</Link>. Those licences apply to the fonts themselves, not to the images you create.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep Truehand available and correct, but it is provided &ldquo;as is&rdquo;, without warranties of any kind to the extent the law allows. We
        may change or discontinue features; if we discontinue a paid feature before your purchase period ends, we will refund the unused portion.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, our total liability to you for any claim about Truehand is limited to the amount you paid us in the 12 months before the
        claim. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by the laws of {BUSINESS.country}. If you are a consumer, you also keep the protections of the law where you live. Questions:{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>
    </Prose>
  );
}
