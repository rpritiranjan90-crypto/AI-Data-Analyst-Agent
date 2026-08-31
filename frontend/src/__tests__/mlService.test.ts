/**
 * Unit tests for mlService — model training, status, available models.
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
  trainModel,
  getAvailableModels,
  getMLStatus,
  getMLTrainingSummary,
} from "../services/mlService";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("mlService", () => {
  describe("trainModel", () => {
    it("POSTs the training payload to /ml/train", async () => {
      const payload = { target: "churned", algorithm: "random_forest", test_size: 0.2 };
      const mockResult = { accuracy: 0.92, model_id: "rf_1" };
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockResult });

      const result = await trainModel(payload);
      expect(mockPost).toHaveBeenCalledWith("/ml/train", payload);
      expect(result.accuracy).toBe(0.92);
    });

    it("supports optional test_size and random_state defaults", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });
      await trainModel({ target: "y", algorithm: "logistic_regression" });
      expect(mockPost).toHaveBeenCalledWith("/ml/train", {
        target: "y",
        algorithm: "logistic_regression",
      });
    });
  });

  describe("getAvailableModels", () => {
    it("GETs /ml/models", async () => {
      const mockData = { models: ["random_forest", "logistic_regression"] };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getAvailableModels();
      expect(mockGet).toHaveBeenCalledWith("/ml/models");
      expect(result.models).toContain("random_forest");
    });
  });

  describe("getMLStatus", () => {
    it("GETs /ml/status", async () => {
      const mockData = { status: "ready", queue_depth: 0 };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getMLStatus();
      expect(mockGet).toHaveBeenCalledWith("/ml/status");
      expect(result.status).toBe("ready");
    });
  });

  describe("getMLTrainingSummary", () => {
    it("GETs /ml/training-summary", async () => {
      const mockData = { total_runs: 10, last_run_at: "2026-08-29" };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockData });

      const result = await getMLTrainingSummary();
      expect(mockGet).toHaveBeenCalledWith("/ml/training-summary");
      expect(result.total_runs).toBe(10);
    });
  });
});