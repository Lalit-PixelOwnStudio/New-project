import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { RAZORPAY_ABROAD } from "@/lib/pricing";
import { BUSINESS, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Truehand collects, what stays in your browser, and how accounts and payments are handled. Your text is never uploaded.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <Prose eyebrow="Legal" title="Privacy policy" updated={LEGAL_UPDATED}>
      <p>
        This policy explains what {BUSINESS.legalName} (&ldquo;Truehand&rdquo;, &ldquo;we&rdquo;) collects when you use truehand.app, why, and what you can do
        about it. The short version: the text you write is turned into handwriting on your own device and is not sent to us.
      </p>

      <h2>What never leaves your device</h2>
      <p>
        The text you type or paste, the spreadsheets you load into batch letters, and the pages and files you download are processed entirely in your browser.
        We do not receive, store or read them. Your current draft and settings are saved in your browser&rsquo;s local storage so they are there when you come
        back; clearing your browser data removes them.
      </p>

      <h2>What we collect</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Why</th>
            <th>Kept for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email address (and name and picture if you sign in with Google)</td>
            <td>To create your account, sign you in and send sign-in codes and receipts</td>
            <td>Until you delete your account</td>
          </tr>
          <tr>
            <td>Purchases: product, amount, currency, country, payment reference</td>
            <td>To give you what you bought, handle refunds and meet tax and accounting law</td>
            <td>As long as the law requires (usually 8 years for accounting records)</td>
          </tr>
          <tr>
            <td>Download counts: number of pages, resolution and time, linked to your account or an anonymous browser ID</td>
            <td>To apply the free daily limit and page credits</td>
            <td>90 days</td>
          </tr>
          <tr>
            <td>Session cookie and technical logs (IP address, browser)</td>
            <td>To keep you signed in, protect against abuse and fix problems</td>
            <td>Sessions: up to 60 days. Logs: up to 30 days</td>
          </tr>
          <tr>
            <td>Feedback you send: a rating, your comment and email if you add them, and the settings used (hand, paper, pages), never your text</td>
            <td>To find what to fix and improve, and to reply if you asked</td>
            <td>Up to 2 years, or until you ask us to delete it</td>
          </tr>
          <tr>
            <td>API waitlist details you submit</td>
            <td>To contact you about business API access</td>
            <td>Until you ask us to remove them, or the API launches</td>
          </tr>
        </tbody>
      </table>

      <h2>Payments</h2>
      <p>
        Payments are handled by {RAZORPAY_ABROAD ? "Razorpay" : "Razorpay (in India) and PayPal (elsewhere)"}. They receive your payment details directly; we
        never see or store card numbers or UPI credentials. Their own privacy policies apply to the data they process.
      </p>

      <h2>Advertising</h2>
      <p>
        The free version shows ads served by Google AdSense. Google and its partners may use cookies to show and measure ads, and, where you have agreed, to
        personalise them. Visitors in the EEA, the UK and Switzerland are asked for consent first through a Google-certified consent tool; without consent only
        non-personalised ads are shown. You can manage personalised advertising at <a href="https://adssettings.google.com">adssettings.google.com</a>. Pro
        members see no ads, and no ad code is loaded for them.
      </p>

      <h2>Service providers</h2>
      <p>
        We use a small number of providers to run the service: our hosting and database providers, an email delivery service for sign-in codes, and the payment
        and advertising providers above. They process data only to provide their service to us.
      </p>

      <h2>Your rights</h2>
      <p>
        Wherever you live, you can ask for a copy of your data, ask us to correct it, or delete your account and its data at any time from the account page.
        Depending on where you live (including under the EU and UK GDPR and India&rsquo;s Digital Personal Data Protection Act, 2023) you may also have the
        right to object to or restrict processing and to complain to your data protection authority. Write to{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> and we&rsquo;ll reply within 30 days.
      </p>

      <h2>Children</h2>
      <p>
        Truehand is not directed at children under 13, and you must be at least 13 (or the minimum age of digital consent where you live, if higher) to create
        an account.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy in a way that matters, we&rsquo;ll update the date above and, for significant changes, tell signed-in users by email.</p>

      <h2>Contact</h2>
      <p>
        {BUSINESS.legalName}
        {BUSINESS.address ? `, ${BUSINESS.address}` : ""}. Email: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
      </p>
    </Prose>
  );
}
