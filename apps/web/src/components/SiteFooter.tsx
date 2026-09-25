import Link from "next/link";
import { Wordmark } from "./SiteHeader";
import s from "./SiteFooter.module.css";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Write" },
      { href: "/styles", label: "Handwriting styles" },
      { href: "/papers", label: "Papers" },
      { href: "/my-handwriting", label: "Your own handwriting" },
      { href: "/batch", label: "Batch letters" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Use it for",
    links: [
      { href: "/use/assignments", label: "Assignments" },
      { href: "/use/lab-records", label: "Lab records" },
      { href: "/use/cornell-notes", label: "Cornell notes" },
      { href: "/use/letters", label: "Letters & cards" },
      { href: "/business", label: "Business mail" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/guides/getting-started", label: "Getting started" },
      { href: "/credits", label: "Font credits" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/feedback", label: "Feedback" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/refunds", label: "Refunds" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.top}>
        <div className={s.brand}>
          <Wordmark />
          <p>Typed text, written out by hand. Rendered on your device; your words never leave it.</p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} className={s.col} aria-label={c.title}>
            <h2>{c.title}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} Truehand</span>
        <span>Handwriting fonts are open source (OFL, Apache 2.0). The realism is ours.</span>
      </div>
    </footer>
  );
}
