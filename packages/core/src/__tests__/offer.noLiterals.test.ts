/**
 * Enforces that no R$ price literals appear outside of packages/core/src/offer.ts.
 * This test greps the entire apps/ directory and other packages for hard-coded prices.
 */

import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";

// Normalize to native path (handles /c/Users/... on Windows git bash)
const ROOT = path.resolve(__dirname, "../../../../../").replace(/^\/([a-zA-Z])\//, "$1:\\");

/**
 * These are the known offer prices. Any of these numbers appearing as
 * standalone R$ literals in source files outside offer.ts is an error.
 */
const OFFER_PRICES = [1997, 1797, 3497, 3147, 397, 497, 997, 97, 300, 400, 20];

describe("offer.ts price literal enforcement", () => {
  it("no R$ price literals in apps/ or packages/ outside offer.ts", () => {
    const violations: string[] = [];

    for (const price of OFFER_PRICES) {
      // Look for patterns like R$ 1.997 or R$1997 or "1997" as standalone values
      // We grep for R\$.*price patterns in ts/tsx files outside offer.ts
      try {
        const result = execSync(
          `grep -rn "R\\$[[:space:]]*${price}\\b\\|R\\$[[:space:]]*${formatBRL(price)}\\b" ` +
            `"${ROOT}/apps" "${ROOT}/packages" ` +
            `--include="*.ts" --include="*.tsx" ` +
            `--exclude="offer.ts" --exclude="*.test.ts" --exclude="*.spec.ts" ` +
            `|| true`,
          { encoding: "utf-8", cwd: ROOT }
        );
        if (result.trim()) {
          violations.push(`Price R$${price} found:\n${result}`);
        }
      } catch {
        // grep returns non-zero when no matches; that's fine
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Hard-coded R$ price literals found outside offer.ts:\n\n${violations.join("\n")}\n\n` +
          `Import prices from @vitrine72/core instead.`
      );
    }
  });
});

function formatBRL(n: number): string {
  // Converts 1997 → "1.997" for Brazilian format matching
  return n.toLocaleString("pt-BR");
}
