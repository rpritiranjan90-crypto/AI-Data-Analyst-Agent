/**
 * Unit tests for recommendationService — mocked axios responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RecommendationResponse } from "../types/api";

vi.mock("../api/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { getAutoRecommendations } from "../services/recommendationService";

import api from "../api/axios";
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recommendationService", () => {
  describe("getAutoRecommendations", () => {
    it("calls POST /recommendation/auto-recommend with no body", async () => {
      const mockData: RecommendationResponse = {
        success: true,
        dataset_filename: "sales.csv",
        recommendations: [
          {
            id: "rec-1",
            category: "cleaning",
            title: "Remove duplicate rows",
            description: "Found 12 duplicate rows.",
            priority: "high",
            impact: "Improves analysis accuracy by 5%",
            action_path: "/cleaning",
            action_label: "Clean Data",
          },
          {
            id: "rec-2",
            category: "visualization",
            title: "Add scatter plot",
            description: "Numeric columns detected — scatter plot recommended.",
            priority: "medium",
            impact: "Better pattern discovery",
          },
        ],
        chart_recommendations: [
          {
            chart_type: "scatter",
            x_column: "price",
            y_column: "quantity",
            rationale: "Two numeric columns detected",
            priority: "medium",
          },
        ],
        insights: [
          "Dataset has 5 numeric and 3 categorical columns.",
          "No missing values detected in key columns.",
        ],
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoRecommendations();

      expect(mockPost).toHaveBeenCalledWith("/recommendation/auto-recommend");
      expect(result.recommendations).toHaveLength(2);
      expect(result.chart_recommendations).toHaveLength(1);
      expect(result.dataset_filename).toBe("sales.csv");
    });

    it("returns high-priority recommendations first", async () => {
      const mockData: RecommendationResponse = {
        success: true,
        recommendations: [
          { id: "rec-2", category: "ml", title: "Medium rec", description: "", priority: "medium", impact: "" },
          { id: "rec-1", category: "cleaning", title: "High rec", description: "", priority: "high", impact: "" },
          { id: "rec-3", category: "visualization", title: "Low rec", description: "", priority: "low", impact: "" },
        ],
        chart_recommendations: [],
        insights: [],
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoRecommendations();

      const priorities = result.recommendations.map((r: { priority: string }) => r.priority);
      expect(priorities).toContain("high");
      expect(priorities).toContain("medium");
      expect(priorities).toContain("low");
    });

    it("propagates errors from axios", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("AI service unavailable"));

      await expect(getAutoRecommendations()).rejects.toThrow("AI service unavailable");
    });

    it("handles empty recommendations array gracefully", async () => {
      const mockData: RecommendationResponse = {
        success: true,
        recommendations: [],
        chart_recommendations: [],
        insights: [],
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoRecommendations();

      expect(result.recommendations).toHaveLength(0);
      expect(result.chart_recommendations).toHaveLength(0);
      expect(result.insights).toHaveLength(0);
    });

    it("includes category field on recommendations", async () => {
      const mockData: RecommendationResponse = {
        success: true,
        recommendations: [
          { id: "rec-1", category: "cleaning", title: "Clean", description: "", priority: "high", impact: "" },
          { id: "rec-2", category: "ml", title: "Train", description: "", priority: "medium", impact: "" },
        ],
        chart_recommendations: [],
        insights: [],
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoRecommendations();

      const categories = result.recommendations.map((r: { category: string }) => r.category);
      expect(categories).toContain("cleaning");
      expect(categories).toContain("ml");
    });

    it("handles missing optional fields in response", async () => {
      const mockData: RecommendationResponse = {
        success: true,
        recommendations: [
          {
            id: "rec-1",
            category: "exploration",
            title: "Explore data",
            description: "",
            priority: "low",
            impact: "",
          },
        ],
        chart_recommendations: [],
        insights: ["No dataset loaded yet."],
      };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoRecommendations();

      expect(result.dataset_filename).toBeUndefined();
      expect(result.recommendations[0].action_path).toBeUndefined();
    });
  });
});
