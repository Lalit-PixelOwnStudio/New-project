import { describe, expect, it } from "vitest";
import { docToMarkup, markupToDoc } from "@/editor/markupDoc";

const roundTrip = (s: string) => docToMarkup(markupToDoc(s));

describe("markup <-> editor document", () => {
  it("round-trips everything the engine can draw", () => {
    const src = [
      "# Title",
      "A **bold** and __underlined__ and ~~struck~~ and ==highlighted== word.",
      "",
      "## Sub",
      "- one",
      "- two",
      "  - nested",
      "3. three",
      "4. four",
      "---",
      "After the break.",
    ].join("\n");
    expect(roundTrip(src)).toBe(src);
  });

  it("keeps literal markers and block-like text literal", () => {
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "2 ** 3 = 8 and a__b" }] },
        { type: "paragraph", content: [{ type: "text", text: "# not a heading" }] },
      ],
    };
    const markup = docToMarkup(doc);
    const back = markupToDoc(markup);
    expect(back.content![0]!.content![0]!.text).toBe("2 ** 3 = 8 and a__b");
    expect(back.content![1]!.type).toBe("paragraph");
    expect(back.content![1]!.content![0]!.text).toBe("# not a heading");
  });

  it("moves spaces outside marks", () => {
    const doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "a " }, { type: "text", text: "bold ", marks: [{ type: "bold" }] }, { type: "text", text: "b" }] }] };
    expect(docToMarkup(doc)).toBe("a **bold** b");
  });
});
