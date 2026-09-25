import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/csv";
import { fillTemplate, rowFileName, templateFields } from "@/lib/template";

describe("parseCsv", () => {
  it("reads quoted fields, escaped quotes and embedded newlines", () => {
    const t = parseCsv('name,note\n"Doe, Jane","She said ""hi""\nthen left"\nSam,ok\n');
    expect(t.headers).toEqual(["name", "note"]);
    expect(t.rows).toEqual([
      { name: "Doe, Jane", note: 'She said "hi"\nthen left' },
      { name: "Sam", note: "ok" },
    ]);
  });

  it("detects semicolons and tabs, skips blank lines and a BOM", () => {
    expect(parseCsv("﻿a;b\n1;2\n\n").rows).toEqual([{ a: "1", b: "2" }]);
    expect(parseCsv("a\tb\r\n1\t2").rows).toEqual([{ a: "1", b: "2" }]);
  });
});

describe("templates", () => {
  it("fills fields case- and spacing-insensitively and reports missing ones", () => {
    const row = { "First name": "Maya", City: "Pune" };
    expect(fillTemplate("Dear {{first_name}} from {{ CITY }}, {{gift}}", row)).toEqual({ text: "Dear Maya from Pune, ", missing: ["gift"] });
    expect(templateFields("{{a}} {{ b }} {{a}}")).toEqual(["a", "b"]);
  });

  it("escapes markup inside values", () => {
    expect(fillTemplate("{{x}}", { x: "a**b" }).text).toBe("a\\*\\*b");
  });

  it("names files from a column", () => {
    expect(rowFileName({ name: "Maya Rao!" }, "name", 0)).toBe("Maya-Rao");
    expect(rowFileName({ name: "" }, "name", 4)).toBe("letter-005");
  });
});
