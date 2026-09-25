/**
 * Screenshots for the guides, taken from the running site so they always show
 * the real editor. Each shot outlines and numbers the controls its step talks
 * about. Re-run it whenever the editor changes:
 *
 *   pnpm --filter @truehand/web build && pnpm --filter @truehand/web start > server.log
 *   GUIDE_SERVER_LOG=server.log CHROME_PATH=/path/to/chrome pnpm --filter @truehand/web guide:shots http://localhost:3000
 *
 * Making your own handwriting needs an account, so the script signs in with a
 * throwaway email and reads the code from the server's log (without an email
 * provider set up, the server prints the code instead of sending it).
 *
 * Writes public/guides/<name>.webp and src/content/guide-images.json (sizes).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { fakeTemplatePhoto, PHOTO } from "../test/fixtures/fake-photo";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "guides");
const ACCENT = "#ff5a1f";

type Box = { x: number; y: number; width: number; height: number };
const sizes: Record<string, { width: number; height: number }> = {};

/** Ads, the dev badge and the text caret have no place in a how-to picture. */
const CLEAN = `
  [class*="AdSlot-module"], [class*="AdBand-module"], [class*="SiteAds-module"], nextjs-portal { display: none !important; }
  * { caret-color: transparent !important; }
  dialog[open] { overflow: visible !important; animation: none !important; }
`;

async function union(...locs: Locator[]): Promise<Box> {
  const boxes = (await Promise.all(locs.map((l) => l.boundingBox()))).filter((b): b is Box => Boolean(b));
  if (!boxes.length) throw new Error("nothing to outline");
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return { x, y, width: Math.max(...boxes.map((b) => b.x + b.width)) - x, height: Math.max(...boxes.map((b) => b.y + b.height)) - y };
}

/** Draws numbered outlines over the page (inside an open modal, so they sit above it). */
async function mark(page: Page, targets: { at: Box; n?: number }[]) {
  await page.evaluate(
    ({ targets, accent }) => {
      document.querySelectorAll("[data-guide-mark]").forEach((e) => e.remove());
      const host = document.querySelector("dialog[open]") ?? document.body;
      for (const t of targets) {
        const d = document.createElement("div");
        d.dataset.guideMark = "";
        Object.assign(d.style, {
          position: "fixed",
          left: `${t.at.x - 5}px`,
          top: `${t.at.y - 5}px`,
          width: `${t.at.width + 10}px`,
          height: `${t.at.height + 10}px`,
          border: `3px solid ${accent}`,
          borderRadius: "10px",
          boxShadow: `0 0 0 4px ${accent}2e`,
          zIndex: "2147483647",
          pointerEvents: "none",
        });
        if (t.n) {
          const b = document.createElement("span");
          b.textContent = String(t.n);
          Object.assign(b.style, {
            position: "absolute",
            top: "-21px",
            left: "-21px",
            display: "grid",
            placeItems: "center",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: accent,
            color: "#fff",
            font: "700 13px/1 system-ui, sans-serif",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.3)",
          });
          d.appendChild(b);
        }
        host.appendChild(d);
      }
    },
    { targets, accent: ACCENT },
  );
}

async function shoot(page: Page, name: string, area: Box, pad = 30) {
  const vp = page.viewportSize()!;
  const x = Math.max(0, Math.floor(area.x - pad));
  const y = Math.max(0, Math.floor(area.y - pad));
  const clip = { x, y, width: Math.min(vp.width - x, Math.ceil(area.width + pad * 2)), height: Math.min(vp.height - y, Math.ceil(area.height + pad * 2)) };
  const png = await page.screenshot({ clip });
  const img = await loadImage(png);
  const canvas = createCanvas(img.width, img.height);
  canvas.getContext("2d").drawImage(img, 0, 0);
  writeFileSync(join(OUT, `${name}.webp`), await canvas.encode("webp", 84));
  sizes[name] = { width: img.width, height: img.height };
  await page.evaluate(() => document.querySelectorAll("[data-guide-mark]").forEach((e) => e.remove()));
  console.log(`  ${name}  ${img.width}×${img.height}`);
}

