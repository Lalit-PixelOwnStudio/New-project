import type { PaperGeometry, PaperSize, PaperSpec } from "../types";

/** CSS pixels per millimetre (96 dpi). All layout happens in CSS px. */
export const PX_PER_MM = 96 / 25.4;

export const PAPER_SIZES_MM: Record<PaperSize, [width: number, height: number]> = {
  a4: [210, 297],
  letter: [215.9, 279.4],
  a5: [148, 210],
  legal: [215.9, 355.6],
  a6: [105, 148],
  "card-5x7": [127, 177.8],
  "postcard-4x6": [152.4, 101.6],
  "envelope-dl": [220, 110],
  "envelope-10": [241.3, 104.8],
};

/** Gap between the margin rule and the first letter. */
const MARGIN_GAP_MM = 2.2;

export function paperGeometry(spec: PaperSpec): PaperGeometry {
  const [wMm, hMm] = PAPER_SIZES_MM[spec.size];
  const width = wMm * PX_PER_MM;
  const height = hMm * PX_PER_MM;
  const cell = spec.spacingMm * PX_PER_MM;
  const top = spec.margins.topMm * PX_PER_MM;

  const cornell = spec.cornell
    ? {
        cueX: spec.cornell.cueMm * PX_PER_MM,
        summaryY: height - spec.cornell.summaryMm * PX_PER_MM,
      }
    : null;

  const bottom = (cornell ? cornell.summaryY : height) - spec.margins.bottomMm * PX_PER_MM;

  // Printed rules run from the top margin to the bottom edge of the writing area.
  const rules: number[] = [];
  if (spec.ruling !== "plain") {
    const start = spec.ruling === "ruled" ? top : top % cell;
    const end = spec.ruling === "ruled" ? bottom + 0.5 : height;
    for (let y = start; y <= end; y += cell) rules.push(y);
  }

  const every = spec.ruling === "grid" || spec.ruling === "dot" ? Math.max(1, spec.linesEvery ?? Math.round(8.5 / spec.spacingMm)) : 1;
  const step = cell * every;

  // Writing lines: the first one sits on the first rule at or below the top margin.
  const baselines: number[] = [];
  const first = spec.ruling === "grid" || spec.ruling === "dot" ? (rules.find((y) => y >= top) ?? top) : top;
  for (let y = first; y <= bottom + 0.5; y += step) baselines.push(y);

  const marginX = spec.marginLine ? spec.marginLine.xMm * PX_PER_MM : null;
  let textLeft = spec.margins.leftMm * PX_PER_MM;
  if (marginX !== null) textLeft = Math.max(textLeft, marginX + MARGIN_GAP_MM * PX_PER_MM);
  if (cornell) textLeft = Math.max(textLeft, cornell.cueX + MARGIN_GAP_MM * PX_PER_MM);
  const textRight = width - spec.margins.rightMm * PX_PER_MM;

  return {
    widthPx: width,
    heightPx: height,
    spacingPx: step,
    rules,
    baselines,
    textLeft,
    textRight,
    marginX,
    headerBaseline: Math.max(step * 0.9, first - step * 1.15),
    footerBaseline: Math.min(height - step * 0.5, (baselines[baselines.length - 1] ?? bottom) + step * 1.2),
    cornell,
  };
}
