import Link from "next/link";
import { HeaderAccount } from "./HeaderAccount";
import { MobileNav } from "./MobileNav";
import s from "./SiteHeader.module.css";

export const NAV = [
  { href: "/styles", label: "Handwriting styles" },
  { href: "/papers", label: "Papers" },
  { href: "/business", label: "Business" },
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
];

export function Wordmark() {
  return (
    <span className={s.wordmark}>
      truehand<span className={s.dot}>.</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className={s.header}>
      <Link href="/" className={s.home} aria-label="Truehand home">
        <Wordmark />
      </Link>
      <nav className={s.nav} aria-label="Main">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className={s.actions}>
        <HeaderAccount />
        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
