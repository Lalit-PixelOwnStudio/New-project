"use client";
import type { CapturedHand } from "@truehand/engine";
import { Camera, Check, Download, FileImage, PenLine, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Preview } from "@/editor/Preview";
import { usePreview } from "@/editor/usePreview";
import { rememberStyle } from "@/editor/useSettings";
import { authClient } from "@/lib/auth-client";
import { canUseStyle, useEntitlements } from "@/lib/entitlements-client";
import { DEFAULT_SETTINGS, type EditorSettings } from "@/lib/settings";
import { buildHand, CaptureError, captureTemplate, traceCells, type CellInk } from "./capture";
import { DrawPad, MIN_DRAWN, type Drawings } from "./DrawPad";
import { getHand, MINE_PREFIX, saveHand, uploadHand, type SavedHand } from "./store";
import { CELLS } from "./template";
import { photoPixels, templatePdf } from "./templateFile";
import s from "./myhand.module.css";

type Phase =
  | { name: "choose" }
  | { name: "reading" }
  | { name: "draw"; drawings?: Drawings }
  /** `drawings` is set when the hand was drawn on screen, so more can be added. */
  | { name: "review"; hand: CapturedHand; missing: string[]; drawings?: Drawings }
  | { name: "error"; message: string }
  /** Saved; now the ask to pay for downloads in it. */
  | { name: "unlock"; hand: SavedHand };

const HERE = "/my-handwriting";
const LOGIN = `/login?next=${encodeURIComponent(HERE)}`;

/** Keeps the saved hand in the address, so signing in to pay comes back to the same step. */
function setUnlockParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("unlock", id);
  else url.searchParams.delete("unlock");
  window.history.replaceState(null, "", url);
}

const ALL = [...new Set(CELLS)];
const HEADING = "# My own handwriting";
const SAMPLE =
  "The quick brown fox jumps over the lazy dog. Notes, assignments and letters, written in my hand, with every letter a little different each time. 1 2 3 4 5 6 7 8 9 0";
/** Everyday words, many from the start of the alphabet, to show a hand that's only partly drawn. */
const WORDS = (
  "a bad bag bed big cab cafe cage dad deck dig each egg face fig had head hide hike ice idea jab jade kid " +
  "back black check chief field glad hold joke lake like milk name note open page plan quiz read school study " +
  "the time today under very water week when with work write year zero"
).split(" ");

/**
 * The preview page. A hand missing some letters also shows every character it
 * has and the words it can write entirely on its own, so people see their writing
 * rather than a page of fallback letters.
 */
function previewText(hand: CapturedHand) {
  const letters = new Set(hand.glyphs.map((g) => g.char.toLowerCase()).filter((c) => c >= "a" && c <= "z"));
  if (letters.size === 26) return `${HEADING}\n${SAMPLE}`;
  const drawn = [...new Set(hand.glyphs.map((g) => g.char))].join(" ");
  const words = WORDS.filter((w) => [...w].every((c) => letters.has(c))).slice(0, 18);
  return [HEADING, drawn, words.join(" "), SAMPLE].filter(Boolean).join("\n");
}

/** How many of the 26 letters a hand has, in either case. */
const lettersIn = (hand: CapturedHand) => new Set(hand.glyphs.map((g) => g.char.toLowerCase()).filter((c) => c >= "a" && c <= "z")).size;

