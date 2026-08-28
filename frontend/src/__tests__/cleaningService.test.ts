/**
 * Unit tests for cleaningService — mocked axios responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CleaningResult } from "../types/api";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import {
  getDatasetQuality,
  fillMissingValues,
  removeDuplicates,
  removeIqROutliers,
  removeZScoreOutliers,
  convertDatatype,
  autoCleanDataset,
  getCleaningHistory,
} from "../services/cleaningService";

import api from "../api/axios";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("cleaningService", () => {
  describe("getDatasetQuality", () => {
    it("calls GET /clean/quality", async () => {
      const mockData = { success: true, quality_score: 0.87, issues: 3 };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getDatasetQuality();

      expect(mockGet).toHaveBeenCalledWith("/clean/quality");
      expect(result.quality_score).toBe(0.87);
    });
  });

  describe("fillMissingValues", () => {
    it("posts column, method, and value params", async () => {
      const mockData: CleaningResult = {
        success: true,
        rows_after: 1000,
        rows_removed: 0,
        details: { method: "mean", filled: 5 },
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await fillMissingValues("salary", "mean");

      expect(mockPost).toHaveBeenCalledWith(
        "/clean/missing-values",
        null,
        { params: { column: "salary", method: "mean", value: undefined } }
      );
      expect(result.success).toBe(true);
    });

    it("passes optional constant value", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 995, rows_removed: 0, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      await fillMissingValues("category_col", "constant", "Unknown");

      expect(mockPost).toHaveBeenCalledWith(
        "/clean/missing-values",
        null,
        { params: { column: "category_col", method: "constant", value: "Unknown" } }
      );
    });

    it("propagates API errors", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Column not found"));
      await expect(fillMissingValues("nonexistent_col", "mean")).rejects.toThrow("Column not found");
    });
  });

  describe("removeDuplicates", () => {
    it("posts /clean/duplicates endpoint", async () => {
      const mockData = { success: true, rows_removed: 12 };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await removeDuplicates();

      expect(mockPost).toHaveBeenCalledWith("/clean/duplicates");
      expect(result.rows_removed).toBe(12);
    });
  });

  describe("removeIqROutliers", () => {
    it("posts column param for IQR outlier removal", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 980, rows_removed: 20, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await removeIqROutliers("price");

      expect(mockPost).toHaveBeenCalledWith("/clean/outliers/iqr", null, {
        params: { column: "price" },
      });
      expect(result.rows_removed).toBe(20);
    });
  });

  describe("removeZScoreOutliers", () => {
    it("posts column and threshold params", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 975, rows_removed: 25, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await removeZScoreOutliers("age", 3.0);

      expect(mockPost).toHaveBeenCalledWith("/clean/outliers/zscore", null, {
        params: { column: "age", threshold: 3.0 },
      });
      expect(result.rows_removed).toBe(25);
    });

    it("uses default threshold of 3.0", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 990, rows_removed: 10, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      await removeZScoreOutliers("score");

      expect(mockPost).toHaveBeenCalledWith("/clean/outliers/zscore", null, {
        params: { column: "score", threshold: 3.0 },
      });
    });
  });

  describe("convertDatatype", () => {
    it("posts column and datatype params", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 1000, rows_removed: 0, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      await convertDatatype("quantity", "int");

      expect(mockPost).toHaveBeenCalledWith("/clean/datatype", null, {
        params: { column: "quantity", datatype: "int" },
      });
    });

    it("converts to datetime type", async () => {
      const mockData: CleaningResult = { success: true, rows_after: 1000, rows_removed: 0, details: {} };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      await convertDatatype("created_at", "datetime");

      expect(mockPost).toHaveBeenCalledWith("/clean/datatype", null, {
        params: { column: "created_at", datatype: "datetime" },
      });
    });
  });

  describe("autoCleanDataset", () => {
    it("posts auto-clean endpoint and returns success", async () => {
      const mockData = { success: true, operations_applied: 4, rows_cleaned: 50 };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await autoCleanDataset();

      expect(mockPost).toHaveBeenCalledWith("/clean/auto-clean");
      expect(result.operations_applied).toBe(4);
    });
  });

  describe("getCleaningHistory", () => {
    it("calls GET /clean/history", async () => {
      const mockData = { success: true, history: [{ operation: "fill_missing", timestamp: "2025-01-01T00:00:00Z" }] };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getCleaningHistory();

      expect(mockGet).toHaveBeenCalledWith("/clean/history");
      expect(result.history).toHaveLength(1);
    });
  });
});