async function open(browser: Browser, path: string, phone = false, country?: string) {
  const context = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true }
      : { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5, acceptDownloads: true }),
    // Prices show in the visitor's currency; Vercel says where they are with this header.
    ...(country ? { extraHTTPHeaders: { "x-vercel-ip-country": country } } : {}),
  });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.addStyleTag({ content: CLEAN });
  await settle(page);
  return page;
}

/** Waits until the preview has finished writing. */
async function settle(page: Page) {
  await page.waitForTimeout(600);
  await page.waitForFunction(() => !document.querySelector("[data-busy]"), null, { timeout: 30_000 });
  await page.waitForTimeout(900);
}

/** Signs in with a one-time code read from the server's log, then lands on `next`. */
async function signIn(page: Page, next: string) {
  const log = process.env.GUIDE_SERVER_LOG;
  if (!log) throw new Error("Set GUIDE_SERVER_LOG to the server's log file, so the script can read sign-in codes");
  await page.goto(`${BASE}/login?next=${encodeURIComponent(next)}`, { waitUntil: "load" });
  await page.fill("#email", `guide-${Date.now()}@example.com`);
  const from = readFileSync(log, "utf8").length;
  await page.click("button[type=submit]");
  await page.waitForSelector("#code");
  let code: string | undefined;
  for (let i = 0; i < 50 && !code; i++) {
    await page.waitForTimeout(200);
    code = /(\d{6}) is your Truehand code/.exec(readFileSync(log, "utf8").slice(from))?.[1];
  }
  if (!code) throw new Error("No sign-in code in the server log");
  await page.fill("#code", code);
  await page.click("button[type=submit]");
  await page.waitForURL(BASE + next, { timeout: 20_000 });
  await page.addStyleTag({ content: CLEAN });
  await page.waitForTimeout(1200);
}

/**
 * A filled-in template, photographed at an angle, to upload; and a small copy
 * of it for the guide, showing what a good photo looks like.
 */
async function templatePhoto() {
  const rgba = fakeTemplatePhoto();
  const full = createCanvas(PHOTO.width, PHOTO.height);
  const ctx = full.getContext("2d");
  const img = ctx.createImageData(PHOTO.width, PHOTO.height);
  img.data.set(rgba);
  ctx.putImageData(img, 0, 0);
  const file = join(tmpdir(), "truehand-guide-photo.jpg");
  writeFileSync(file, await full.encode("jpeg", 88));

  const width = 700;
  const height = Math.round((PHOTO.height / PHOTO.width) * width);
  const small = createCanvas(width, height);
  small.getContext("2d").drawImage(full, 0, 0, width, height);
  writeFileSync(join(OUT, "mine-photo.webp"), await small.encode("webp", 82));
  sizes["mine-photo"] = { width, height };
  console.log(`  mine-photo  ${width}×${height}`);
  return file;
}

/** Draws a small "a" on the drawing pad. */
async function drawA(page: Page, pad: Locator) {
  const { x, y, width: w, height: h } = (await pad.boundingBox())!;
  const at = (px: number, py: number) => page.mouse.move(x + px * w, y + py * h);
  await at(0.56, 0.47);
  await page.mouse.down();
  for (let i = 0; i <= 28; i++) {
    const a = (-20 + (360 * i) / 28) * (Math.PI / 180);
    await at(0.46 + 0.1 * Math.cos(a), 0.555 + 0.115 * Math.sin(a));
  }
  await page.mouse.up();
  await at(0.56, 0.44);
  await page.mouse.down();
  for (let i = 0; i <= 10; i++) await at(0.56 + 0.01 * (i / 10), 0.44 + 0.22 * (i / 10));
  await page.mouse.up();
}

