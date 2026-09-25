"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./login.module.css";

export function LoginForm({ next, google }: { next: string; google: boolean }) {
  const router = useRouter();
  const { refresh } = useEntitlements();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" });
    setBusy(false);
    if (error) setError(error.message ?? "Couldn't send the code. Check the address and try again.");
    else setStep("code");
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await authClient.signIn.emailOtp({ email: email.trim(), otp: code.trim() });
    if (error) {
      setBusy(false);
      setError(error.message ?? "That code didn't work. Check it, or send a new one.");
      return;
    }
    await refresh();
    router.push(next);
    router.refresh();
  };

  return (
    <div className={s.form}>
      {step === "email" ? (
        <form onSubmit={send} className={s.stack}>
          <label className={s.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={s.input}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button type="submit" size="l" wide disabled={busy}>
            {busy ? "Sending…" : "Email me a code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className={s.stack}>
          <label className={s.label} htmlFor="code">
            Code sent to {email}
          </label>
          <input
            id="code"
            className={`${s.input} ${s.code}`}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
          />
          <Button type="submit" size="l" wide disabled={busy || code.length !== 6}>
            {busy ? "Checking…" : "Sign in"}
          </Button>
          <button type="button" className={s.link} onClick={() => setStep("email")}>
            Use a different email
          </button>
        </form>
      )}
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      {google && step === "email" && (
        <>
          <div className={s.or}>
            <span>or</span>
          </div>
          <Button type="button" variant="secondary" size="l" wide onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next })}>
            Continue with Google
          </Button>
        </>
      )}
    </div>
  );
}
