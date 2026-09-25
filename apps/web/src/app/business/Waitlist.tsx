"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import s from "./business.module.css";

export function Waitlist() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Something went wrong. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <div className={s.form}>
        <h3>You&rsquo;re on the list.</h3>
        <p className={s.formNote}>We&rsquo;ll email you when API access opens. Until then, batch letters in the browser can do most of it.</p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={submit}>
      <h3>Get API early access</h3>
      <label>
        <span>Work email</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        <span>Company</span>
        <input name="company" autoComplete="organization" />
      </label>
      <label>
        <span>Letters per month</span>
        <select name="volume" defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option>Under 500</option>
          <option>500 – 5,000</option>
          <option>5,000 – 50,000</option>
          <option>Over 50,000</option>
        </select>
      </label>
      <label>
        <span>What would you send?</span>
        <textarea name="useCase" rows={3} />
      </label>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="l" wide disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Join the list"}
      </Button>
    </form>
  );
}
