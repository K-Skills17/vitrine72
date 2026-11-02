import { test, expect } from "@playwright/test";

const niche = process.env.NEXT_PUBLIC_NICHE ?? "estetica";

test.describe(`WhatsApp gate — ${niche}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("no direct wa.me links on the page (gate enforced)", async ({ page }) => {
    const directLinks = page.locator("a[href^='https://wa.me/']");
    await expect(directLinks).toHaveCount(0);
  });

  test("hero CTA opens qualifier, not WhatsApp", async ({ page }) => {
    await page.locator("[data-testid='hero-cta-btn']").click();
    await expect(page.locator("[data-testid='qualifier-overlay']")).toBeVisible();
    // Confirm no wa.me navigation happened
    expect(page.url()).not.toContain("wa.me");
  });

  test("nav CTA opens qualifier", async ({ page }) => {
    await page.locator("[data-testid='nav-cta-btn']").click();
    await expect(page.locator("[data-testid='qualifier-overlay']")).toBeVisible();
  });

  test("floating WhatsApp button opens qualifier", async ({ page }) => {
    await page.locator("[data-testid='float-wa-btn']").click();
    await expect(page.locator("[data-testid='qualifier-overlay']")).toBeVisible();
  });

  test("service card CTA opens qualifier", async ({ page }) => {
    const firstBtn = page.locator("[data-testid^='service-cta-']").first();
    await firstBtn.click();
    await expect(page.locator("[data-testid='qualifier-overlay']")).toBeVisible();
  });
});

test.describe(`Qualifier flow — ${niche}`, () => {
  test("completes all steps → redirects to wa.me with answers URL-encoded", async ({
    page,
    context,
  }) => {
    const popupPromise = context.waitForEvent("page");

    await page.goto("/");
    await page.locator("[data-testid='hero-cta-btn']").click();
    await expect(page.locator("[data-testid='qualifier-sheet']")).toBeVisible();

    // Step 1 — name
    await page.locator("[data-testid='qualifier-text-input']").fill("TestUser");
    await page.locator("[data-testid='qualifier-next-btn']").click();

    // Step 2 — service / ambiente (first option)
    await page
      .locator("[data-testid='qualifier-choices'] button")
      .first()
      .click();

    // Step 3 — timing / situação (first option — not low fit)
    await page
      .locator("[data-testid='qualifier-choices'] button")
      .first()
      .click();

    // Step 4 — budget (last option — highest, not low fit)
    await page
      .locator("[data-testid='qualifier-choices'] button")
      .last()
      .click();

    const popup = await popupPromise;
    const url = popup.url();

    // Must start with wa.me
    expect(url).toMatch(/^https:\/\/wa\.me\//);
    // Must contain the text= param
    expect(url).toContain("text=");
    // Name must be URL-encoded in the message
    expect(url).toContain(encodeURIComponent("TestUser"));
    // Marker phrase
    expect(url).toContain(encodeURIComponent("Vim pelo site"));
  });

  test("back button keeps step visible (state preserved)", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-testid='hero-cta-btn']").click();

    // Fill step 1
    await page.locator("[data-testid='qualifier-text-input']").fill("João");
    await page.locator("[data-testid='qualifier-next-btn']").click();

    // Now on step 2 — choices
    await expect(page.locator("[data-testid='qualifier-choices']")).toBeVisible();

    // Go back
    await page.locator("[data-testid='qualifier-back-btn']").click();

    // Step 1 should be visible again
    await expect(page.locator("[data-testid='qualifier-question']")).toBeVisible();
    await expect(page.locator("[data-testid='qualifier-text-input']")).toBeVisible();
  });

  test("progress bar advances each step", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-testid='hero-cta-btn']").click();

    const bar = page.locator("[role='progressbar']");
    const initialWidth = await bar.getAttribute("aria-valuenow");
    expect(Number(initialWidth)).toBe(0);

    // Complete step 1
    await page.locator("[data-testid='qualifier-text-input']").fill("Ana");
    await page.locator("[data-testid='qualifier-next-btn']").click();

    const step2Width = await bar.getAttribute("aria-valuenow");
    expect(Number(step2Width)).toBeGreaterThan(0);
  });

  test("Escape key closes qualifier", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-testid='hero-cta-btn']").click();
    await expect(page.locator("[data-testid='qualifier-overlay']")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("[data-testid='qualifier-overlay']")).not.toBeVisible();
  });
});

test.describe(`Low-fit flow — ${niche} (tag mode)`, () => {
  test("low-fit answers still redirect to WhatsApp in tag mode", async ({
    page,
    context,
  }) => {
    const popupPromise = context.waitForEvent("page");

    await page.goto("/");
    await page.locator("[data-testid='hero-cta-btn']").click();

    // Step 1
    await page.locator("[data-testid='qualifier-text-input']").fill("LowFit");
    await page.locator("[data-testid='qualifier-next-btn']").click();

    // Step 2 — any service
    await page.locator("[data-testid='qualifier-choices'] button").first().click();

    // Step 3 — last option (low-fit: "Só pesquisando" for estetica, last for planejados)
    await page.locator("[data-testid='qualifier-choices'] button").last().click();

    // Step 4 — first option (lowest budget — low fit)
    await page.locator("[data-testid='qualifier-choices'] button").first().click();

    const popup = await popupPromise;
    expect(popup.url()).toMatch(/^https:\/\/wa\.me\//);
  });
});