export function MyHandTool({ priceLabel, google }: { priceLabel: string; google: boolean }) {
  const router = useRouter();
  const { entitlements, loading } = useEntitlements();
  const signedIn = entitlements.signedIn;
  // One purchase, or any plan, unlocks every handwriting a person makes.
  const unlocked = canUseStyle(entitlements, MINE_PREFIX, "pro");
  const [phase, setPhase] = useState<Phase>({ name: "choose" });
  const [name, setName] = useState("My handwriting");
  const [busyTemplate, setBusyTemplate] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const review = useRef<HTMLDivElement>(null);
  // Show the results, and the unlock step, from the top.
  useEffect(() => {
    if (phase.name === "review" || phase.name === "unlock") review.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [phase.name]);
  // Back from signing in to pay: pick up at the unlock step for that hand.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("unlock");
    const hand = id ? getHand(id) : undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address is only readable after hydration
    if (hand) setPhase({ name: "unlock", hand });
  }, []);

  /** Making a handwriting needs an account, so it's kept there and can be paid for. */
  const signedInThen = (go: () => void) => () => (signedIn ? go() : router.push(LOGIN));

  const downloadTemplate = async () => {
    setBusyTemplate(true);
    try {
      const blob = await templatePdf();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "truehand-handwriting-template.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    } finally {
      setBusyTemplate(false);
    }
  };

  const readPhoto = async (f: File) => {
    setPhase({ name: "reading" });
    // Let the "reading" state paint before the work starts.
    await new Promise((r) => setTimeout(r, 30));
    try {
      const px = await photoPixels(f);
      const { hand, missing } = captureTemplate(px.data, px.width, px.height);
      setPhase({ name: "review", hand, missing });
    } catch (e) {
      setPhase({ name: "error", message: e instanceof CaptureError ? e.message : "We couldn't read that image. Try a JPG or PNG photo of the whole page." });
    }
  };

  const fromDrawing = (cells: CellInk[], drawings: Drawings) => {
    const traced = traceCells(cells);
    if (traced.length < MIN_DRAWN) {
      setPhase({ name: "error", message: `Some drawings were too small to read. Draw at least ${MIN_DRAWN} characters a little bigger.` });
      return;
    }
    const hand = buildHand(traced);
    const found = new Set(traced.map((c) => c.char));
    setPhase({ name: "review", hand, missing: ALL.filter((c) => !found.has(c)), drawings });
  };

  const openEditor = (hand: SavedHand) => {
    rememberStyle(MINE_PREFIX + hand.id);
    router.push("/");
  };

  // Saved first, so nothing is lost if paying takes a detour through signing in.
  const save = (hand: CapturedHand) => {
    const saved = { id: crypto.randomUUID().slice(0, 8), name: name.trim() || "My handwriting", createdAt: new Date().toISOString(), data: hand };
    saveHand(saved);
    void uploadHand(saved);
    if (unlocked) {
      openEditor(saved);
      return;
    }
    setUnlockParam(saved.id);
    setPhase({ name: "unlock", hand: saved });
  };

  if (phase.name === "unlock") {
    const open = () => {
      setUnlockParam(null);
      openEditor(phase.hand);
    };
    return (
      <div className={s.unlock} ref={review}>
        <p className={s.saved}>
          <Check aria-hidden="true" />
          Saved as &ldquo;{phase.hand.name}&rdquo;
        </p>
        {unlocked ? (
          <>
            <h2>Your handwriting is unlocked</h2>
            <p>Download pages written in it whenever you like.</p>
            <div className={s.unlockActions}>
              <Button type="button" size="l" onClick={open}>
                Open in the editor
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2>Unlock your handwriting for {priceLabel}</h2>
            <p>
              Pay once and it&rsquo;s yours for good: download pages written in your own hand as PDF or images, for every handwriting you make. Every plan
              includes it too.
            </p>
            <div className={s.unlockActions}>
              <BuyButton product="my_hand" size="l" onDone={open}>
                Pay {priceLabel} and unlock
              </BuyButton>
              <ButtonLink href="/pricing" variant="secondary" size="l">
                See plans
              </ButtonLink>
            </div>
            <button type="button" className={s.linkButton} onClick={open}>
              Not now, try it in the editor first
            </button>
          </>
        )}
      </div>
    );
  }

  if (phase.name === "draw") return <DrawPad initial={phase.drawings} onDone={fromDrawing} onCancel={() => setPhase({ name: "choose" })} />;

  if (phase.name === "review") {
    return (
      <div className={s.review} ref={review}>
        <div className={s.reviewHead}>
          <h2>
            {phase.drawings
              ? `You drew ${ALL.length - phase.missing.length} characters`
              : `We read ${ALL.length - phase.missing.length} of ${ALL.length} characters`}
          </h2>
          {phase.drawings ? (
            <DrawnSummary letters={lettersIn(phase.hand)} onMore={() => setPhase({ name: "draw", drawings: phase.drawings })} />
          ) : (
            phase.missing.length > 0 && (
              <p>
                Not found: <span className={s.missing}>{phase.missing.join(" ")}</span>. Those are written in the default hand, or retake the photo to add them.
              </p>
            )
          )}
        </div>
        <GlyphGrid hand={phase.hand} />
        <HandPreview hand={phase.hand} />
        <div className={s.saveRow}>
          <label className={s.nameField}>
            <span>Name it</span>
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </label>
          <Button type="button" size="l" onClick={() => save(phase.hand)}>
            {unlocked ? "Save and open in the editor" : `Save and unlock · ${priceLabel}`}
          </Button>
          <Button type="button" variant="secondary" size="l" onClick={() => setPhase({ name: "choose" })}>
            <RotateCcw aria-hidden="true" />
            Start again
          </Button>
        </div>
        <p className={s.priceNote}>
          {unlocked
            ? "Your account already includes your own handwriting, so pages in it download straight away."
            : `One payment of ${priceLabel} unlocks downloads in every handwriting you make, for good. Every plan includes it.`}
        </p>
      </div>
    );
  }

  return (
    <>
      {!loading && !signedIn && (
        <div className={s.signin}>
          <div>
            <h2>Sign in to make your handwriting</h2>
            <p>Signing up is free. Your handwriting is saved to your account, so it&rsquo;s there on every device.</p>
          </div>
          <div className={s.signinActions}>
            {google && (
              <Button type="button" variant="secondary" onClick={() => void authClient.signIn.social({ provider: "google", callbackURL: HERE })}>
                Continue with Google
              </Button>
            )}
            <ButtonLink href={LOGIN}>Continue with email</ButtonLink>
          </div>
        </div>
      )}
      <div className={s.paths}>
        <article className={s.path}>
          <span className={s.pathIcon}>
            <FileImage aria-hidden="true" />
          </span>
          <h2>Write on paper</h2>
          <ol className={s.steps}>
            <li>Print the one-page template.</li>
            <li>Write one character in each box with a dark pen.</li>
            <li>Take a photo of the whole page, with all four black squares in view.</li>
          </ol>
          <div className={s.pathActions}>
            <Button type="button" variant="secondary" onClick={downloadTemplate} disabled={busyTemplate}>
              <Download aria-hidden="true" />
              {busyTemplate ? "Preparing…" : "Download the template"}
            </Button>
            <Button type="button" onClick={signedInThen(() => file.current?.click())} disabled={loading || phase.name === "reading"}>
              <Camera aria-hidden="true" />
              {phase.name === "reading" ? "Reading your page…" : "Upload or take the photo"}
            </Button>
            <input
              ref={file}
              type="file"
              accept="image/*"
              className="visually-hidden"
              aria-label="Photo of your filled-in template"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void readPhoto(f);
              }}
            />
          </div>
          {phase.name === "error" && (
            <p className={s.error} role="alert">
              {phase.message}
            </p>
          )}
          <p className={s.small}>Your photo is read on your device and never uploaded.</p>
        </article>
        <article className={s.path}>
          <span className={s.pathIcon}>
            <PenLine aria-hidden="true" />
          </span>
          <h2>No printer? Draw on screen</h2>
          <p>
            Write each letter with your finger, a stylus or the mouse, one at a time. Small letters come first, since they fill most of a page. Takes about five
            minutes.
          </p>
          <div className={s.pathActions}>
            <Button type="button" variant="secondary" onClick={signedInThen(() => setPhase({ name: "draw" }))} disabled={loading}>
              <PenLine aria-hidden="true" />
              Start drawing
            </Button>
          </div>
        </article>
      </div>
    </>
  );
}

