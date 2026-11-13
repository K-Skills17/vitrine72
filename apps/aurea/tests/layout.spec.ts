import { expect, test } from "@playwright/test";
import { routes } from "./helpers";

test("no horizontal overflow on any route", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("images have alt text and the skip link works", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt, path).toBe(0);
  }
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
});

test("conversion entry points match the viewport", async ({ page, isMobile }) => {
  await page.goto("/");
  const sticky = page.locator('a[data-cta-location="sticky-mobile"]');
  const floating = page.locator('a[data-cta-location="floating"]');
  if (isMobile) {
    await expect(sticky).toBeVisible();
    await expect(floating).toBeHidden();
  } else {
    await expect(sticky).toBeHidden();
    await page.mouse.wheel(0, 1600);
    await expect(floating).toHaveCSS("opacity", "1");
  }
});
