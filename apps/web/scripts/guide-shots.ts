/**
 * Screenshots for the guides, taken from the running site so they always show
 * the real editor. Each shot outlines and numbers the controls its step talks
 * about. Re-run it whenever the editor changes:
 *
 *   pnpm --filter @truehand/web build && pnpm --filter @truehand/web start
 *   CHROME_PATH=/path/to/chrome pnpm --filter @truehand/web guide:shots http://localhost:3000
 *
 * Writes public/guides/<name>.webp and src/content/guide-images.json (sizes).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
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

async function open(browser: Browser, path: string, phone = false) {
  const context = await browser.newContext(
    phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true }
      : { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5, acceptDownloads: true },
  );
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

  await browser.close();
  writeFileSync(join(ROOT, "src", "content", "guide-images.json"), `${JSON.stringify(sizes, null, 2)}\n`);
  console.log(`guide shots: ${Object.keys(sizes).length} written`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
