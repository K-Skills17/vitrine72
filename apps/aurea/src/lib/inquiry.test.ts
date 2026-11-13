import { describe, expect, it } from "vitest";
import { submitInquiry, validateInquiry, type InquiryInput } from "./inquiry";

const valid: InquiryInput = {
  name: "Ana",
  phone: "(11) 91234-5678",
  email: "",
  treatment: "",
  period: "",
  message: "",
  consent: true,
};

describe("validateInquiry", () => {
  it("accepts the minimum valid input", () => {
    expect(validateInquiry(valid)).toEqual({});
  });
  it("requires name, a valid mobile and consent", () => {
    const errors = validateInquiry({ ...valid, name: " ", phone: "1234", consent: false });
    expect(Object.keys(errors).sort()).toEqual(["consent", "name", "phone"]);
  });
  it("checks e-mail only when given", () => {
    expect(validateInquiry({ ...valid, email: "ana@" }).email).toBeDefined();
  });
});

describe("submitInquiry", () => {
  it("does not send anything without an endpoint", async () => {
    expect(await submitInquiry(valid)).toEqual({ status: "demo" });
  });
});
