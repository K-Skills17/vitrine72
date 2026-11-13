import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ease } from "./motion";

describe("motion tokens", () => {
  it("easing matches --ease-aurea in globals.css", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
    const match = css.match(/--ease-aurea:\s*cubic-bezier\(([^)]+)\)/);
    expect(match).not.toBeNull();
    const cssValues = match![1]!.split(",").map((v) => Number(v.trim()));
    expect(cssValues).toEqual([...ease]);
  });
});
