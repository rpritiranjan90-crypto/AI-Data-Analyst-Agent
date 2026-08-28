/**
 * Unit tests for readinessService — mocked axios responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReadinessResponse } from "../services/readinessService";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import { getReadinessChecks } from "../services/readinessService";

import api from "../api/axios";
const mockGet = api.get as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("readinessService", () => {
  describe("getReadinessChecks", () => {
    it("calls GET /api/readiness/check and returns readiness data", async () => {
      const mockData: ReadinessResponse = {
        total_score: 85,
        max_score: 100,
        grade: "B",
        checks: [
          { name: "CORS Configuration", category: "Security", passed: true, score: 10, details: "Allowed origins configured", checked_at: "2025-01-01T00:00:00Z" },
          { name: "Rate Limiting", category: "Security", passed: true, score: 15, details: "Rate limiter active", checked_at: "2025-01-01T00:00:00Z" },
          { name: "Security Headers", category: "Security", passed: false, score: 0, details: "HSTS header missing", checked_at: "2025-01-01T00:00:00Z" },
          { name: "AI Provider", category: "AI", passed: true, score: 20, details: "Gemini API key configured", checked_at: "2025-01-01T00:00:00Z" },
        ],
        environment: { APP_ENV: "production" },
        checked_at: "2025-01-01T00:00:00Z",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getReadinessChecks();

      expect(mockGet).toHaveBeenCalledWith("/api/readiness/check");
      expect(result.total_score).toBe(85);
      expect(result.max_score).toBe(100);
      expect(result.grade).toBe("B");
      expect(result.checks).toHaveLength(4);
      expect(result.checks.filter((c) => c.passed)).toHaveLength(3);
      expect(result.checks.filter((c) => !c.passed)).toHaveLength(1);
    });

    it("handles perfect readiness score", async () => {
      const mockData: ReadinessResponse = {
        total_score: 100,
        max_score: 100,
        grade: "A+",
        checks: [
          { name: "All Checks", category: "General", passed: true, score: 100, details: "All systems operational", checked_at: "2025-01-01T00:00:00Z" },
        ],
        environment: { APP_ENV: "development" },
        checked_at: "2025-01-01T00:00:00Z",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getReadinessChecks();

      expect(result.total_score).toBe(100);
      expect(result.grade).toBe("A+");
    });

    it("handles empty checks array", async () => {
      const mockData: ReadinessResponse = {
        total_score: 0,
        max_score: 0,
        grade: "N/A",
        checks: [],
        environment: {},
        checked_at: "2025-01-01T00:00:00Z",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getReadinessChecks();

      expect(result.checks).toHaveLength(0);
    });

    it("includes environment metadata in response", async () => {
      const mockData: ReadinessResponse = {
        total_score: 50,
        max_score: 100,
        grade: "C",
        checks: [],
        environment: { APP_ENV: "staging", VERSION: "2.0.0" },
        checked_at: "2025-01-01T00:00:00Z",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getReadinessChecks();

      expect(result.environment.APP_ENV).toBe("staging");
    });

    it("propagates axios errors", async () => {
      (mockGet as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Backend unreachable"));
      await expect(getReadinessChecks()).rejects.toThrow("Backend unreachable");
    });
  });
});
