"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, type EditorSettings } from "@/lib/settings";

const KEY = "truehand:settings:v1";

function load(): EditorSettings | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<EditorSettings>) };
  } catch {
    return null;
  }
}

/**
 * Editor settings, remembered in this browser. The first render always uses
 * the defaults (matching the server-rendered specimen), then restores.
 */
export function useSettings(initial?: Partial<EditorSettings>) {
  const [settings, setSettings] = useState<EditorSettings>({ ...DEFAULT_SETTINGS, ...initial });
  const restored = useRef(false);

  useEffect(() => {
    const saved = load();
    // A page that pre-selects a style or paper wins over what was saved.
    if (saved) setSettings({ ...saved, ...initial });
    restored.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(settings));
      } catch {
        // Storage full or blocked: the editor still works, it just won't remember.
      }
    }, 400);
    return () => clearTimeout(t);
  }, [settings]);

  const update = useCallback(<K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setSettings((s) => (s[key] === value ? s : { ...s, [key]: value }));
  }, []);

  const patch = useCallback((p: Partial<EditorSettings>) => setSettings((s) => ({ ...s, ...p })), []);

  return { settings, update, patch, setSettings };
}
