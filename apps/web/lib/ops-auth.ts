import { createHmac, timingSafeEqual } from "crypto";

export const OPS_COOKIE = "ops_token";

function makeToken(password: string): string {
  return createHmac("sha256", password).update("ops_session_v1").digest("hex");
}

export function verifyOpsToken(token: string | undefined): boolean {
  const password = process.env.OPS_PASSWORD ?? "";
  if (!token || !password) return false;
  try {
    const expected = makeToken(password);
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function createOpsToken(): string {
  return makeToken(process.env.OPS_PASSWORD ?? "");
}