/** Scrolls so the editor's top edge sits just under the sticky site header. */
async function toEditor(page: Page) {
  const tabs = page.getByRole("tablist", { name: "Editor" });
  await page.evaluate((top) => window.scrollBy(0, top - 92), (await tabs.boundingBox())!.y);
  await page.waitForTimeout(400);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

  /* ------------------------------ Desktop ------------------------------ */
  let page = await open(browser, "/");
  await toEditor(page);
  const text = page.getByRole("tabpanel", { name: "Text" });
  const preview = page.getByRole("region", { name: "Preview", exact: true });
  const hand = page.getByRole("button", { name: "Handwriting", exact: true });
  const paper = page.getByRole("button", { name: "Paper", exact: true });
  const pen = page.getByRole("button", { name: "Pen and ink", exact: true });
  const download = preview.getByRole("button", { name: "Download", exact: true });

  // The whole editor, numbered.
  await mark(page, [
    { at: await union(page.locator('[contenteditable="true"]')), n: 1 },
    { at: await union(hand, pen), n: 2 },
    { at: await union(page.getByRole("region", { name: "Handwritten preview", exact: true })), n: 3 },
    { at: await union(download), n: 4 },
  ]);
  await shoot(page, "editor-tour", await union(page.getByRole("tablist", { name: "Editor" }), text, preview), 14);

  // The toolbar, in groups.
  const tool = (name: string) => page.getByRole("button", { name, exact: true });
  await mark(page, [
    { at: await union(tool("Normal text"), tool("Subheading")), n: 1 },
    { at: await union(tool("Bold (pressed harder), Ctrl+B"), tool("Highlighter")), n: 2 },
    { at: await union(tool("Bullet list"), tool("Numbered list")), n: 3 },
    { at: await union(tool("Start a new page")), n: 4 },
    { at: await union(tool("Clear all text")), n: 5 },
  ]);
  await shoot(page, "toolbar", await union(page.getByRole("toolbar", { name: "Formatting" })), 24);

  // Hand, paper and pen pickers.
  await mark(page, [
    { at: await union(hand), n: 1 },
    { at: await union(paper), n: 2 },
    { at: await union(pen), n: 3 },
  ]);
  await shoot(page, "pickers", await union(hand, pen, page.getByRole("toolbar", { name: "Formatting" })));

  await hand.click();
  const handMenu = page.getByRole("dialog", { name: "Handwriting" });
  await handMenu.waitFor();
  await page.waitForTimeout(500);
  const everyday = handMenu.getByRole("tab", { name: "Everyday" });
  await mark(page, [{ at: await union(hand), n: 1 }, ...((await everyday.count()) ? [{ at: await union(everyday), n: 2 }] : [])]);
  await shoot(page, "pick-hand", await union(hand, handMenu));
  await page.keyboard.press("Escape");
  await page.mouse.click(5, 5);

  await paper.click();
  const paperMenu = page.getByRole("dialog", { name: "Paper" });
  await paperMenu.waitFor();
  await page.waitForTimeout(500);
  await mark(page, [{ at: await union(paper), n: 1 }]);
  await shoot(page, "pick-paper", await union(paper, paperMenu));
  await page.keyboard.press("Escape");
  await page.mouse.click(5, 5);

  // Style & page: writing settings.
  await page.getByRole("tab", { name: "Style & page" }).click();
  const style = page.getByRole("tabpanel", { name: "Style & page" });
  const writing = style.getByRole("heading", { name: "Writing", exact: true });
  await writing.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const row = (name: string) => style.getByRole("slider", { name, exact: true }).locator("xpath=..");
  const rewrite = style.getByRole("button", { name: "Rewrite with a fresh hand" });
  await mark(page, [
    { at: await union(row("Size")), n: 1 },
    { at: await union(row("Messiness")), n: 2 },
    { at: await union(row("Slant")), n: 3 },
    { at: await union(rewrite), n: 4 },
  ]);
  await shoot(page, "writing-settings", await union(writing, rewrite));

  // Style & page: name, class and page numbers.
  const pageHeading = style.getByRole("heading", { name: "Page", exact: true });
  await pageHeading.scrollIntoViewIfNeeded();
  const left = style.getByPlaceholder("Name, class");
  const right = style.getByPlaceholder("Date, subject");
  await left.fill("Riya Sharma · 10B · Roll 23");
  await right.fill("Physics · 25/09");
  const numbers = style.getByText("Number the pages");
  if (!(await style.getByRole("checkbox", { name: "Number the pages" }).isChecked())) await numbers.click();
  await settle(page);
  await pageHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await mark(page, [
    { at: await union(left.locator("xpath=.."), right.locator("xpath=..")), n: 1 },
    { at: await union(numbers), n: 2 },
  ]);
  await shoot(page, "page-settings", await union(pageHeading, style.getByText("Skip a line between paragraphs")));

  // What the header looks like on the page.
  const sheet = page
    .getByRole("region", { name: /^Handwritten preview, / })
    .locator("canvas, img")
    .first();
  const s = (await sheet.boundingBox())!;
  await shoot(page, "page-header-result", { x: s.x, y: s.y, width: s.width, height: s.height * 0.3 }, 0);

  // The download window.
  await download.click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor();
  await page.waitForTimeout(400);
  await mark(page, [
    { at: await union(dialog.getByRole("group", { name: "Format" })), n: 1 },
    { at: await union(dialog.getByRole("group", { name: "Quality" })), n: 2 },
    { at: await union(dialog.getByRole("button", { name: /^Download \d+ pages? as/ })), n: 3 },
  ]);
  await shoot(page, "download-options", (await dialog.boundingBox())!, 10);

  // Download, then the ready view.
  await dialog.getByRole("button", { name: /^Download \d+ pages? as/ }).click();
  await dialog.getByText("Your download is ready").waitFor({ timeout: 30_000 });
  await page.waitForTimeout(400);
  await mark(page, [{ at: await union(dialog.getByRole("button", { name: "Download again" })), n: 1 }]);
  await shoot(page, "download-ready", (await dialog.boundingBox())!, 10);
  await page.context().close();

  // A Pro choice, and the one-tap way back to free.
  page = await open(browser, "/");
  await toEditor(page);
  await page.getByRole("button", { name: "Handwriting", exact: true }).click();
  await page.getByRole("dialog", { name: "Handwriting" }).getByRole("button", { name: /Pro$/ }).first().click();
  await page.keyboard.press("Escape");
  await settle(page);
  await page.getByRole("region", { name: "Preview", exact: true }).getByRole("button", { name: "Download", exact: true }).click();
  const proDialog = page.locator("dialog[open]");
  await proDialog.getByText("This page uses Pro choices").waitFor();
  await page.waitForTimeout(400);
  await mark(page, [{ at: await union(proDialog.getByRole("button", { name: "Use free options" })), n: 1 }]);
  await shoot(page, "download-pro", (await proDialog.boundingBox())!, 10);
  await page.context().close();

  /* ------------------------------- Phone ------------------------------- */
  page = await open(browser, "/", true);
  await toEditor(page);
  const bar = page.getByRole("button", { name: /^Download \d+ pages?$/ });
  await mark(page, [
    { at: await union(page.getByRole("tab", { name: "Text" })), n: 1 },
    { at: await union(page.getByRole("button", { name: "Handwriting", exact: true }), page.getByRole("button", { name: "Pen and ink", exact: true })), n: 2 },
    { at: await union(bar), n: 3 },
  ]);
  await shoot(page, "phone-text", { x: 0, y: 0, width: 390, height: 844 }, 0);
  await page.getByRole("tab", { name: "Style & page" }).click();
  await page.waitForTimeout(500);
  await mark(page, [{ at: await union(page.getByRole("tab", { name: "Style & page" })), n: 1 }]);
  await shoot(page, "phone-style", { x: 0, y: 0, width: 390, height: 844 }, 0);
  await page.context().close();

  /* ------------------------ Your own handwriting ------------------------ */
  const photo = await templatePhoto();

  // Signed out: sign in, then the two ways to capture a hand.
  page = await open(browser, "/my-handwriting", false, "IN");
  const gate = page.getByRole("heading", { name: "Sign in to make your handwriting" });
  await gate.waitFor();
  const paperPath = page.locator("article", { has: page.getByRole("heading", { name: "Write on paper" }) });
  const drawPath = page.locator("article", { has: page.getByRole("heading", { name: /Draw on screen/ }) });
  // Clear of the sticky header, with room for the numbered badges.
  await page.evaluate((top) => window.scrollBy(0, top - 150), (await gate.locator("xpath=../..").boundingBox())!.y);
  await page.waitForTimeout(400);
  await mark(page, [
    { at: await union(gate.locator("xpath=../..")), n: 1 },
    { at: await union(page.getByRole("button", { name: "Download the template" })), n: 2 },
    { at: await union(page.getByRole("button", { name: "Upload or take the photo" })), n: 3 },
    { at: await union(page.getByRole("button", { name: "Start drawing" })), n: 4 },
  ]);
  await shoot(page, "mine-start", await union(gate.locator("xpath=../.."), paperPath, drawPath));

  // Signed in: upload the photo and look over what was read.
  await signIn(page, "/my-handwriting");
  await page.setInputFiles("input[type=file]", photo);
  const read = page.getByRole("heading", { name: /^We read \d+ of \d+ characters/ });
  await read.waitFor({ timeout: 60_000 });
  await settle(page);
  await page.evaluate((top) => window.scrollBy(0, top - 150), (await read.boundingBox())!.y);
  await page.waitForTimeout(400);
  const grid = page.getByRole("list", { name: "Characters read from your writing" });
  // The box around the sample page, which crops the page inside it.
  const handPage = page.getByRole("region", { name: "Your handwriting on a page" }).locator("xpath=..");
  await mark(page, [
    { at: await union(read), n: 1 },
    { at: await union(grid), n: 2 },
    { at: await union(handPage), n: 3 },
  ]);
  await shoot(page, "mine-review", await union(read, grid, handPage));

  const name = page.getByLabel("Name it");
  const save = page.getByRole("button", { name: /^Save and/ });
  await name.fill("My handwriting");
  await save.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await mark(page, [
    { at: await union(name), n: 1 },
    { at: await union(save), n: 2 },
  ]);
  await shoot(page, "mine-save", await union(name.locator("xpath=.."), save, page.getByText(/^One payment of/)));

  // Saved, and the one payment that unlocks downloads.
  await save.click();
  const unlock = page.getByRole("heading", { name: /^Unlock your handwriting/ });
  await unlock.waitFor();
  await page.waitForTimeout(900);
  const card = unlock.locator("xpath=..");
  await mark(page, [
    { at: await union(page.getByRole("button", { name: /^Pay .* and unlock$/ })), n: 1 },
    { at: await union(page.getByRole("button", { name: "Not now, try it in the editor first" })), n: 2 },
  ]);
  await shoot(page, "mine-unlock", await union(card), 16);

  // In the editor, it's in the Hand picker.
  await page.getByRole("button", { name: "Not now, try it in the editor first" }).click();
  await page.waitForURL(BASE + "/");
  await page.addStyleTag({ content: CLEAN });
  await settle(page);
  await toEditor(page);
  const handButton = page.getByRole("button", { name: "Handwriting", exact: true });
  await handButton.click();
  const picker = page.getByRole("dialog", { name: "Handwriting" });
  await picker.waitFor();
  await page.waitForTimeout(500);
  await mark(page, [{ at: await union(picker.getByRole("button", { name: /^My handwriting/ })), n: 1 }]);
  await shoot(page, "mine-in-editor", await union(handButton, picker));
  await page.context().close();

  // No printer: drawing each letter on a phone.
  page = await open(browser, "/my-handwriting", true, "IN");
  await signIn(page, "/my-handwriting");
  await page.getByRole("button", { name: "Start drawing" }).click();
  const pad = page.locator("canvas[aria-label^='Drawing area']");
  await pad.waitFor();
  await page.waitForTimeout(900);
  await drawA(page, pad);
  await page.waitForTimeout(300);
  await mark(page, [
    { at: await union(pad), n: 1 },
    { at: await union(page.getByRole("button", { name: "Next" })), n: 2 },
    { at: await union(page.getByRole("button", { name: "Finish now" })), n: 3 },
  ]);
  await shoot(page, "phone-mine-draw", { x: 0, y: 0, width: 390, height: 844 }, 0);
  await page.context().close();

  await browser.close();
  writeFileSync(join(ROOT, "src", "content", "guide-images.json"), `${JSON.stringify(sizes, null, 2)}\n`);
  console.log(`guide shots: ${Object.keys(sizes).length} written`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
