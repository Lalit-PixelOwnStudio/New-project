"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./SiteHeader.module.css";

export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav className={s.nav} aria-label="Main">
      {items.map((n) => (
        <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
