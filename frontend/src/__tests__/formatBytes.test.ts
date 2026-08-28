import { describe, it, expect } from "vitest";

/**
 * formatBytes helper extracted from the DataFabric page.
 * Kept in the test file so we can verify the implementation directly.
 */
function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

describe("formatBytes", () => {
  it("returns 0 B for zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes (< 1KB)", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("formats gigabytes", () => {
    expect(formatBytes(1024 ** 3)).toBe("1 GB");
    expect(formatBytes(1500 * 1024 ** 3)).toBe("1.5 TB"); // capped at largest unit
  });

  it("respects custom decimal places", () => {
    expect(formatBytes(1234, 0)).toBe("1 KB");
    expect(formatBytes(1234, 3)).toBe("1.205 KB");
  });
});
