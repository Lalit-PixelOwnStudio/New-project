import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/Section";
import { currentUser } from "@/server/auth";
import { feedbackSummary, isAdmin } from "@/server/feedback";
import s from "./admin.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Feedback", robots: { index: false, follow: false } };

const when = (d: Date) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

type Context = {
  source?: string;
  guide?: string;
  style?: string;
  paper?: string;
  pen?: string;
  pages?: number;
  format?: string;
  dpi?: number;
  plan?: string;
  country?: string | null;
};

/** Everything people said after downloading, newest first. For ADMIN_EMAILS only. */
export default async function FeedbackAdmin() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/admin/feedback");
  if (!isAdmin(user.email)) notFound();
  const { total, average, byRating, latest } = await feedbackSummary();
  const most = Math.max(1, ...Object.values(byRating));

  return (
    <main className={s.page}>
      <PageHero
        eyebrow="Admin"
        title="Feedback"
        lede={`${total} ${total === 1 ? "response" : "responses"}. Times are India time; the latest 200 are listed.`}
      />
      <div className={s.body}>
        <section className={s.summary} aria-label="Ratings">
          <div className={s.average}>
            <strong>{average ? average.toFixed(1) : "—"}</strong>
            <span>average out of 5</span>
          </div>
          <ol className={s.bars}>
            {[5, 4, 3, 2, 1].map((r) => (
              <li key={r}>
                <span className={s.barLabel}>{r}</span>
                <span className={s.bar}>
                  <span style={{ width: `${((byRating[r] ?? 0) / most) * 100}%` }} />
                </span>
                <span className={s.barCount}>{byRating[r] ?? 0}</span>
              </li>
            ))}
          </ol>
        </section>

        {latest.length === 0 ? (
          <p className={s.empty}>No feedback yet. It appears here as soon as someone sends some.</p>
        ) : (
          <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Feedback">
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Message</th>
                  <th scope="col">Email</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((f) => {
                  const c = (f.context ?? {}) as Context;
                  const details = [
                    c.style,
                    c.paper,
                    c.pages ? `${c.pages} ${c.pages === 1 ? "page" : "pages"}` : null,
                    c.format?.toUpperCase(),
                    c.plan,
                    c.country,
                    c.source === "page" ? "feedback page" : null,
                    c.source === "guide" ? `guide: ${c.guide}` : null,
                  ].filter(Boolean);
                  return (
                    <tr key={f.id}>
                      <td className={s.nowrap}>{when(f.createdAt)}</td>
                      <td>
                        <span className={s.rating} data-low={f.rating <= 2 || undefined}>
                          {f.rating}
                        </span>
                      </td>
                      <td className={s.message}>{f.message ?? <span className={s.muted}>—</span>}</td>
                      <td>{f.email ? <a href={`mailto:${f.email}`}>{f.email}</a> : <span className={s.muted}>—</span>}</td>
                      <td className={s.details}>{details.join(" · ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
