import api from "../api/axios";
import type { DatasetResponse } from "../types/dataset";

export async function uploadDataset(
  file: File,
  onProgress?: (progress: number) => void
): Promise<DatasetResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<DatasetResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return;
      const progress = Math.round((event.loaded * 100) / event.total);
      onProgress(progress);
    },
  });

  return response.data;
}

export async function getLatestDataset(): Promise<DatasetResponse> {
  const response = await api.get<DatasetResponse>("/latest-dataset");
  return response.data;
}

export async function listDatasets(): Promise<{ success: boolean; datasets: string[] }> {
  const response = await api.get("/datasets");
  return response.data;
}