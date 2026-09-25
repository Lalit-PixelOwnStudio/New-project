import type { Metadata } from "next";
import { googleEnabled } from "@/server/auth";
import { LoginForm } from "./LoginForm";
import s from "./login.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  return (
    <main className={s.page}>
      <div className={s.box}>
        <p className={s.eyebrow}>Account</p>
        <h1 className={s.title}>Sign in or create an account</h1>
        <p className={s.lede}>We&rsquo;ll email you a six-digit code. No password to remember.</p>
        <LoginForm next={safeNext} google={googleEnabled} />
        <p className={s.fine}>
          Writing never needs an account. You only need one to buy Pro or keep documents in sync.
        </p>
      </div>
    </main>
  );
}
