import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookies and local storage",
  description: "The cookies and browser storage Truehand uses, what each one is for, and how to clear them.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <Prose eyebrow="Legal" title="Cookies and local storage" updated={LEGAL_UPDATED}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Set by</th>
            <th>Purpose</th>
            <th>Lasts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session cookie</td>
            <td>Truehand</td>
            <td>Keeps you signed in. Strictly necessary.</td>
            <td>Up to 60 days</td>
          </tr>
          <tr>
            <td>th_anon</td>
            <td>Truehand</td>
            <td>A random ID that applies the free daily download limit when you&rsquo;re not signed in. Strictly necessary.</td>
            <td>1 year</td>
          </tr>
          <tr>
            <td>truehand:settings (local storage)</td>
            <td>Truehand</td>
            <td>Remembers your current text and settings in this browser. Never sent to us.</td>
            <td>Until you clear it</td>
          </tr>
          <tr>
            <td>Advertising cookies</td>
            <td>Google and its partners</td>
            <td>Show and measure ads for free users; personalise them only with consent where required.</td>
            <td>Varies, see Google&rsquo;s policy</td>
          </tr>
        </tbody>
      </table>
      <p>
        Where the law requires consent for advertising cookies (the EEA, the UK and Switzerland), you&rsquo;ll be asked before they are used, and you can change
        your choice at any time from the &ldquo;Privacy and cookie settings&rdquo; link that appears at the bottom of the page. Pro members get no advertising
        cookies at all.
      </p>
    </Prose>
  );
}
