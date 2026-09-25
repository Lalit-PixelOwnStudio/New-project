"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { useEntitlements } from "@/lib/entitlements-client";
import s from "./account.module.css";

export function AccountActions() {
  const router = useRouter();
  const { refresh } = useEntitlements();
  const [confirming, setConfirming] = useState(false);

  const signOut = async () => {
    await authClient.signOut();
    await refresh();
    router.push("/");
    router.refresh();
  };

  const remove = async () => {
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) await signOut();
  };

  return (
    <div className={s.actions}>
      <Button variant="secondary" onClick={signOut}>
        Sign out
      </Button>
      {confirming ? (
        <div className={s.danger}>
          <p>This deletes your account, remaining Pro time, credits and saved documents. It can&rsquo;t be undone.</p>
          <div className={s.row}>
            <Button onClick={remove}>Delete my account</Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Keep it
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          Delete account…
        </Button>
      )}
    </div>
  );
}
