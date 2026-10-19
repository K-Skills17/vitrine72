import { describe, it, expect } from "vitest";
import { validateCPF, validateCNPJ } from "../validators.js";

describe("validateCPF", () => {
  it("accepts valid CPF", () => {
    // Well-known test CPF
    expect(validateCPF("12345678909")).toBe(true);
  });

  it("rejects CPF with wrong check digits", () => {
    expect(validateCPF("12345678900")).toBe(false);
  });

  it("rejects all-same-digit CPF", () => {
    expect(validateCPF("11111111111")).toBe(false);
    expect(validateCPF("00000000000")).toBe(false);
  });

  it("rejects CPF with formatting", () => {
    // Our validator strips non-digits, so formatted should work
    expect(validateCPF("123.456.789-09")).toBe(true);
  });

  it("rejects too-short CPF", () => {
    expect(validateCPF("1234567")).toBe(false);
  });
});

describe("validateCNPJ", () => {
  it("accepts valid CNPJ", () => {
    // Well-known test CNPJ
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("rejects CNPJ with wrong check digits", () => {
    expect(validateCNPJ("11222333000100")).toBe(false);
  });

  it("rejects all-same-digit CNPJ", () => {
    expect(validateCNPJ("11111111111111")).toBe(false);
  });

  it("rejects too-short CNPJ", () => {
    expect(validateCNPJ("1122233300018")).toBe(false);
  });
});
