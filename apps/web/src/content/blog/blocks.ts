import type { BlogBlock, BlogTemplate } from "./types";

/** Building blocks for writing a post. */
export const p = (text: string): BlogBlock => ({ kind: "p", text });
export const list = (...items: string[]): BlogBlock => ({ kind: "list", items });
export const steps = (...items: string[]): BlogBlock => ({ kind: "steps", items });
export const note = (text: string): BlogBlock => ({ kind: "note", text });
export const sample = (id: string, title: string, lines: string[], settings?: BlogTemplate["settings"]): BlogBlock => ({
  kind: "template",
  template: { id, title, text: lines.join("\n"), settings },
});

export const PUBLISHED = "2026-09-26";

/** The same opening and closing for every application to a principal. */
export const TO_PRINCIPAL = ["To", "The Principal", "[School name]", "[City]", "", "Date: [DD/MM/YYYY]", ""];
export const SIGN_OFF = ["Thanking you.", "Yours obediently,", "[Your name]", "Class [Class and section], Roll No. [Roll number]"];
