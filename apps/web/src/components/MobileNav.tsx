"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./MobileNav.module.css";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className={s.toggle} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        <span className={s.bars} data-open={open || undefined} aria-hidden="true" />
      </button>
      <nav id="mobile-nav" className={s.sheet} data-open={open || undefined} aria-label="Main" hidden={!open}>
        {[{ href: "/", label: "Write" }, ...items, { href: "/account", label: "Sign in" }].map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
