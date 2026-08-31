/**
 * Unit tests for reportService — AI insights, report generation, chat prompt, download URLs.
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
  getAIInsights,
  getAutoInsights,
  generateReport,
  listReports,
  getReportDownloadUrl,
  promptAI,
} from "../services/reportService";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("reportService", () => {
  describe("getAIInsights", () => {
    it("GETs /ai-insights", async () => {
      const mockData = { summary: "Insights..." };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAIInsights();
      expect(mockGet).toHaveBeenCalledWith("/ai-insights");
      expect(result).toEqual(mockData);
    });
  });

  describe("getAutoInsights", () => {
    it("POSTs to /ai-insights/auto-insights", async () => {
      const mockData = { insights: [] };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAutoInsights();
      expect(mockPost).toHaveBeenCalledWith("/ai-insights/auto-insights");
      expect(result).toEqual(mockData);
    });
  });

  describe("generateReport", () => {
    it("GETs /generate-report", async () => {
      const mockData = { message: "PDF generated", file: "report.pdf" };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await generateReport();
      expect(mockGet).toHaveBeenCalledWith("/generate-report");
      expect(result.message).toBe("PDF generated");
    });
  });

  describe("listReports", () => {
    it("GETs /reports and returns array", async () => {
      const mockData = ["report1.pdf", "report2.pdf"];
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await listReports();
      expect(mockGet).toHaveBeenCalledWith("/reports");
      expect(result).toHaveLength(2);
    });
  });

  describe("getReportDownloadUrl", () => {
    it("builds a URL from VITE_API_URL + /download-report/<filename>", () => {
      const url = getReportDownloadUrl("report_2026.pdf");
      expect(url).toMatch(/\/download-report\/report_2026\.pdf$/);
    });

    it("includes the filename verbatim (encoding is the caller's responsibility)", () => {
      // The current implementation does not URL-encode the filename.
      // Callers should pre-encode if needed; we verify it includes the raw name.
      const url = getReportDownloadUrl("report with spaces.pdf");
      expect(url).toContain("report with spaces.pdf");
    });
  });

  describe("promptAI", () => {
    it("POSTs the prompt to /ai/generate", async () => {
      const mockData = { response: "Hello back" };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await promptAI("Hello");
      expect(mockPost).toHaveBeenCalledWith("/ai/generate", { prompt: "Hello" });
      expect(result.response).toBe("Hello back");
    });
  });
});