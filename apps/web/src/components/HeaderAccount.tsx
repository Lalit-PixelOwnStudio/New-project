"use client";
import { Crown } from "lucide-react";
import Link from "next/link";
import { useEntitlements } from "@/lib/entitlements-client";
import { ButtonLink } from "./ui/Button";
import s from "./SiteHeader.module.css";

/** Upgrade button for free users, and the account entry point. */
export function HeaderAccount() {
  const { entitlements } = useEntitlements();
  const initial = entitlements.email?.[0]?.toUpperCase() ?? "•";
  return (
    <>
      {entitlements.plan !== "pro" && (
        <ButtonLink href="/pricing" size="s" className={s.upgrade}>
          <Crown aria-hidden="true" />
          Upgrade
        </ButtonLink>
      )}
      {entitlements.signedIn ? (
        <Link href="/account" className={s.avatar} aria-label="Your account">
          <span>{initial}</span>
          {entitlements.plan === "pro" ? <em className={s.badge}>Pro</em> : entitlements.credits > 0 ? <em className={s.badge}>{entitlements.credits}</em> : null}
        </Link>
      ) : (
        <Link href="/login" className={s.signin}>
          Sign in
        </Link>
      )}
    </>
  );
}
