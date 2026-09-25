import { describe, expect, it } from "vitest";
import { present, toOrigin } from "@/lib/env";

describe("present", () => {
  it("treats empty and blank values as unset", () => {
    expect(present(undefined)).toBeUndefined();
    expect(present("")).toBeUndefined();
    expect(present("   ")).toBeUndefined();
    expect(present(" x ")).toBe("x");
  });
});

describe("toOrigin", () => {
  it("accepts full URLs and bare domains", () => {
    expect(toOrigin("https://truehand.app/")).toBe("https://truehand.app");
    expect(toOrigin("truehand.app")).toBe("https://truehand.app");
    expect(toOrigin("truehand-ai.vercel.app")).toBe("https://truehand-ai.vercel.app");
    expect(toOrigin("http://localhost:3000/path")).toBe("http://localhost:3000");
  });

  it("returns undefined for blank or unusable values", () => {
    expect(toOrigin("")).toBeUndefined();
    expect(toOrigin("https://")).toBeUndefined();
    expect(toOrigin("not a url")).toBeUndefined();
  });
});
