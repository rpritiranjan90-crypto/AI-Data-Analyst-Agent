import api from "../api/axios";

export async function getDatasetSummary(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/analysis/summary", { params });
  return response.data;
}

export async function getDescriptiveStatistics(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/analysis/descriptive", { params });
  return response.data;
}

export async function getMissingValuesAnalysis(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/analysis/missing-values", { params });
  return response.data;
}

export async function getColumnTypes(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/analysis/column-types", { params });
  return response.data;
}

export async function getCorrelationMatrix(filename?: string) {
  const params = filename ? { filename } : {};
  const response = await api.get("/analysis/correlation", { params });
  return response.data;
}

export async function runNaturalLanguageQuery(query: string) {
  const response = await api.post("/analysis/nl-query", { query });
  return response.data;
}
