import { describe, it, expect } from "vitest";
import {
  calcPaymentCommissions,
  calcMaintenanceKicker,
  calcMonthlyBonus,
  calcDrawEntry,
  calcClawback,
} from "../commissions.js";

const BASE = {
  projectId: "proj_001",
  paymentDate: new Date("2025-01-06T10:00:00Z"),
};

describe("calcPaymentCommissions — seller pix", () => {
  it("produces two entries: upfront and day8", () => {
    const entries = calcPaymentCommissions({
      ...BASE,
      grossAmount: 1797,
      method: "pix",
      source: "seller",
      sellerId: "seller_01",
    });
    expect(entries).toHaveLength(2);
    const upfront = entries.find((e) => e.kind === "seller_upfront");
    const day8 = entries.find((e) => e.kind === "seller_day8");
    expect(upfront).toBeDefined();
    expect(day8).toBeDefined();
    // 10% of 1797 = 179.70; 50% = 89.85 each
    expect(upfront!.commissionAmount).toBeCloseTo(89.85, 1);
    expect(day8!.commissionAmount).toBeCloseTo(89.85, 1);
    expect(upfront!.dueAt).toBe("2025-01-06");
    expect(day8!.dueAt).toBe("2025-01-14"); // +8 days
  });
});

describe("calcPaymentCommissions — seller card", () => {
  it("produces one entry at day 8", () => {
    const entries = calcPaymentCommissions({
      ...BASE,
      grossAmount: 1997,
      method: "card",
      source: "seller",
      sellerId: "seller_01",
    });
    expect(entries).toHaveLength(1);
    const e = entries[0];
    expect(e.kind).toBe("seller_day8");
    expect(e.commissionAmount).toBeCloseTo(199.7, 1); // 10%
    expect(e.dueAt).toBe("2025-01-14");
  });
});

describe("calcPaymentCommissions — partner self-checkout", () => {
  it("produces partner entry at 20%", () => {
    const entries = calcPaymentCommissions({
      ...BASE,
      grossAmount: 1797,
      method: "pix",
      source: "partner",
      partnerId: "partner_01",
    });
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe("partner_self_checkout");
    expect(entries[0].commissionAmount).toBeCloseTo(359.4, 1); // 20%
  });
});

describe("calcPaymentCommissions — seller_partner split", () => {
  it("produces seller 5% and partner 15%", () => {
    const entries = calcPaymentCommissions({
      ...BASE,
      grossAmount: 1797,
      method: "pix",
      source: "seller_partner",
      sellerId: "seller_01",
      partnerId: "partner_01",
    });
    const sellerEntries = entries.filter((e) => e.sellerId === "seller_01");
    const partnerEntries = entries.filter((e) => e.partnerId === "partner_01");
    // Seller: 5% of 1797 = 89.85, split 50/50 pix
    const sellerTotal = sellerEntries.reduce((s, e) => s + e.commissionAmount, 0);
    expect(sellerTotal).toBeCloseTo(89.85, 1);
    // Partner: 15% of 1797 = 269.55
    expect(partnerEntries[0].commissionAmount).toBeCloseTo(269.55, 1);
  });
});

describe("calcMaintenanceKicker", () => {
  it("returns R$ 20 kicker", () => {
    const e = calcMaintenanceKicker({
      projectId: "proj_001",
      sellerId: "seller_01",
      clearedAt: new Date("2025-02-01"),
    });
    expect(e.commissionAmount).toBe(20);
    expect(e.kind).toBe("seller_maintenance_kicker");
  });
});

describe("calcMonthlyBonus", () => {
  it("returns null below threshold", () => {
    const result = calcMonthlyBonus({
      sellerId: "s1",
      month: "2025-01",
      closedCount: 7,
    });
    expect(result).toBeNull();
  });

  it("returns R$ 300 at threshold", () => {
    const result = calcMonthlyBonus({
      sellerId: "s1",
      month: "2025-01",
      closedCount: 8,
    });
    expect(result).not.toBeNull();
    expect(result!.commissionAmount).toBe(300);
  });
});

describe("calcDrawEntry", () => {
  it("returns R$ -400 for week 1", () => {
    const e = calcDrawEntry({ sellerId: "s1", week: "2025-W02", weekNumber: 1 });
    expect(e!.commissionAmount).toBe(-400);
  });

  it("returns null for week 5+", () => {
    const e = calcDrawEntry({ sellerId: "s1", week: "2025-W06", weekNumber: 5 });
    expect(e).toBeNull();
  });
});

describe("calcClawback", () => {
  it("creates negative entries for all non-draw originals", () => {
    const originals = calcPaymentCommissions({
      ...BASE,
      grossAmount: 1997,
      method: "card",
      source: "seller",
      sellerId: "seller_01",
    });
    const clawbacks = calcClawback(originals, new Date("2025-02-01"));
    expect(clawbacks).toHaveLength(1);
    expect(clawbacks[0].commissionAmount).toBeLessThan(0);
    expect(clawbacks[0].kind).toBe("clawback");
  });
});
