import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "ops_token";

export { COOKIE as OPS_COOKIE };

function makeToken(secret: string): string {
  return createHmac("sha256", secret).update("ops_session").digest("hex");
}

export function verifyOpsToken(token: string | undefined): boolean {
  const secret = process.env.OPS_SECRET ?? process.env.DISCOUNT_SECRET ?? "";
  if (!token || !secret) return false;
  try {
    const expected = makeToken(secret);
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function createOpsToken(): string {
  const secret = process.env.OPS_SECRET ?? process.env.DISCOUNT_SECRET ?? "";
  return makeToken(secret);
}
