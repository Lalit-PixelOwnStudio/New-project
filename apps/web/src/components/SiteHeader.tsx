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

/** Logo: a "T" written by Truehand's own engine, beside the name set in type. */
export function Wordmark() {
  return (
    <span className={s.logo}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.svg" alt="" width={34} height={34} className={s.mark} />
      <span className={s.word}>truehand</span>
    </span>
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
