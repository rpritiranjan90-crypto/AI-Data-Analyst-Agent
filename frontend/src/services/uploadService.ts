import api from "../api/axios";
import type { DatasetResponse } from "../types/dataset";

export interface DatasetListItem {
  filename: string;
  size_bytes: number;
  uploaded_at: string;
  rows: number | null;
  columns: number | null;
}

export interface DatasetListResponse {
  success: boolean;
  total: number;
  items: DatasetListItem[];
}

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

export async function listDatasets(): Promise<DatasetListResponse> {
  const response = await api.get<DatasetListResponse>("/api/datasets/list");
  return response.data;
}

export interface JoinDatasetsRequest {
  left_filename: string;
  right_filename: string;
  left_on: string;
  right_on: string;
  how?: "inner" | "left" | "right" | "outer";
  output_filename?: string;
}

export async function joinDatasets(req: {
  left_filename: string;
  right_filename: string;
  left_on: string;
  right_on: string;
  how?: string;
  output_filename?: string;
}): Promise<DatasetResponse> {
  const response = await api.post<DatasetResponse>("/datasets/join", req);
  return response.data;
}