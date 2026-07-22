import { create } from "zustand";

export interface DatasetMetadata {
  filename: string;
  extension: string;
  rows: number;
  columns: number;
  column_names: string[];
  memory_usage_mb: number;
  missing_values: number;
  duplicate_rows: number;
  upload_time: string;
}

export interface DatasetResponse {
  success: boolean;
  message: string;
  metadata: DatasetMetadata;
  profile: Record<string, unknown>;
  statistics: Record<string, unknown>;
}

interface DatasetStore {
  dataset: DatasetResponse | null;
  setDataset: (dataset: DatasetResponse) => void;
  clearDataset: () => void;
}

export const useDatasetStore = create<DatasetStore>((set) => ({
  dataset: null,

  setDataset: (dataset) =>
    set({
      dataset,
    }),

  clearDataset: () =>
    set({
      dataset: null,
    }),
}));