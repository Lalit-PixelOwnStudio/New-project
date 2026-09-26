import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Keeps the three tiers apart (see docs/03-code-architecture.md):
 *
 *   presentation  src/app, src/components, src/editor, src/myhand, src/lib
 *        ↓ calls
 *   business      src/server/services
 *        ↓ calls
 *   data          src/server/repositories (SQL), src/server/integrations (Razorpay, PayPal, email), src/server/db
 *
 * A layer may only use the layers below it, and nothing above the data tier
 * touches the database directly.
 */
const SRC = join(import.meta.dirname, "..", "src");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

/** Every module a file imports, as a path under src/ (or the package name). */
function importsOf(file: string): string[] {
  const text = readFileSync(file, "utf8");
  const specs = [...text.matchAll(/(?:from|import)\s*\(?\s*"([^"]+)"/g)].map((m) => m[1]!);
  return specs.map((spec) => {
    if (spec.startsWith("@/")) return spec.slice(2);
    if (spec.startsWith(".")) return relative(SRC, resolve(dirname(file), spec));
    return spec;
  });
}

const all = files(SRC).map((file) => ({ file: relative(SRC, file), imports: importsOf(file), client: /^["']use client["']/.test(readFileSync(file, "utf8")) }));
const inDir = (dir: string) => all.filter((f) => f.file.startsWith(dir));
const touches = (imports: string[], prefixes: string[]) => imports.filter((i) => prefixes.some((p) => i === p || i.startsWith(`${p}/`)));

const DATA = ["server/db", "server/repositories", "server/integrations", "drizzle-orm"];

describe("architecture", () => {
  it("keeps the presentation tier off the data tier", () => {
    const presentation = ["app/", "components/", "editor/", "myhand/", "lib/", "content/"].flatMap(inDir);
    const leaks = presentation.flatMap((f) => touches(f.imports, DATA).map((i) => `${f.file} imports ${i}`));
    expect(leaks).toEqual([]);
  });

  it("lets services reach the database only through repositories", () => {
    const leaks = inDir("server/services/").flatMap((f) => touches(f.imports, ["server/db", "drizzle-orm"]).map((i) => `${f.file} imports ${i}`));
    expect(leaks).toEqual([]);
  });

  it("never lets the data tier call up into services", () => {
    const data = [...inDir("server/repositories/"), ...inDir("server/integrations/")];
    const leaks = data.flatMap((f) => touches(f.imports, ["server/services", "server/auth"]).map((i) => `${f.file} imports ${i}`));
    expect(leaks).toEqual([]);
  });

  it("keeps integrations independent of the database", () => {
    const leaks = inDir("server/integrations/").flatMap((f) =>
      touches(f.imports, ["server/db", "server/repositories", "drizzle-orm"]).map((i) => `${f.file} imports ${i}`),
    );
    expect(leaks).toEqual([]);
  });

  it("keeps server code out of the browser", () => {
    const leaks = all.filter((f) => f.client).flatMap((f) => touches(f.imports, ["server"]).map((i) => `${f.file} imports ${i}`));
    expect(leaks).toEqual([]);
  });
});
