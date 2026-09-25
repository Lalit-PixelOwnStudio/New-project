import type { PenSpec } from "@truehand/engine";
import type { Tier } from "./tier";

export interface PenEntry {
  id: string;
  name: string;
  tier: Tier;
  spec: PenSpec;
}

export const PENS: PenEntry[] = [
  { id: "ballpoint-blue", name: "Blue ballpoint", tier: "free", spec: { kind: "ballpoint", color: "#1f3c8f", width: 0.35 } },
  { id: "ballpoint-black", name: "Black ballpoint", tier: "free", spec: { kind: "ballpoint", color: "#1c1d22", width: 0.35 } },
  { id: "ballpoint-red", name: "Red ballpoint", tier: "free", spec: { kind: "ballpoint", color: "#b3242f", width: 0.35 } },
  { id: "gel-black", name: "Black gel", tier: "pro", spec: { kind: "gel", color: "#101216", width: 0.45 } },
  { id: "gel-blue", name: "Blue gel", tier: "pro", spec: { kind: "gel", color: "#1537b0", width: 0.45 } },
  { id: "fountain", name: "Fountain, blue-black", tier: "pro", spec: { kind: "fountain", color: "#1c2a50", width: 0.35 } },
  { id: "pencil", name: "HB pencil", tier: "pro", spec: { kind: "pencil", color: "#4b4b50", width: 0.4 } },
  { id: "marker", name: "Fine marker", tier: "pro", spec: { kind: "marker", color: "#151515", width: 0.3 } },
  { id: "green", name: "Green ballpoint", tier: "pro", spec: { kind: "ballpoint", color: "#1f6b3a", width: 0.35 } },
];

export const penById = (id: string) => PENS.find((p) => p.id === id);
export const DEFAULT_PEN_ID = "ballpoint-blue";
