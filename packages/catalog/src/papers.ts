import type { PaperSpec } from "@truehand/engine";
import type { Tier } from "./tier";

/** A paper design. Page size (A4, Letter…) is chosen separately. */
export interface PaperEntry {
  id: string;
  name: string;
  blurb: string;
  tier: Tier;
  spec: Omit<PaperSpec, "size">;
}

const INK_BLUE_RULE = "#9db4d6";
const MARGIN_RED = "#e07a86";
const WHITE = "#fcfbf8";

const ruled = (over: Partial<PaperEntry["spec"]> = {}): PaperEntry["spec"] => ({
  ruling: "ruled",
  spacingMm: 7.1,
  paperColor: WHITE,
  lineColor: INK_BLUE_RULE,
  marginLine: { xMm: 31, color: MARGIN_RED },
  headRule: null,
  cornell: null,
  texture: "smooth",
  holes: "none",
  margins: { topMm: 31, bottomMm: 12, leftMm: 14, rightMm: 9 },
  ...over,
});

export const PAPERS: PaperEntry[] = [
  {
    id: "college",
    name: "College ruled",
    blurb: "7.1 mm lines with a red margin. The default notebook page almost everywhere.",
    tier: "free",
    spec: ruled(),
  },
  {
    id: "wide",
    name: "Wide ruled",
    blurb: "8.7 mm lines for bigger, looser handwriting.",
    tier: "free",
    spec: ruled({ spacingMm: 8.7 }),
  },
  {
    id: "narrow",
    name: "Narrow ruled",
    blurb: "6 mm lines. Small handwriting, more words per page.",
    tier: "free",
    spec: ruled({ spacingMm: 6 }),
  },
  {
    id: "grid",
    name: "Grid",
    blurb: "5 mm squares, writing on every second row. Maths and science notebooks.",
    tier: "free",
    spec: ruled({ ruling: "grid", spacingMm: 5, lineColor: "#a7c1cc", marginLine: null, margins: { topMm: 16, bottomMm: 12, leftMm: 16, rightMm: 12 } }),
  },
  {
    id: "plain",
    name: "Plain",
    blurb: "No lines at all, so the writing drifts a little, the way it does on printer paper.",
    tier: "free",
    spec: ruled({ ruling: "plain", spacingMm: 8, marginLine: null, margins: { topMm: 22, bottomMm: 18, leftMm: 20, rightMm: 18 } }),
  },
  {
    id: "dot",
    name: "Dot grid",
    blurb: "5 mm dots. Bullet journals and design notes.",
    tier: "pro",
    spec: ruled({ ruling: "dot", spacingMm: 5, lineColor: "#8f9aa3", marginLine: null, margins: { topMm: 16, bottomMm: 12, leftMm: 16, rightMm: 12 } }),
  },
  {
    id: "legal",
    name: "Legal pad",
    blurb: "Yellow paper, double red margin, heavy head rule.",
    tier: "pro",
    spec: ruled({
      paperColor: "#fbf1a9",
      lineColor: "#8fb0c9",
      spacingMm: 7.1,
      marginLine: { xMm: 32, color: "#d9525f", double: true },
      headRule: { color: "#d9525f" },
      margins: { topMm: 36, bottomMm: 12, leftMm: 14, rightMm: 9 },
    }),
  },
  {
    id: "cornell",
    name: "Cornell notes",
    blurb: "Cue column on the left, summary box at the bottom. Built for revision.",
    tier: "pro",
    spec: ruled({
      marginLine: null,
      cornell: { cueMm: 63, summaryMm: 52, color: "#c36b77" },
      margins: { topMm: 28, bottomMm: 6, leftMm: 14, rightMm: 9 },
    }),
  },
  {
    id: "engineering",
    name: "Engineering pad",
    blurb: "Pale green paper with a faint quarter-inch grid.",
    tier: "pro",
    spec: ruled({
      ruling: "grid",
      spacingMm: 6.35,
      linesEvery: 1,
      paperColor: "#eef5e6",
      lineColor: "#9ec29a",
      marginLine: null,
      margins: { topMm: 20, bottomMm: 12, leftMm: 16, rightMm: 12 },
    }),
  },
  {
    id: "vintage",
    name: "Vintage",
    blurb: "Aged cream paper with faded lines and darker edges.",
    tier: "pro",
    spec: ruled({ paperColor: "#f3e7cc", lineColor: "#b8b4a4", marginLine: { xMm: 31, color: "#c98d86" }, texture: "aged" }),
  },
  {
    id: "recycled",
    name: "Recycled",
    blurb: "Grey-brown recycled stock with visible fibres.",
    tier: "pro",
    spec: ruled({ paperColor: "#ece8df", lineColor: "#9aa3ad", marginLine: { xMm: 31, color: "#c98d86" }, texture: "recycled" }),
  },
  {
    id: "kraft",
    name: "Kraft",
    blurb: "Plain brown kraft paper for notes, tags and letters.",
    tier: "pro",
    spec: ruled({ ruling: "plain", spacingMm: 8, paperColor: "#d8bf98", marginLine: null, texture: "recycled", margins: { topMm: 22, bottomMm: 18, leftMm: 20, rightMm: 18 } }),
  },
];

export const paperById = (id: string) => PAPERS.find((p) => p.id === id);
export const DEFAULT_PAPER_ID = "college";
