import { describe, it, expect } from "vitest";

/**
 * formatTimeAgo helper extracted from DataFabric page for testability.
 */
function formatTimeAgo(iso: string, now: Date = new Date()): string {
  const past = new Date(iso);
  const diffMs = now.getTime() - past.getTime();
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

describe("formatTimeAgo", () => {
  const now = new Date("2026-08-28T12:00:00Z");

  it("returns 'just now' for < 60 seconds", () => {
    const iso = new Date(now.getTime() - 30 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("just now");
  });

  it("formats minutes", () => {
    const iso = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("5m ago");
  });

  it("formats hours", () => {
    const iso = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("3h ago");
  });

  it("formats days", () => {
    const iso = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("4d ago");
  });

  it("formats months", () => {
    const iso = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("2mo ago");
  });

  it("formats years", () => {
    const iso = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(iso, now)).toBe("1y ago");
  });
});
