import type { Page } from "@playwright/test";

export const routes = [
  "/",
  "/tratamentos",
  "/tratamentos/toxina-botulinica",
  "/tratamentos/bioestimuladores-de-colageno",
  "/tratamentos/preenchimento-facial",
  "/tratamentos/skinbooster",
  "/tratamentos/laser-dermatologico",
  "/tratamentos/qualidade-da-pele",
  "/clinica",
  "/profissionais",
  "/contato",
  "/privacidade",
];

/** Captures window.open calls instead of opening WhatsApp, and keeps the chat closed. */
export async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
    try {
      sessionStorage.setItem("lk_chat_auto_opened", "1");
    } catch {}
  });
  return () => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
}
