import { describe, expect, it } from "vitest";
import { parseDocument, parseInline } from "../src/text/markup";

describe("parseInline", () => {
  it("applies paired markers", () => {
    expect(parseInline("a **b** __c__ ~~d~~ ==e==")).toEqual([
      { text: "a ", marks: [] },
      { text: "b", marks: ["bold"] },
      { text: " ", marks: [] },
      { text: "c", marks: ["underline"] },
      { text: " ", marks: [] },
      { text: "d", marks: ["strike"] },
      { text: " ", marks: [] },
      { text: "e", marks: ["highlight"] },
    ]);
  });

  it("nests marks", () => {
    expect(parseInline("**bold __both__**")).toEqual([
      { text: "bold ", marks: ["bold"] },
      { text: "both", marks: ["bold", "underline"] },
    ]);
  });

  it("keeps unclosed markers and escapes as text", () => {
    expect(parseInline("2 ** 3 and \\**x**")).toEqual([{ text: "2 ** 3 and **x**", marks: [] }]);
    expect(parseInline("snake_case __init")).toEqual([{ text: "snake_case __init", marks: [] }]);
  });
});

describe("parseDocument", () => {
  it("recognises block types", () => {
    const blocks = parseDocument("# Title\n## Sub\n- one\n  * two\n3. three\n\ntext\n---\nnext\n\n\n");
    expect(blocks.map((b) => b.kind)).toEqual(["heading", "heading", "item", "item", "item", "blank", "paragraph", "break", "paragraph"]);
    expect(blocks[3]).toMatchObject({ kind: "item", marker: "•", depth: 1 });
    expect(blocks[4]).toMatchObject({ kind: "item", marker: "3." });
  });

  it("does not treat bold at line start as a bullet", () => {
    expect(parseDocument("**Note** this")[0]!.kind).toBe("paragraph");
  });
});
