import { describe, it, expect, beforeEach } from "vitest";
import { useDatasetStore } from "../store/datasetStore";
import type { DatasetResponse } from "../types/dataset";

const mockDataset: DatasetResponse = {
  success: true,
  message: "Uploaded",
  metadata: {
    filename: "test.csv",
    extension: ".csv",
    rows: 100,
    columns: 5,
    column_names: ["a", "b", "c", "d", "e"],
    memory_usage_mb: 0.5,
    missing_values: 0,
    duplicate_rows: 0,
    upload_time: "2026-08-28T10:00:00Z",
  },
};

describe("useDatasetStore", () => {
  beforeEach(() => {
    // Reset store between tests
    useDatasetStore.getState().clearDataset();
    localStorage.clear();
  });

  it("initializes with empty state", () => {
    const state = useDatasetStore.getState();
    expect(state.dataset).toBeNull();
    expect(state.activeFilename).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("setDataset stores dataset and sets activeFilename", () => {
    useDatasetStore.getState().setDataset(mockDataset);
    const state = useDatasetStore.getState();
    expect(state.dataset).toEqual(mockDataset);
    expect(state.activeFilename).toBe("test.csv");
    expect(state.error).toBeNull();
  });

  it("setActiveFilename updates only the filename", () => {
    useDatasetStore.getState().setDataset(mockDataset);
    useDatasetStore.getState().setActiveFilename("other.csv");
    expect(useDatasetStore.getState().activeFilename).toBe("other.csv");
    expect(useDatasetStore.getState().dataset).toEqual(mockDataset);
  });

  it("setLoading updates the loading flag", () => {
    useDatasetStore.getState().setLoading(true);
    expect(useDatasetStore.getState().isLoading).toBe(true);
    useDatasetStore.getState().setLoading(false);
    expect(useDatasetStore.getState().isLoading).toBe(false);
  });

  it("setError stores an error message", () => {
    useDatasetStore.getState().setError("Upload failed");
    expect(useDatasetStore.getState().error).toBe("Upload failed");
    useDatasetStore.getState().setError(null);
    expect(useDatasetStore.getState().error).toBeNull();
  });

  it("clearDataset resets to initial state", () => {
    useDatasetStore.getState().setDataset(mockDataset);
    useDatasetStore.getState().setError("oops");
    useDatasetStore.getState().clearDataset();
    const state = useDatasetStore.getState();
    expect(state.dataset).toBeNull();
    expect(state.activeFilename).toBeNull();
    expect(state.error).toBeNull();
  });

  it("updateMetadata merges new metadata into existing dataset", () => {
    useDatasetStore.getState().setDataset(mockDataset);
    useDatasetStore.getState().updateMetadata({ rows: 200, missing_values: 5 });
    const updated = useDatasetStore.getState().dataset;
    expect(updated?.metadata.rows).toBe(200);
    expect(updated?.metadata.missing_values).toBe(5);
    // Untouched fields remain
    expect(updated?.metadata.columns).toBe(5);
    expect(updated?.metadata.filename).toBe("test.csv");
  });

  it("updateMetadata is a no-op when no dataset is set", () => {
    const beforeState = useDatasetStore.getState();
    useDatasetStore.getState().updateMetadata({ rows: 999 });
    const afterState = useDatasetStore.getState();
    expect(afterState.dataset).toBe(beforeState.dataset);
  });

  it("persists dataset to localStorage", () => {
    useDatasetStore.getState().setDataset(mockDataset);
    const stored = localStorage.getItem("ai-data-analyst-dataset");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.dataset.metadata.filename).toBe("test.csv");
  });
});
