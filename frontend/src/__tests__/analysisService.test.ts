/**
 * Unit tests for analysisService — mocked axios responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AnalysisSummaryResponse, AnalysisDescriptiveResponse, AnalysisCorrelationResponse } from "../types/api";

// vi.mock is hoisted — all factory variables must be declared inside it
vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import {
  getDatasetSummary,
  getDescriptiveStatistics,
  getMissingValuesAnalysis,
  getColumnTypes,
  getCorrelationMatrix,
  runNaturalLanguageQuery,
} from "../services/analysisService";

import api from "../api/axios";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("analysisService", () => {
  describe("getDatasetSummary", () => {
    it("calls GET /analysis/summary with no params when no filename", async () => {
      const mockData: AnalysisSummaryResponse = {
        success: true,
        rows: 1000,
        columns: 5,
        missing_values: { age: 3, salary: 7 },
        statistics: { age: { mean: 35, std: 8 } },
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getDatasetSummary();

      expect(mockGet).toHaveBeenCalledWith("/analysis/summary", { params: {} });
      expect(result).toEqual(mockData);
    });

    it("passes filename as query param when provided", async () => {
      const mockData: AnalysisSummaryResponse = { success: true, rows: 500, columns: 3, missing_values: {}, statistics: {} };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      await getDatasetSummary("sales_data.csv");

      expect(mockGet).toHaveBeenCalledWith("/analysis/summary", {
        params: { filename: "sales_data.csv" },
      });
    });

    it("propagates errors from axios", async () => {
      const error = new Error("Network error");
      (mockGet as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);

      await expect(getDatasetSummary()).rejects.toThrow("Network error");
    });
  });

  describe("getDescriptiveStatistics", () => {
    it("returns descriptive stats from the backend", async () => {
      const mockData: AnalysisDescriptiveResponse = {
        success: true,
        columns: ["price", "quantity"],
        statistics: {
          price: { mean: 29.99, std: 5.2, min: 9.99, max: 99.99 },
          quantity: { mean: 3.1, std: 1.4, min: 1, max: 10 },
        },
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getDescriptiveStatistics("products.csv");

      expect(mockGet).toHaveBeenCalledWith("/analysis/descriptive", {
        params: { filename: "products.csv" },
      });
      expect(result.statistics.price.mean).toBe(29.99);
    });
  });

  describe("getMissingValuesAnalysis", () => {
    it("returns missing value breakdown", async () => {
      const mockData = { success: true, total_missing: 10, by_column: { email: 5, phone: 5 }, missing_pct: { email: 1.2 } };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getMissingValuesAnalysis();

      expect(mockGet).toHaveBeenCalledWith("/analysis/missing-values", { params: {} });
      expect(result.total_missing).toBe(10);
    });
  });

  describe("getColumnTypes", () => {
    it("returns column type mapping", async () => {
      const mockData = { success: true, column_types: { id: "number", name: "string", created_at: "datetime" } };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getColumnTypes();

      expect(result.column_types.id).toBe("number");
      expect(result.column_types.created_at).toBe("datetime");
    });
  });

  describe("getCorrelationMatrix", () => {
    it("returns correlation matrix with column list", async () => {
      const mockData: AnalysisCorrelationResponse = {
        success: true,
        columns: ["x", "y", "z"],
        matrix: [
          [1.0, 0.8, -0.3],
          [0.8, 1.0, 0.1],
          [-0.3, 0.1, 1.0],
        ],
      };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getCorrelationMatrix();

      expect(result.columns).toHaveLength(3);
      expect(result.matrix[0][1]).toBeCloseTo(0.8);
    });
  });

  describe("runNaturalLanguageQuery", () => {
    it("posts the query and returns result", async () => {
      const mockData = { success: true, result: [{ id: 1 }], row_count: 1, sql: "SELECT * FROM data" };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await runNaturalLanguageQuery("Show me all records");

      expect(mockPost).toHaveBeenCalledWith("/analysis/nl-query", { query: "Show me all records" });
      expect(result.sql).toBe("SELECT * FROM data");
    });
  });
});
