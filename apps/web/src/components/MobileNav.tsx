"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./MobileNav.module.css";

/**
 * The menu on phones and tablets. The sheet is rendered into <body>, not inside
 * the sticky header, so it covers the whole screen below the header, over the
 * download bar and the ad strip.
 */
export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { entitlements } = useEntitlements();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [...items, { href: "/my-handwriting", label: "Your own handwriting" }];

  return (
    <>
      <button type="button" className={s.toggle} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        <span className={s.bars} data-open={open || undefined} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <nav id="mobile-nav" className={s.sheet} aria-label="Main">
            <ul className={s.links}>
              {links.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={s.foot}>
              {entitlements.signedIn ? (
                <Link href="/account" className={s.account} onClick={() => setOpen(false)}>
                  Your account
                  {entitlements.email && <span>{entitlements.email}</span>}
                </Link>
              ) : (
                <Link href="/login" className={s.signin} onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              )}
            </div>
          </nav>,
          document.body,
        )}
    </>
  );
}
