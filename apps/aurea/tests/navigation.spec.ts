import { expect, test } from "@playwright/test";
import { routes } from "./helpers";

test.describe("routes", () => {
  for (const path of routes) {
    test(`${path} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }

  test("unknown treatment returns 404", async ({ page }) => {
    const res = await page.goto("/tratamentos/nao-existe");
    expect(res?.status()).toBe(404);
  });

  test("demo is not indexable", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /");
  });

  test("sitemap lists every route", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const path of routes.filter((r) => r !== "/")) expect(xml).toContain(path);
  });
});
