"use client";
import Link from "next/link";
import { useEntitlements } from "@/lib/entitlements-client";
import { ButtonLink } from "./ui/Button";
import s from "./SiteHeader.module.css";

/** Sign-in / account link and the Pro call to action, depending on who is looking. */
export function HeaderAccount() {
  const { entitlements } = useEntitlements();
  return (
    <>
      <Link href={entitlements.signedIn ? "/account" : "/login"} className={s.signin}>
        {entitlements.signedIn ? "Account" : "Sign in"}
      </Link>
      {entitlements.plan !== "pro" && (
        <ButtonLink href="/pricing" size="s">
          Get Pro
        </ButtonLink>
      )}
    </>
  );
}
