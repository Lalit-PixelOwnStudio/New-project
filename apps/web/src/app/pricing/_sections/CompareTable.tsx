import { PAPERS, PENS, STYLES } from "@truehand/catalog";
import { Section } from "@/components/Section";
import { LIMITS, PLANS } from "@/lib/plans";
import { resolutionName } from "@/lib/resolution";
import s from "../pricing.module.css";
import { freePapers, freePens, freeStyles, pages, type PriceBook } from "./data";

/** Every plan's limits and features in one table. */
export function CompareTable({ book }: { book: PriceBook }) {
  const free = LIMITS.free;
  return (
    <Section label="Compare" title="Every plan, side by side" tone="page">
      <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Plan comparison">
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Feature</span>
              </th>
              <th scope="col">Free</th>
              <th scope="col">Week</th>
              <th scope="col">Month</th>
              <th scope="col">Year</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Price",
                book.currency === "INR" ? "₹0" : "$0",
                book.price("pass_week").display,
                book.price("pass_month").display,
                book.price("pass_year").display,
              ],
              ["Lasts", "Always", "7 days", "1 month", "1 year"],
              ["Pages", `${free.pagesPerDay} a day`, pages(PLANS.week.pages), pages(PLANS.month.pages), pages(PLANS.year.pages)],
              [
                "Quality",
                resolutionName(LIMITS.free.maxDpi),
                resolutionName(LIMITS.week.maxDpi),
                resolutionName(LIMITS.month.maxDpi),
                resolutionName(LIMITS.year.maxDpi),
              ],
              ["Handwritings", `${freeStyles}`, `${STYLES.length}`, `${STYLES.length}`, `${STYLES.length}`],
              ["Papers", `${freePapers}`, `${PAPERS.length}`, `${PAPERS.length}`, `${PAPERS.length}`],
              ["Pens and ink", `${freePens} ballpoints`, `${PENS.length} + any colour`, `${PENS.length} + any colour`, `${PENS.length} + any colour`],
              ["Scanned and photo finishes", "Preview", "Preview", "Yes", "Yes"],
              ["Your own handwriting", `Make free, ${book.price("my_hand").display} to download`, "Included", "Included", "Included"],
              ["Batch letters", "—", "—", "Yes", "Yes"],
              ["Transparent PNG", "—", "—", "Yes", "Yes"],
              ["Ads", "Yes", "None", "None", "None"],
              ["Watermark", "None", "None", "None", "None"],
            ].map(([f, ...cells]) => (
              <tr key={f}>
                <th scope="row">{f}</th>
                {cells.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
