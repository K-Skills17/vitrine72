import { describe, expect, it } from "vitest";
import { buildQualifiedMessage, buildWhatsAppMessage, buildWhatsAppUrl, normalizeBrazilianNumber } from "./whatsapp";

describe("normalizeBrazilianNumber", () => {
  it("keeps a valid mobile number with country code", () => {
    expect(normalizeBrazilianNumber("5511912345678")).toBe("5511912345678");
  });

  it("adds the 55 country code when missing", () => {
    expect(normalizeBrazilianNumber("11912345678")).toBe("5511912345678");
    expect(normalizeBrazilianNumber("1133334444")).toBe("551133334444");
  });

  it("strips punctuation and spaces", () => {
    expect(normalizeBrazilianNumber("+55 (11) 91234-5678")).toBe("5511912345678");
  });

  it("rejects malformed numbers", () => {
    expect(normalizeBrazilianNumber("")).toBeNull();
    expect(normalizeBrazilianNumber(null)).toBeNull();
    expect(normalizeBrazilianNumber("12345")).toBeNull();
    expect(normalizeBrazilianNumber("5501912345678")).toBeNull(); // DDD cannot start with 0
    expect(normalizeBrazilianNumber("5511812345678")).toBeNull(); // 9-digit mobile must start with 9
    expect(normalizeBrazilianNumber("4411912345678")).toBeNull(); // not Brazil
  });
});

describe("buildWhatsAppMessage", () => {
  it("builds a general evaluation message", () => {
    expect(buildWhatsAppMessage({ kind: "evaluation" }, "Clínica ÁUREA")).toBe(
      "Olá! Estava conhecendo o site da Clínica ÁUREA e gostaria de agendar uma avaliação.",
    );
  });

  it("builds a treatment-specific message", () => {
    expect(
      buildWhatsAppMessage({ kind: "treatment", treatmentName: "bioestimuladores de colágeno" }, "Clínica ÁUREA"),
    ).toBe(
      "Olá! Estava conhecendo o site da Clínica ÁUREA e gostaria de saber mais sobre bioestimuladores de colágeno e como funciona a avaliação.",
    );
  });

  it("builds a contact message", () => {
    expect(buildWhatsAppMessage({ kind: "contact" }, "Clínica ÁUREA")).toBe(
      "Olá! Estava conhecendo o site da Clínica ÁUREA e gostaria de falar com a equipe.",
    );
  });
});

describe("buildWhatsAppUrl", () => {
  const message = "Olá! Ácido & colágeno? Sim.";

  it("targets the number and encodes accents, spaces and reserved characters", () => {
    const url = buildWhatsAppUrl(message, "5511912345678");
    expect(url).toBe(
      "https://wa.me/5511912345678?text=Ol%C3%A1!%20%C3%81cido%20%26%20col%C3%A1geno%3F%20Sim.",
    );
  });

  it("round-trips the message exactly", () => {
    const url = new URL(buildWhatsAppUrl(message, "5511912345678"));
    expect(url.searchParams.get("text")).toBe(message);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/5511912345678");
  });

  it("falls back to a recipient-less link when no number is configured", () => {
    const url = new URL(buildWhatsAppUrl(message, null));
    expect(url.pathname).toBe("/");
    expect(url.searchParams.get("text")).toBe(message);
  });
});

describe("buildQualifiedMessage", () => {
  it("lists every answer on its own line", () => {
    const msg = buildQualifiedMessage(
      { name: "Ana", service: "Skinbooster", timing: "Este mês", budget: "R$500–1.500" },
      "Clínica ÁUREA",
    );
    expect(msg).toBe(
      "Olá! Sou Ana e vim pelo site da Clínica ÁUREA.\nInteresse: Skinbooster\nQuando: Este mês\nInvestimento previsto: R$500–1.500\nGostaria de agendar uma avaliação.",
    );
  });

  it("leaves out missing answers", () => {
    expect(buildQualifiedMessage({}, "Clínica ÁUREA")).toBe("Olá! Vim pelo site da Clínica ÁUREA.\nGostaria de agendar uma avaliação.");
  });
});
