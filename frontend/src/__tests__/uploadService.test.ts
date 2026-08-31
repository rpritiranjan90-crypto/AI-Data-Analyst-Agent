/**
 * Unit tests for uploadService — mocked axios responses.
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
  uploadDataset,
  getLatestDataset,
  listDatasets,
  joinDatasets,
} from "../services/uploadService";

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const mockDataset = {
  success: true,
  message: "Uploaded",
  metadata: {
    filename: "data.csv",
    extension: ".csv",
    rows: 100,
    columns: 3,
    column_names: ["a", "b", "c"],
    memory_usage_mb: 0.5,
    missing_values: 0,
    duplicate_rows: 0,
  },
};

describe("uploadService", () => {
  describe("uploadDataset", () => {
    it("POSTs the file to /upload as multipart/form-data", async () => {
      const file = new File(["col1,col2\n1,2\n"], "data.csv", { type: "text/csv" });
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockDataset });

      const result = await uploadDataset(file);

      expect(mockPost).toHaveBeenCalledWith(
        "/upload",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(result).toEqual(mockDataset);
    });

    it("invokes onProgress callback with percentage", async () => {
      const file = new File(["col1\n1\n"], "small.csv", { type: "text/csv" });
      const onProgress = vi.fn();

      (mockPost as ReturnType<typeof vi.fn>).mockImplementationOnce((_url, _body, config) => {
        // Simulate axios firing onUploadProgress
        config.onUploadProgress?.({ loaded: 50, total: 100 } as any);
        return Promise.resolve({ data: mockDataset });
      });

      await uploadDataset(file, onProgress);

      expect(onProgress).toHaveBeenCalledWith(50);
    });

    it("handles missing event.total gracefully", async () => {
      const file = new File(["x"], "x.csv", { type: "text/csv" });
      const onProgress = vi.fn();

      (mockPost as ReturnType<typeof vi.fn>).mockImplementationOnce((_url, _body, config) => {
        config.onUploadProgress?.({ loaded: 50 } as any);
        return Promise.resolve({ data: mockDataset });
      });

      await uploadDataset(file, onProgress);
      expect(onProgress).not.toHaveBeenCalled();
    });

    it("propagates errors", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));
      const file = new File(["x"], "x.csv", { type: "text/csv" });
      await expect(uploadDataset(file)).rejects.toThrow("Network error");
    });
  });

  describe("getLatestDataset", () => {
    it("GETs /latest-dataset", async () => {
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockDataset });
      const result = await getLatestDataset();
      expect(mockGet).toHaveBeenCalledWith("/latest-dataset");
      expect(result).toEqual(mockDataset);
    });
  });

  describe("listDatasets", () => {
    it("GETs /api/datasets/list and returns the response", async () => {
      const mockList = { success: true, total: 2, items: [] };
      (mockGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockList });

      const result = await listDatasets();
      expect(mockGet).toHaveBeenCalledWith("/api/datasets/list");
      expect(result.total).toBe(2);
    });
  });

  describe("joinDatasets", () => {
    it("POSTs join config to /datasets/join", async () => {
      (mockPost as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockDataset });

      const req = {
        left_filename: "a.csv",
        right_filename: "b.csv",
        left_on: "id",
        right_on: "user_id",
        how: "inner" as const,
      };

      const result = await joinDatasets(req);

      expect(mockPost).toHaveBeenCalledWith("/datasets/join", req);
      expect(result).toEqual(mockDataset);
    });
  });
});