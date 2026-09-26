import { list, PUBLISHED, sample } from "../blocks";
import type { BlogPost } from "../types";

const HEADER = ["Date: [DD/MM/YYYY]", "", "To", "[Manager's name]", "[Designation]", "[Company name], [City]", ""];
const SIGN_OFF = ["Yours sincerely,", "[Your name]", "[Designation], Employee ID [ID]"];

const post: BlogPost = {
  slug: "resignation-letter",
  category: "letters",
  title: "Resignation letter: simple formats you can copy",
  seoTitle: "Resignation Letter: Simple Formats to Copy",
  description:
    "Resignation letter formats to copy: a standard letter with notice period, a short one, a new job, personal reasons, and a request for early release.",
  published: PUBLISHED,
  updated: PUBLISHED,
  minutes: 4,
  intro:
    "A resignation letter tells your employer you're leaving and on which date. Keep it short, polite and positive: your last working day, a thank-you, and an offer to help with the handover. Check the notice period in your offer letter before you choose the date.",
  sections: [
    {
      heading: "What to include",
      blocks: [
        list(
          "The date, and your manager's name and designation.",
          "Subject: Resignation from the post of [your designation].",
          "That you're resigning, and your last working day, counted from your notice period.",
          "A short thank-you for the opportunity.",
          "An offer to hand over your work properly.",
        ),
      ],
    },
    {
      heading: "Sample 1: standard, with notice period",
      blocks: [
        sample("standard", "Standard, with notice period", [
          ...HEADER,
          "Subject: Resignation from the post of [Designation]",
          "",
          "Dear [Manager's name],",
          "Please accept this letter as my formal resignation from the post of [Designation]. As per my notice period of [number] days, my last working day will be [date].",
          "Thank you for the opportunities and support I have had during my time here. I will make sure all my work is handed over properly before I leave.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 2: short",
      blocks: [
        sample("short", "Short", [
          ...HEADER,
          "Subject: Resignation",
          "",
          "Dear [Manager's name],",
          "I am resigning from my position as [Designation]. My last working day will be [date]. Thank you for everything, and I will help with the handover in the meantime.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 3: for a new opportunity",
      blocks: [
        sample("new-job", "For a new opportunity", [
          ...HEADER,
          "Subject: Resignation from the post of [Designation]",
          "",
          "Dear [Manager's name],",
          "I am writing to inform you that I have accepted a new opportunity and am resigning from my post as [Designation]. My last working day will be [date].",
          "I have learnt a great deal here, and I am grateful for your guidance. I will complete my pending work and train [Colleague's name] before I leave.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 4: for personal reasons",
      blocks: [
        sample("personal", "For personal reasons", [
          ...HEADER,
          "Subject: Resignation for personal reasons",
          "",
          "Dear [Manager's name],",
          "Because of personal reasons, I have to resign from my post as [Designation]. My last working day will be [date], at the end of my notice period.",
          "Thank you for your understanding and support.",
          ...SIGN_OFF,
        ]),
      ],
    },
    {
      heading: "Sample 5: asking for an early release",
      blocks: [
        sample("early-release", "Asking for an early release", [
          ...HEADER,
          "Subject: Resignation and request for early release",
          "",
          "Dear [Manager's name],",
          "I am resigning from my post as [Designation]. My notice period ends on [date], but because of [reason], I request you to relieve me on [earlier date], if possible.",
          "I will finish or hand over all my work by then, and I am happy to adjust any remaining notice as per company policy.",
          ...SIGN_OFF,
        ]),
      ],
    },
  ],
  faqs: [
    { q: "Do I have to give a reason?", a: "No. “Personal reasons” or no reason at all is fine. Keep the letter positive either way." },
    {
      q: "What is a notice period?",
      a: "The time you keep working after you resign, set in your offer letter or contract. In India it's often one to three months.",
    },
    {
      q: "Can I resign by email?",
      a: "Most companies accept an email. Some also ask for a signed letter, which you can print from Truehand and sign.",
    },
  ],
  related: ["sick-leave-application-for-office", "formal-letter-format", "apology-letter-to-teacher"],
};

export default post;