/** What a drawn hand covers so far, with the way back to the pad. */
function DrawnSummary({ letters, onMore }: { letters: number; onMore: () => void }) {
  const full = letters === 26;
  return (
    <div className={s.drawnSummary}>
      <p>
        {full
          ? "Every letter is in your hand. Digits and marks you didn't draw are written in the default hand."
          : `Your hand has ${letters} of the 26 letters. The rest are written in the default hand, so words look mixed until you draw them. Small and capital letters stand in for each other.`}
      </p>
      <Button type="button" variant={full ? "secondary" : "primary"} onClick={onMore}>
        <PenLine aria-hidden="true" />
        Draw more letters
      </Button>
    </div>
  );
}

/** Every character that was read, drawn from the captured outlines. */
function GlyphGrid({ hand }: { hand: CapturedHand }) {
  const seen = new Set<string>();
  const glyphs = hand.glyphs.filter((g) => !seen.has(g.char) && seen.add(g.char));
  const top = hand.ascender;
  const height = hand.ascender - hand.descender;
  return (
    <ul className={s.glyphs} aria-label="Characters read from your writing">
      {glyphs.map((g) => (
        <li key={g.char} title={g.char}>
          <svg viewBox={`0 ${-top} ${g.advance} ${height}`} role="img" aria-label={g.char}>
            <path fillRule="nonzero" d={g.variants[0]!.map((c) => `M${c.map((v, i) => (i % 2 ? -v : v)).join(" ")}Z`).join("")} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

const DRAFT = `${MINE_PREFIX}draft`;

/** A page written in the new hand by the real engine, before it's saved. */
function HandPreview({ hand }: { hand: CapturedHand }) {
  const settings = useMemo<EditorSettings>(() => ({ ...DEFAULT_SETTINGS, text: previewText(hand), styleId: DRAFT, holes: "none" }), [hand]);
  const draft = useMemo(() => ({ styleId: DRAFT, data: hand }), [hand]);
  const preview = usePreview(settings, draft);
  return (
    <div className={s.previewBox}>
      <Preview
        client={preview.client}
        layoutId={preview.layoutId}
        pages={1}
        size={settings.size}
        effect="none"
        busy={preview.busy}
        label="Your handwriting on a page"
      />
    </div>
  );
}
