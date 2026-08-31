/**
 * Unit tests for visualizationService — chart types, generation, auto-visualize, image URLs.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from "../api/axios";
import {
  getSupportedChartTypes,
  generateChart,
  autoVisualize,
  getChartImageUrl,
} from "../services/visualizationService";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("visualizationService", () => {
  describe("getSupportedChartTypes", () => {
    it("GETs /visualization/supported", async () => {
      const mockData = { supported_charts: ["bar", "line", "scatter"] };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getSupportedChartTypes();
      expect(mockGet).toHaveBeenCalledWith("/visualization/supported");
      expect(result.supported_charts).toContain("bar");
    });
  });

  describe("generateChart", () => {
    it("POSTs chart payload to /visualization/generate", async () => {
      const payload = { chart_type: "bar", x_column: "category" };
      const mockResult = { chart_path: "/charts/bar.png" };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockResult });

      const result = await generateChart(payload);
      expect(mockPost).toHaveBeenCalledWith("/visualization/generate", payload);
      expect(result.chart_path).toBe("/charts/bar.png");
    });
  });

  describe("autoVisualize", () => {
    it("POSTs to /visualization/auto-visualize", async () => {
      const mockResult = { charts: ["/charts/a.png", "/charts/b.png"] };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockResult });

      const result = await autoVisualize();
      expect(mockPost).toHaveBeenCalledWith("/visualization/auto-visualize");
      expect(result.charts).toHaveLength(2);
    });
  });

  describe("getChartImageUrl", () => {
    it("returns empty string for empty input", () => {
      expect(getChartImageUrl("")).toBe("");
    });

    it("passes through full URLs unchanged", () => {
      const url = "https://example.com/chart.png";
      expect(getChartImageUrl(url)).toBe(url);
    });

    it("prefixes relative paths with a leading slash", () => {
      const url = getChartImageUrl("charts/foo.png");
      expect(url).toMatch(/charts\/foo\.png$/);
      // Should not have a double slash before the path
      expect(url).not.toMatch(/[^:]\/\/[^/]/);
    });

    it("handles paths that already start with /", () => {
      const url = getChartImageUrl("/charts/foo.png");
      expect(url).toMatch(/\/charts\/foo\.png$/);
    });
  });
});