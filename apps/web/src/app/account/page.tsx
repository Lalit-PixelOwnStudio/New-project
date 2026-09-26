import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero, Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { planName } from "@/lib/plans";
import { formatMoney, PRODUCTS, type Currency, type ProductId } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { accountOverview } from "@/server/services/account";
import { AccountActions } from "./AccountActions";
import s from "./account.module.css";

export const metadata: Metadata = { title: "Account", robots: { index: false } };
export const dynamic = "force-dynamic";

const date = (d: Date | string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");
  const { entitlements: ent, orders } = await accountOverview(user.id);
  const paid = orders.filter((o) => o.status === "paid");

  return (
    <main>
      <PageHero eyebrow="Account" title={ent.plan === "free" ? "You're on Free." : `You're on the ${planName(ent.plan)}.`} lede={user.email} />
      <Section label="Your plan" tone="page">
        <dl className={s.facts}>
          <div>
            <dt>Plan</dt>
            <dd>{ent.plan === "free" ? "Free, with ads" : planName(ent.plan)}</dd>
          </div>
          <div>
            <dt>Plan until</dt>
            <dd>{ent.proUntil ? date(ent.proUntil) : "—"}</dd>
          </div>
          <div>
            <dt>Pages left</dt>
            <dd>{ent.credits}</dd>
          </div>
          <div>
            <dt>Your own handwriting</dt>
            <dd>{ent.plan !== "free" || ent.unlockedStyles.includes("mine") ? "Unlocked" : "Free to make; locked for downloads"}</dd>
          </div>
        </dl>
        <div className={s.row}>
          <ButtonLink href="/pricing">{ent.plan === "free" ? "See plans" : "Add pages or time"}</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Write something
          </ButtonLink>
        </div>
      </Section>
      <Section label="Receipts">
        {paid.length ? (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Paid</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((o) => (
                <tr key={o.id}>
                  <td>{date(o.paidAt ?? o.createdAt)}</td>
                  <td>
                    {PRODUCTS[o.product as ProductId]?.name ?? o.product}
                    {o.styleId ? ` (${o.styleId})` : ""}
                  </td>
                  <td>{formatMoney(o.amount, o.currency as Currency)}</td>
                  <td className={s.mono}>{o.providerPaymentId ?? o.providerOrderId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={s.empty}>No purchases yet.</p>
        )}
      </Section>
      <Section label="Account" tone="page">
        <AccountActions />
      </Section>
    </main>
  );
}
