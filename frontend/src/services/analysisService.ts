import api from "../api/axios";

export async function getDatasetSummary(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/summary", { params });
  return response.data;
}

export async function getDescriptiveStatistics(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/statistics", { params });
  return response.data;
}

export async function getMissingValuesAnalysis(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/missing-values", { params });
  return response.data;
}

export async function getColumnTypes(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/column-types", { params });
  return response.data;
}

export async function getCorrelationMatrix(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/correlation-matrix", { params });
  return response.data;
}
