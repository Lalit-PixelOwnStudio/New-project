import { ButtonLink } from "@/components/ui/Button";
import s from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={s.page}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/specimens/not-found.webp" alt="" width={196} height={66} className={s.scrawl} />
      <h1>This page got lost somewhere between the lines.</h1>
      <p>The link may be old or mistyped. The editor is still right where you left it.</p>
      <div className={s.actions}>
        <ButtonLink href="/">Start writing</ButtonLink>
        <ButtonLink href="/styles" variant="secondary">
          Browse handwriting
        </ButtonLink>
      </div>
    </main>
  );
}
