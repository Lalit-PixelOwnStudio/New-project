"use client";
import { CheckCircle2, Star } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import s from "./FeedbackForm.module.css";

export interface FeedbackContext {
  source: "download" | "page" | "guide";
  guide?: string;
  style?: string;
  paper?: string;
  pen?: string;
  pages?: number;
  format?: "pdf" | "png" | "zip";
  dpi?: number;
  effect?: string;
}

const KEY = "th_feedback_at";
/** After someone sends or skips feedback, the download popup doesn't ask again for this long. */
const QUIET_DAYS = 14;

/** Whether the download popup should ask for feedback on this device. */
export function feedbackDue() {
  try {
    const at = Number(localStorage.getItem(KEY) ?? 0);
    return Date.now() - at > QUIET_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function markAsked() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    // Storage blocked: we may ask again next time.
  }
}

const SCALE = [1, 2, 3, 4, 5] as const;

/**
 * A 1–5 rating, then an optional comment and email. Sends the settings in
 * `context` along with it, never the text that was written.
 */
export function FeedbackForm({
  context,
  title = "How did your pages come out?",
  labels = ["Not usable", "Poor", "Okay", "Good", "Perfect"],
  onSkip,
}: {
  context: FeedbackContext;
  title?: string;
  /** What each number of stars means, from one to five. */
  labels?: [string, string, string, string, string];
  onSkip?: () => void;
}) {
  const id = useId();
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? rating;
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async () => {
    if (!rating) return;
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message: message.trim() || undefined, email: email.trim(), context }),
      });
      if (!res.ok) throw new Error(String(res.status));
      markAsked();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <p className={s.thanks} role="status">
        <CheckCircle2 aria-hidden="true" />
        Thanks. We read every message.
      </p>
    );
  }

  return (
    <form
      className={s.form}
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      <fieldset className={s.rating}>
        <legend>{title}</legend>
        <div className={s.stars} onMouseLeave={() => setHover(null)}>
          {SCALE.map((n) => (
            <label key={n} className={s.star} data-on={shown !== null && n <= shown ? "" : undefined} onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name={`${id}-rating`}
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                aria-label={`${n} ${n === 1 ? "star" : "stars"}, ${labels[n - 1]}`}
              />
              <Star aria-hidden="true" />
            </label>
          ))}
          <span className={s.meaning} aria-hidden="true">
            {shown !== null ? labels[shown - 1] : "Tap a star"}
          </span>
        </div>
      </fieldset>

      {rating !== null && (
        <>
          <label className={s.field}>
            <span>
              {rating <= 3 ? (context.source === "guide" ? "What was missing or unclear?" : "What went wrong?") : "What would make it even better?"} (optional)
            </span>
            <textarea
              rows={3}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={rating <= 3 ? "A letter looked off, the spacing, the paper…" : "A hand, a paper, a feature you'd like…"}
            />
          </label>
          <label className={s.field}>
            <span>Email, if you&rsquo;d like a reply (optional)</span>
            <input type="email" autoComplete="email" maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
        </>
      )}

      {state === "error" && (
        <p className={s.error} role="alert">
          Couldn&rsquo;t send that just now. Please try again in a moment.
        </p>
      )}

      <div className={s.actions}>
        <Button type="submit" size="s" disabled={!rating || state === "sending"}>
          {state === "sending" ? "Sending…" : "Send feedback"}
        </Button>
        {onSkip && (
          <button
            type="button"
            className={s.skip}
            onClick={() => {
              markAsked();
              onSkip();
            }}
          >
            Not now
          </button>
        )}
      </div>
    </form>
  );
}
