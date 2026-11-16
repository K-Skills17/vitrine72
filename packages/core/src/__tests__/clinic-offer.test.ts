import { describe, expect, it } from "vitest";
import { CLINIC_OFFER, clinicFoundingLeft, clinicGuarantee } from "../offer";

describe("clinic offer", () => {
  it("picks the guarantee row from the higher view count", () => {
    expect(clinicGuarantee(999)).toBeNull();
    expect(clinicGuarantee(1000)).toBe(10);
    expect(clinicGuarantee(3000)).toBe(10);
    expect(clinicGuarantee(3001)).toBe(20);
  });

  it("founding spots never go negative", () => {
    expect(clinicFoundingLeft()).toBe(CLINIC_OFFER.foundingSpots - CLINIC_OFFER.foundingSold);
    expect(clinicFoundingLeft()).toBeGreaterThanOrEqual(0);
  });
});
