/**
 * Mail-merge templates: {{field}} placeholders filled from a spreadsheet row.
 * Field names match case-insensitively and ignore spaces and underscores, so
 * {{First Name}}, {{first_name}} and {{firstname}} all find "First name".
 */
const PLACEHOLDER = /\{\{\s*([^{}]+?)\s*\}\}/g;

const norm = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");

/** Escapes values so their characters are written, not read as markup. */
function escapeValue(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/([*_~=])\1/g, "\\$1\\$1");
}

export function templateFields(template: string): string[] {
  return [...new Set([...template.matchAll(PLACEHOLDER)].map((m) => m[1]!.trim()))];
}

export function fillTemplate(template: string, row: Record<string, string>): { text: string; missing: string[] } {
  const index = new Map(Object.keys(row).map((k) => [norm(k), k]));
  const missing: string[] = [];
  const text = template.replace(PLACEHOLDER, (_, name: string) => {
    const key = index.get(norm(name));
    if (key === undefined) {
      missing.push(name.trim());
      return "";
    }
    return escapeValue(row[key] ?? "");
  });
  return { text, missing: [...new Set(missing)] };
}

/** A filesystem-safe file name for a row, from a chosen column or the row number. */
export function rowFileName(row: Record<string, string>, column: string | null, index: number) {
  const base = (column ? row[column] : "") || `letter-${String(index + 1).padStart(3, "0")}`;
  return (
    base
      .replace(/[^\p{L}\p{N}\- ]+/gu, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || `letter-${index + 1}`
  );
}
