import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Faq } from "@/components/Faq";
import { AdBand } from "@/components/AdBand";
import { PageHero, Section } from "@/components/Section";
import d from "../styles/[id]/detail.module.css";
import { BatchTool } from "./BatchTool";
import s from "./batch.module.css";

export const metadata: Metadata = {
  title: "Batch handwritten letters from a spreadsheet",
  description:
    "Mail-merge handwriting: upload a CSV, write one template with {{fields}}, and download a handwritten letter, card or envelope for every row as PDF or PNG.",
  alternates: { canonical: "/batch" },
};

const STEPS = [
  { title: "Add your list", body: "Paste or upload a CSV exported from Excel, Google Sheets or your CRM. The first row names the columns." },
  { title: "Write one template", body: "Type the letter once and drop in fields like {{first_name}}. Each row fills them in." },
  { title: "Pick the format", body: "A4 or Letter pages, A6 and 5×7 cards, postcards or envelopes, in any hand, paper and pen." },
  { title: "Download them all", body: "A PDF per person, one combined PDF ready for the printer, or transparent PNGs for your own designs." },
];

export default function BatchPage() {
  return (
    <main>
      <PageHero
        eyebrow="Batch letters"
        title="A handwritten letter for everyone on your list"
        lede="Upload a spreadsheet, write one template, and get a different handwritten page for every row, with no two letters looking alike. Everything runs in your browser; your list is never uploaded."
      />
      <AdBand placement="top" tone="page" desktopOnly />
      <div className={d.work}>
        <BatchTool />
        <AdSlot placement="editor" className={d.ad} />
      </div>
      <Section label="How it works" title="From spreadsheet to stack of letters">
        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <span className={s.stepNum}>{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
      </Section>
      <AdBand />
      <Section label="Questions" title="Good to know" tone="page">
        <Faq
          items={[
            {
              q: "Is batch free?",
              a: "You can try it free with the first 3 rows of any list. The Month and Year plans write every row, in 4K, with transparent PNGs and no ads.",
            },
            {
              q: "Does my contact list get uploaded?",
              a: "No. The CSV is read and every letter is drawn inside your browser. Nothing in your list is sent to our servers.",
            },
            {
              q: "How do I print envelopes?",
              a: "Choose DL or #10 envelope, download one combined PDF, and print it with your printer's envelope setting at actual size. The writing is placed in the address area.",
            },
            {
              q: "Can you print and post them for me?",
              a: "Not yet. Truehand writes the letters; any printer or local print shop can print them. An API for automated sending is planned; join the list on the business page.",
            },
          ]}
        />
      </Section>
    </main>
  );
}
