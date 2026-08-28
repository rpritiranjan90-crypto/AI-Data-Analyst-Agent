/**
 * Unit tests for governanceService — mocked axios responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getGovernanceStats,
  recordAIMetrics,
  getAIHealth,
  type GovernanceStats,
} from "../services/governanceService";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from "../api/axios";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("governanceService", () => {
  describe("getGovernanceStats", () => {
    it("calls GET /api/governance/stats and returns governance data", async () => {
      const mockData: GovernanceStats = {
        token_consumption: {
          last_hour: 3200,
          last_24h: 18500,
          total_all_time: 85000,
          model: "gemini-2.0-flash",
          estimated_cost_usd: 0.42,
        },
        request_metrics: {
          total_requests: 142,
          requests_last_hour: 15,
          requests_last_24h: 120,
          avg_latency_ms: 820,
          success_rate_pct: 97.2,
          error_count_last_24h: 3,
          error_rate_pct: 2.8,
        },
        ai_provider_status: {
          provider: "gemini",
          model: "gemini-2.0-flash",
          status: "available",
          message: "API key configured",
        },
        safety_policies: {
          prompt_injection_shield: true,
          sql_read_only_sandbox: true,
          dde_formula_sanitization: true,
          output_validation: true,
        },
        uptime_seconds: 86400,
        platform: { python: "3.11", fastapi: "0.115" },
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getGovernanceStats();

      expect(mockGet).toHaveBeenCalledWith("/api/governance/stats");
      expect(result.token_consumption.model).toBe("gemini-2.0-flash");
      expect(result.safety_policies.prompt_injection_shield).toBe(true);
      expect(result.request_metrics.success_rate_pct).toBeCloseTo(97.2);
    });

    it("handles zero-state governance response", async () => {
      const mockData: GovernanceStats = {
        token_consumption: {
          last_hour: 0,
          last_24h: 0,
          total_all_time: 0,
          model: "gemini-2.0-flash",
          estimated_cost_usd: 0,
        },
        request_metrics: {
          total_requests: 0,
          requests_last_hour: 0,
          requests_last_24h: 0,
          avg_latency_ms: 0,
          error_count_last_24h: 0,
          error_rate_pct: 0,
          success_rate_pct: 0,
        },
        ai_provider_status: {
          provider: "gemini",
          model: "gemini-2.0-flash",
          status: "unavailable",
          message: "No API key configured",
        },
        safety_policies: {
          prompt_injection_shield: false,
          sql_read_only_sandbox: false,
          dde_formula_sanitization: false,
          output_validation: false,
        },
        uptime_seconds: 0,
        platform: {},
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getGovernanceStats();

      expect(result.request_metrics.total_requests).toBe(0);
      expect(result.ai_provider_status.status).toBe("unavailable");
    });

    it("propagates axios errors", async () => {
      (mockGet as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Governance endpoint unreachable"));
      await expect(getGovernanceStats()).rejects.toThrow("Governance endpoint unreachable");
    });
  });

  describe("recordAIMetrics", () => {
    it("posts token count and latency with defaults", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

      await recordAIMetrics();

      expect(mockPost).toHaveBeenCalledWith("/api/governance/record", {
        tokens: 0,
        latency_ms: 0,
        success: true,
      });
    });

    it("posts custom metrics values", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

      await recordAIMetrics(500, 1200, true);

      expect(mockPost).toHaveBeenCalledWith("/api/governance/record", {
        tokens: 500,
        latency_ms: 1200,
        success: true,
      });
    });

    it("posts failure metrics", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { success: true } });

      await recordAIMetrics(200, 5000, false);

      expect(mockPost).toHaveBeenCalledWith("/api/governance/record", {
        tokens: 200,
        latency_ms: 5000,
        success: false,
      });
    });
  });

  describe("getAIHealth", () => {
    it("calls GET /api/governance/health and returns provider status", async () => {
      const mockData = {
        provider: "gemini",
        model: "gemini-2.0-flash",
        status: "available" as const,
        message: "All systems operational",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAIHealth();

      expect(mockGet).toHaveBeenCalledWith("/api/governance/health");
      expect(result.provider).toBe("gemini");
      expect(result.status).toBe("available");
    });

    it("handles unavailable AI provider status", async () => {
      const mockData = {
        provider: "gemini",
        model: "gemini-2.0-flash",
        status: "unavailable" as const,
        message: "API key not configured",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAIHealth();

      expect(result.status).toBe("unavailable");
    });
  });
});
