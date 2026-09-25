"use client";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import s from "./not-found.module.css";

/** Shown in place of a page that crashed, with the header and footer still in place. */
export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={s.page}>
      <h1>Something went wrong on this page.</h1>
      <p>Your text is saved in this browser. Try again, or go back to the editor.</p>
      <div className={s.actions}>
        <Button type="button" onClick={retry}>
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          Open the editor
        </ButtonLink>
      </div>
    </main>
  );
}
