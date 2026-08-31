/**
 * Unit tests for adminService — stats and audit logs.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from "../api/axios";
import { getAdminStats, getAuditLogs } from "../services/adminService";

const mockGet = api.get as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("adminService", () => {
  describe("getAdminStats", () => {
    it("GETs /api/admin/stats", async () => {
      const mockStats = {
        total_requests: 1000,
        total_uploads: 50,
        total_cleaning_ops: 30,
        total_charts_generated: 200,
        total_ml_runs: 10,
        total_reports_generated: 25,
        uptime_seconds: 86400,
        environment: "production",
        version: "1.0.0",
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockStats });

      const result = await getAdminStats();
      expect(mockGet).toHaveBeenCalledWith("/api/admin/stats");
      expect(result.total_requests).toBe(1000);
      expect(result.environment).toBe("production");
    });
  });

  describe("getAuditLogs", () => {
    it("uses default page=1 and page_size=50", async () => {
      const mockResponse = { entries: [], total: 0, page: 1, page_size: 50, has_next: false };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockResponse });

      await getAuditLogs();
      expect(mockGet).toHaveBeenCalledWith("/api/admin/audit-logs", {
        params: { page: 1, page_size: 50 },
      });
    });

    it("respects custom page and pageSize args", async () => {
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });
      await getAuditLogs(3, 100);
      expect(mockGet).toHaveBeenCalledWith("/api/admin/audit-logs", {
        params: { page: 3, page_size: 100 },
      });
    });
  });
});