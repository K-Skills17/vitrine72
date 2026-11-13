import { describe, expect, it } from "vitest";
import { isAnalyticsEvent, sanitizeParams } from "./analytics";

describe("sanitizeParams", () => {
  it("keeps only allow-listed, non-empty string params", () => {
    expect(
      sanitizeParams({
        page_path: "/tratamentos/skinbooster",
        treatment_slug: "skinbooster",
        cta_location: "",
        name: "Maria",
        phone: "11912345678",
        destination: "whatsapp",
      }),
    ).toEqual({ page_path: "/tratamentos/skinbooster", treatment_slug: "skinbooster", destination: "whatsapp" });
  });
});

describe("isAnalyticsEvent", () => {
  it("accepts known events and rejects others", () => {
    expect(isAnalyticsEvent("whatsapp_click")).toBe(true);
    expect(isAnalyticsEvent("purchase")).toBe(false);
  });
});
