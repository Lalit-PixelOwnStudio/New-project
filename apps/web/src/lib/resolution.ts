/**
 * Download quality, named the way people know it from screens and video.
 * On an A4 page: Full HD is 1240 × 1754 px, 2K is 1654 × 2339 px and 4K is
 * 2480 × 3508 px (the short side is at least 1080, 1440 and 2160 px).
 */
export const RESOLUTIONS = [
  { dpi: 150, name: "Full HD", hint: "Sharp on screens and fine to print" },
  { dpi: 200, name: "2K", hint: "Crisper prints" },
  { dpi: 300, name: "4K", hint: "Print-shop sharp" },
] as const;

export type Dpi = (typeof RESOLUTIONS)[number]["dpi"];

export const resolutionName = (dpi: number) => [...RESOLUTIONS].reverse().find((r) => dpi >= r.dpi)?.name ?? "HD";
