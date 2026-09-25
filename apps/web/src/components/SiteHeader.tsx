import Link from "next/link";
import { HeaderAccount } from "./HeaderAccount";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import s from "./SiteHeader.module.css";

export const NAV = [
  { href: "/", label: "Write" },
  { href: "/styles", label: "Handwriting" },
  { href: "/guides", label: "Guides" },
  { href: "/business", label: "Business" },
  { href: "/pricing", label: "Pricing" },
];

/** The wordmark, written by Truehand's own engine. */
export function Wordmark({ height = 36 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/wordmark.svg" alt="Truehand" height={height} width={Math.round(height * 3.9)} className={s.wordmark} />
  );
}

export function SiteHeader() {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href="/" className={s.home} aria-label="Truehand home">
          <Wordmark />
        </Link>
        <NavLinks items={NAV} />
        <div className={s.actions}>
          <HeaderAccount />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
