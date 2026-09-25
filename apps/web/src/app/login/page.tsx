import type { Metadata } from "next";
import { googleEnabled } from "@/server/auth";
import { LoginForm } from "./LoginForm";
import s from "./login.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  // Coming from making your own handwriting: say why an account is needed.
  const forHand = safeNext.startsWith("/my-handwriting");
  return (
    <main className={s.page}>
      <div className={s.box}>
        <p className={s.eyebrow}>Account</p>
        <h1 className={s.title}>{forHand ? "Sign in to make your handwriting" : "Sign in or create an account"}</h1>
        <p className={s.lede}>We&rsquo;ll email you a six-digit code. No password to remember.</p>
        <LoginForm next={safeNext} google={googleEnabled} />
        <p className={s.fine}>
          {forHand
            ? "Signing up is free. Your handwriting is saved to your account, so it's there on every device."
            : "Writing never needs an account. You only need one to buy a plan, make your own handwriting, or keep documents in sync."}
        </p>
      </div>
    </main>
  );
}
