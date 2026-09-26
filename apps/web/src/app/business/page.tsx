import { ArrowRight, FileSpreadsheet, Gift, Home, Layers, Mail, Megaphone, Printer, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { PageHero, Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Waitlist } from "./Waitlist";
import s from "./business.module.css";

export const metadata: Metadata = {
  title: "Handwritten letters for business",
  description:
    "Personalised handwritten letters, thank-you cards and envelopes from a spreadsheet, in realistic handwriting. Print-ready PDFs and transparent PNGs.",
  alternates: { canonical: "/business" },
};

const USES = [
  { icon: ShoppingBag, title: "Order thank-yous", body: "A note in every parcel that reads like someone packed it by hand." },
  { icon: Megaphone, title: "Sales outreach", body: "Letters to shortlisted accounts that get opened, because they look personal." },
  { icon: Gift, title: "Fundraising", body: "Thank donors individually, by name, without a week of writing." },
  { icon: Home, title: "Real estate", body: "Neighbourhood letters and just-sold cards with the owner's street in the text." },
  { icon: Mail, title: "Events", body: "Invitations and place cards in a formal script, one per guest." },
  { icon: Layers, title: "Agencies", body: "Transparent PNGs of the writing, ready to drop onto your clients' designs." },
];

export default function BusinessPage() {
  return (
    <main>
      <PageHero
        eyebrow="Truehand for business"
        title="Personal notes, at the scale of a spreadsheet"
        lede="Write one template, upload your list, and get a handwritten letter, card or envelope for every row. Each one is written freshly, so no two copies look the same."
      >
        <div className={s.actions}>
          <ButtonLink href="/batch" size="l">
            <FileSpreadsheet aria-hidden="true" />
            Try batch letters
          </ButtonLink>
          <ButtonLink href="#api" variant="secondary" size="l">
            API early access
          </ButtonLink>
        </div>
      </PageHero>

      <Section label="Where it works" title="Handwriting people actually read">
        <ul className={s.uses}>
          {USES.map((u) => (
            <li key={u.title}>
              <span className={s.icon}>
                <u.icon aria-hidden="true" />
              </span>
              <h3>{u.title}</h3>
              <p>{u.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="What you get" title="Files your printer already understands" tone="page">
        <div className={s.outputs}>
          <div className={s.output}>
            <Printer aria-hidden="true" />
            <h3>One PDF to print</h3>
            <p>Every letter in one file, at the right size for A4, Letter, A6 and 5×7 cards, postcards or DL and #10 envelopes. Print at actual size.</p>
          </div>
          <div className={s.output}>
            <FileSpreadsheet aria-hidden="true" />
            <h3>A file per person</h3>
            <p>A ZIP of PDFs or PNGs named by any column, ready to attach, archive or send to a print partner.</p>
          </div>
          <div className={s.output}>
            <Layers aria-hidden="true" />
            <h3>Transparent PNGs</h3>
            <p>Just the ink on a transparent background in 4K, to place on your own card and envelope artwork.</p>
          </div>
        </div>
      </Section>

      <Section id="api" label="API" title="An API for sending from your own systems">
        <div className={s.api}>
          <div>
            <p className={s.apiText}>
              We&rsquo;re building a REST API on the same engine: send text and a style, get back a PDF or PNG. It is meant for CRMs, e-commerce stores and
              print partners who want handwriting inside their own flow. Tell us what you&rsquo;d use it for and we&rsquo;ll get in touch when it opens.
            </p>
            <pre className={s.code} aria-label="Example API request">
              <code>{`POST /v1/render
{
  "text": "Dear {{first_name}}, thank you…",
  "style": "celeste",
  "paper": "card",
  "size": "a6",
  "format": "pdf"
}`}</code>
            </pre>
          </div>
          <Waitlist />
        </div>
      </Section>

      <Section label="Questions" title="Good to know" tone="page">
        <Faq
          items={[
            {
              q: "Do you print and post the letters?",
              a: "Not today. Truehand writes the letters; you print them yourself or with any print shop. Printing and mailing partners are on the roadmap.",
            },
            {
              q: "Is it real pen and ink?",
              a: "No. It is a very realistic rendering of handwriting for print. If you need letters physically written by a robot pen, that is a different kind of service; Truehand is much cheaper and instant.",
            },
            { q: "How is our customer list handled?", a: "Batch letters run entirely in your browser. The spreadsheet is never uploaded to our servers." },
            {
              q: "What does it cost?",
              a: "Batch letters come with the Month and Year plans, paid once. For API volumes, join the list above and we'll quote per letter.",
            },
          ]}
        />
        <p className={s.more}>
          <a href="/batch">
            Open batch letters <ArrowRight aria-hidden="true" />
          </a>
          <a href="/pricing">
            See pricing <ArrowRight aria-hidden="true" />
          </a>
        </p>
      </Section>
    </main>
  );
}
