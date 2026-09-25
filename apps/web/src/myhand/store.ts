"use client";
import { styleById, DEFAULT_STYLE_ID, type StyleEntry } from "@truehand/catalog";
import type { CapturedHand } from "@truehand/engine";
import { useSyncExternalStore } from "react";

/**
 * Handwritings people made from their own writing. Kept in this browser (and,
 * for signed-in people, on their account; see sync.ts). Their style ids start
 * with "mine:" so they never clash with the catalogue.
 */
export interface SavedHand {
  id: string;
  name: string;
  createdAt: string;
  data: CapturedHand;
}

const KEY = "th_hands";
const EVENT = "th-hands";
export const MINE_PREFIX = "mine:";

/** Every custom hand is unlocked by the same purchase, stored under this id. */
export const MINE_UNLOCK = "mine";

export const isMine = (styleId: string) => styleId.startsWith(MINE_PREFIX);

let cache: SavedHand[] | null = null;

function read(): SavedHand[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as SavedHand[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(hands: SavedHand[]) {
  cache = hands;
  try {
    localStorage.setItem(KEY, JSON.stringify(hands));
  } catch {
    // Storage full or blocked: the hand still works until the page is closed.
  }
  window.dispatchEvent(new Event(EVENT));
}

export const listHands = (): SavedHand[] => (typeof window === "undefined" ? [] : read());
export const getHand = (styleId: string) => listHands().find((h) => `${MINE_PREFIX}${h.id}` === styleId || h.id === styleId);

export function saveHand(hand: SavedHand) {
  write([hand, ...listHands().filter((h) => h.id !== hand.id)]);
}

export function removeHand(id: string) {
  write(listHands().filter((h) => h.id !== id));
  // Also from the account, if signed in; a guest's request is simply refused.
  void fetch(`/api/hands?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
}

/** Keeps a copy on the account of a signed-in person. Quietly does nothing for guests. */
export async function uploadHand(h: SavedHand) {
  try {
    await fetch("/api/hands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: h.id, name: h.name, data: h.data }),
    });
  } catch {
    // Offline: it's still saved in this browser, and syncs next time.
  }
}

/** Brings in hands saved on the account, and saves this browser's other hands to it. */
export async function syncHands() {
  try {
    const res = await fetch("/api/hands", { cache: "no-store" });
    if (!res.ok) return;
    const remote = (await res.json()) as SavedHand[];
    mergeHands(remote);
    const onAccount = new Set(remote.map((h) => h.id));
    for (const h of listHands()) if (!onAccount.has(h.id)) await uploadHand(h);
  } catch {
    // Offline or signed out: local hands keep working.
  }
}

/** Replaces the list, for example with the hands saved on the account. */
export function mergeHands(from: SavedHand[]) {
  const mine = listHands();
  const ids = new Set(mine.map((h) => h.id));
  const extra = from.filter((h) => !ids.has(h.id));
  if (extra.length) write([...mine, ...extra]);
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      onChange();
    }
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: SavedHand[] = [];
export function useHands(): SavedHand[] {
  return useSyncExternalStore(subscribe, listHands, () => EMPTY);
}

const entries = new Map<string, { hand: SavedHand | undefined; entry: StyleEntry }>();

/**
 * A catalogue-shaped entry for a style id, so the editor treats a custom hand
 * like any other: Pro-tier, written on screen in the default hand. The same
 * object comes back until the hand changes, so it's safe in effect dependencies.
 */
export function resolveStyle(styleId: string): StyleEntry {
  const fallback = styleById(DEFAULT_STYLE_ID)!;
  if (!isMine(styleId)) return styleById(styleId) ?? fallback;
  const hand = getHand(styleId);
  const cached = entries.get(styleId);
  if (cached && cached.hand === hand) return cached.entry;
  const entry: StyleEntry = {
    ...fallback,
    id: styleId,
    name: hand?.name ?? "Your handwriting",
    blurb: "Made from your own handwriting.",
    category: "casual",
    tier: "pro",
    scripts: [],
    connected: false,
    tune: { sizeAdjust: 1, weight: 1, slant: 0, tracking: 0, wordSpace: 1, baselineShift: 0 },
  };
  entries.set(styleId, { hand, entry });
  return entry;
}
