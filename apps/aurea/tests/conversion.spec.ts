import { expect, test } from "@playwright/test";
import { captureWindowOpen } from "./helpers";

test("hero CTA goes through the four-step qualification gate", async ({ page }) => {
  const opened = await captureWindowOpen(page);
  await page.goto("/");
  await page.locator('a[data-cta-location="hero"]').click();
  const gate = page.locator("dialog[open]");
  await expect(gate).toContainText("Etapa 1 de 4");
  await gate.locator('input[name="answer"]').fill("Ana");
  await gate.getByRole("button", { name: "Continuar" }).click();
  await gate.getByRole("button", { name: /Skinbooster/ }).click();
  await gate.getByRole("button", { name: /Este mês/ }).click();
  await gate.getByRole("button", { name: /R\$500–1\.500/ }).click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  const [url] = await opened();
  expect(decodeURIComponent(url ?? "")).toContain("Sou Ana");
  expect(decodeURIComponent(url ?? "")).toContain("Interesse: Skinbooster");
});

test("treatment CTA preselects the treatment (three steps)", async ({ page }) => {
  const opened = await captureWindowOpen(page);
  await page.goto("/tratamentos/laser-dermatologico");
  await page.locator('a[data-cta-location="treatment-hero"]').click();
  const gate = page.locator("dialog[open]");
  await expect(gate).toContainText("Etapa 1 de 3");
  await gate.locator('input[name="answer"]').fill("Bia");
  await gate.getByRole("button", { name: "Continuar" }).click();
  await gate.getByRole("button", { name: /Esta semana/ }).click();
  await gate.getByRole("button", { name: /Acima/ }).click();
  expect(decodeURIComponent((await opened())[0] ?? "")).toContain("Interesse: Laser dermatológico");
});

test("gate closes with Escape", async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto("/contato");
  await page.locator('a[data-cta-location="contact-page"]').click();
  await expect(page.locator("dialog[open]")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("inquiry form validates and shows the honest demo state", async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto("/contato");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.locator("#inq-name")).toBeFocused();
  await expect(page.locator("#inq-consent-error")).toBeVisible();
  await page.fill("#inq-name", "Ana");
  await page.fill("#inq-phone", "(11) 91234-5678");
  await page.check("#inq-consent");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("status")).toContainText("nenhum dado foi enviado");
});
