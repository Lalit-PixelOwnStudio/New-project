import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Tell us how Truehand worked for you. No account needed.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <Prose eyebrow="Feedback" title="How is Truehand working for you?">
      <p>
        A hand that looks wrong, a paper you need, something that got in the way: every message is read, and most of what Truehand does came from someone
        asking. No account needed, and your email is only for a reply.
      </p>
      <FeedbackForm context={{ source: "page" }} title="How would you rate Truehand so far?" />
    </Prose>
  );
}
