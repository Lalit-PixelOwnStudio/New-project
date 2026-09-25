import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero, Section } from "@/components/Section";
import { ButtonLink } from "@/components/ui/Button";
import { formatMoney, PRODUCTS, type Currency, type ProductId } from "@/lib/pricing";
import { currentUser } from "@/server/auth";
import { db, schema } from "@/server/db";
import { getEntitlements } from "@/server/entitlements";
import { AccountActions } from "./AccountActions";
import s from "./account.module.css";

export const metadata: Metadata = { title: "Account", robots: { index: false } };
export const dynamic = "force-dynamic";

const date = (d: Date | string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");
  const ent = await getEntitlements(user.id);
  const orders = await db.select().from(schema.orders).where(eq(schema.orders.userId, user.id)).orderBy(desc(schema.orders.createdAt)).limit(50);
  const paid = orders.filter((o) => o.status === "paid");

  return (
    <main>
      <PageHero eyebrow="Account" title={ent.plan === "pro" ? "You're on Pro." : "You're on Free."} lede={user.email} />
      <Section label="Plan" index="01">
        <dl className={s.facts}>
          <div>
            <dt>Plan</dt>
            <dd>{ent.plan === "pro" ? "Pro" : "Free, with ads"}</dd>
          </div>
          <div>
            <dt>Pro until</dt>
            <dd>{ent.proUntil ? date(ent.proUntil) : "—"}</dd>
          </div>
          <div>
            <dt>Page credits</dt>
            <dd>{ent.credits}</dd>
          </div>
          <div>
            <dt>Hands you own</dt>
            <dd>{ent.unlockedStyles.length ? ent.unlockedStyles.join(", ") : "—"}</dd>
          </div>
        </dl>
        <div className={s.row}>
          <ButtonLink href="/pricing">{ent.plan === "pro" ? "Add more time" : "Get Pro"}</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Write something
          </ButtonLink>
        </div>
      </Section>
      <Section label="Receipts" index="02">
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
      <Section label="Account" index="03">
        <AccountActions />
      </Section>
    </main>
  );
}
