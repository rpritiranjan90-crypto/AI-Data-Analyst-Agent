import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DatasetResponse, DatasetMetadata } from "../types/dataset";

interface DatasetState {
  dataset: DatasetResponse | null;
  activeFilename: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDataset: (dataset: DatasetResponse) => void;
  setActiveFilename: (filename: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearDataset: () => void;
  updateMetadata: (metadata: Partial<DatasetMetadata>) => void;
}

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set) => ({
      dataset: null,
      activeFilename: null,
      isLoading: false,
      error: null,

      setDataset: (dataset) =>
        set({
          dataset,
          activeFilename: dataset.metadata?.filename || null,
          error: null,
        }),

      setActiveFilename: (filename) =>
        set({
          activeFilename: filename,
        }),

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      setError: (error) =>
        set({
          error,
        }),

      clearDataset: () =>
        set({
          dataset: null,
          activeFilename: null,
          error: null,
        }),

      updateMetadata: (metadataUpdate) =>
        set((state) => {
          if (!state.dataset) return state;
          return {
            dataset: {
              ...state.dataset,
              metadata: {
                ...state.dataset.metadata,
                ...metadataUpdate,
              },
            },
          };
        }),
    }),
    {
      name: "ai-data-analyst-dataset",
      storage: createJSONStorage(() => localStorage),
    }
  )
);