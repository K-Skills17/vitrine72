import { describe, it, expect } from "vitest";
import {
  addBusinessDays,
  calcPreviewDue,
  calcGoLiveEarliest,
  isBusinessDay,
} from "../business-days.js";

// Holidays for tests: 2025-01-01 (New Year), 2025-04-21 (Tiradentes)
const TEST_HOLIDAYS = ["2025-01-01", "2025-04-21"];

describe("isBusinessDay", () => {
  it("weekend is not a business day", () => {
    // 2025-01-04 is a Saturday
    expect(isBusinessDay(new Date("2025-01-04T12:00:00Z"), [])).toBe(false);
    // 2025-01-05 is a Sunday
    expect(isBusinessDay(new Date("2025-01-05T12:00:00Z"), [])).toBe(false);
  });

  it("holiday is not a business day", () => {
    // 2025-01-01 is a holiday and also a Wednesday
    expect(isBusinessDay(new Date("2025-01-01T15:00:00Z"), TEST_HOLIDAYS)).toBe(false);
  });

  it("weekday non-holiday is a business day", () => {
    // 2025-01-06 is Monday
    expect(isBusinessDay(new Date("2025-01-06T12:00:00Z"), [])).toBe(true);
  });
});

describe("addBusinessDays", () => {
  it("adds 3 business days skipping weekend", () => {
    // Thursday 2025-01-02 + 3bd = Tuesday 2025-01-07 (skipping Saturday, Sunday)
    const start = new Date("2025-01-02T10:00:00-03:00"); // Thursday SP
    const result = addBusinessDays(start, 3, []);
    const iso = result.toISOString().slice(0, 10);
    expect(iso).toBe("2025-01-07");
  });

  it("adds 3 business days skipping holiday", () => {
    // Friday 2025-04-18 (Good Friday is NOT in our list, using Tiradentes 04-21 Monday)
    // 2025-04-17 Thursday + 3bd: skip weekend (19,20), skip holiday (21), so: 22, 23, 24
    const start = new Date("2025-04-17T10:00:00-03:00");
    const result = addBusinessDays(start, 3, TEST_HOLIDAYS);
    const iso = result.toISOString().slice(0, 10);
    expect(iso).toBe("2025-04-23");
  });

  it("adds 0 business days returns same day", () => {
    const start = new Date("2025-01-06T10:00:00-03:00");
    const result = addBusinessDays(start, 0, []);
    expect(result.toISOString().slice(0, 10)).toBe("2025-01-06");
  });
});

describe("calcPreviewDue", () => {
  it("returns 3 business days from intake completion", () => {
    // Monday 2025-01-06 → Thursday 2025-01-09
    const intake = new Date("2025-01-06T14:00:00-03:00");
    const due = calcPreviewDue(intake, []);
    expect(due.toISOString().slice(0, 10)).toBe("2025-01-09");
  });
});

describe("calcGoLiveEarliest", () => {
  it("returns payment date + 8 calendar days", () => {
    const payment = new Date("2025-01-06T00:00:00-03:00");
    const goLive = calcGoLiveEarliest(payment);
    expect(goLive.toISOString().slice(0, 10)).toBe("2025-01-14");
  });

  it("calendar days — not business days (weekend included)", () => {
    // Payment on Thursday 2025-01-09 + 8 = Friday 2025-01-17
    const payment = new Date("2025-01-09T00:00:00-03:00");
    const goLive = calcGoLiveEarliest(payment);
    expect(goLive.toISOString().slice(0, 10)).toBe("2025-01-17");
  });
});
