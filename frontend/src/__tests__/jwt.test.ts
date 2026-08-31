/**
 * Unit tests for JWT helpers.
 */
import { describe, it, expect } from "vitest";
import { decodeJwt, isJwtExpired, msUntilExpiry } from "../lib/jwt";

// Helper to mint a JWT with a custom exp (forwards-compatible with future test cases).
function mintToken(payload: Record<string, unknown>): string {
  const b64 = btoa(JSON.stringify(payload)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `header.${b64}.signature`;
}

describe("decodeJwt", () => {
  it("returns null for empty input", () => {
    expect(decodeJwt(null)).toBeNull();
    expect(decodeJwt("")).toBeNull();
    expect(decodeJwt(undefined)).toBeNull();
  });

  it("returns null for malformed token", () => {
    expect(decodeJwt("not.a.jwt")).toBeNull();
    expect(decodeJwt("only-one-part")).toBeNull();
  });

  it("decodes a valid JWT payload", () => {
    const token = mintToken({ sub: "user_1", exp: 9999999999 });
    const payload = decodeJwt(token);
    expect(payload?.sub).toBe("user_1");
    expect(payload?.exp).toBe(9999999999);
  });
});

describe("isJwtExpired", () => {
  it("returns true for null/empty", () => {
    expect(isJwtExpired(null)).toBe(true);
    expect(isJwtExpired("")).toBe(true);
  });

  it("returns true when exp is in the past", () => {
    const past = mintToken({ exp: Math.floor(Date.now() / 1000) - 100 });
    expect(isJwtExpired(past)).toBe(true);
  });

  it("returns false when exp is in the future", () => {
    const future = mintToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(isJwtExpired(future)).toBe(false);
  });

  it("returns true when exp is missing (fail closed)", () => {
    const noExp = mintToken({ sub: "x" });
    expect(isJwtExpired(noExp)).toBe(true);
  });

  it("respects the leeway argument", () => {
    const tenSecFromNow = mintToken({ exp: Math.floor(Date.now() / 1000) + 10 });
    expect(isJwtExpired(tenSecFromNow, 0)).toBe(false);
    expect(isJwtExpired(tenSecFromNow, 60)).toBe(true);
  });
});

describe("msUntilExpiry", () => {
  it("returns 0 for missing/expired token", () => {
    expect(msUntilExpiry(null)).toBe(0);
    const past = mintToken({ exp: Math.floor(Date.now() / 1000) - 100 });
    expect(msUntilExpiry(past)).toBe(0);
  });

  it("returns positive ms for unexpired token", () => {
    const future = mintToken({ exp: Math.floor(Date.now() / 1000) + 60 });
    const ms = msUntilExpiry(future);
    expect(ms).toBeGreaterThan(50_000);
    expect(ms).toBeLessThanOrEqual(60_000);
  });
});
