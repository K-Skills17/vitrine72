import { describe, it, expect } from "vitest";
import {
  canTransition,
  transition,
  canRefund,
  canPause,
} from "../status-machine.js";

describe("status machine — valid transitions", () => {
  it("paid → intake_pending", () => {
    expect(canTransition("paid", "intake_pending")).toEqual({ ok: true });
  });

  it("intake_complete → in_production", () => {
    expect(canTransition("intake_complete", "in_production")).toEqual({ ok: true });
  });

  it("cannot skip states", () => {
    const r = canTransition("paid", "in_production");
    expect(r.ok).toBe(false);
  });

  it("cannot go back from live to in_production", () => {
    const r = canTransition("live", "in_production");
    expect(r.ok).toBe(false);
  });
});

describe("status machine — guards", () => {
  it("blocks preview_sent without QA pass", () => {
    const r = canTransition("qa", "preview_sent", { qaReportPassed: false });
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toMatch(/QA/);
  });

  it("allows preview_sent with QA pass", () => {
    const r = canTransition("qa", "preview_sent", { qaReportPassed: true });
    expect(r.ok).toBe(true);
  });

  it("blocks second revision round", () => {
    const r = canTransition("preview_sent", "revision_requested", {
      revisionCount: 1,
    });
    expect(r.ok).toBe(false);
  });

  it("allows first revision round", () => {
    const r = canTransition("preview_sent", "revision_requested", {
      revisionCount: 0,
    });
    expect(r.ok).toBe(true);
  });

  it("blocks live before goLiveEarliestAt", () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const r = canTransition("approved", "live", {
      goLiveEarliestAt: future,
      now: new Date(),
    });
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toMatch(/8-day/);
  });

  it("allows live after goLiveEarliestAt", () => {
    const past = new Date(Date.now() - 1000);
    const r = canTransition("approved", "live", {
      goLiveEarliestAt: past,
      now: new Date(),
    });
    expect(r.ok).toBe(true);
  });

  it("blocks live with pending balance", () => {
    const past = new Date(Date.now() - 1000);
    const r = canTransition("approved", "live", {
      goLiveEarliestAt: past,
      now: new Date(),
      hasPendingBalance: true,
    });
    expect(r.ok).toBe(false);
  });
});

describe("status machine — helpers", () => {
  it("canRefund returns true for active states", () => {
    expect(canRefund("paid")).toBe(true);
    expect(canRefund("preview_sent")).toBe(true);
    expect(canRefund("live")).toBe(false);
    expect(canRefund("refunded")).toBe(false);
  });

  it("transition throws on invalid transition", () => {
    expect(() => transition("paid", "live")).toThrow();
  });
});
