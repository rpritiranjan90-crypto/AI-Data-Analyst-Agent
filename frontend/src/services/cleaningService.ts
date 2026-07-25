import api from "../api/axios";

export async function getDatasetQuality() {
  const response = await api.get("/clean/quality");
  return response.data;
}

export async function fillMissingValues(column: string, method: string, value?: string) {
  const response = await api.post("/clean/missing-values", null, {
    params: { column, method, value },
  });
  return response.data;
}

export async function removeDuplicates() {
  const response = await api.post("/clean/duplicates");
  return response.data;
}

export async function removeIqROutliers(column: string) {
  const response = await api.post("/clean/outliers/iqr", null, {
    params: { column },
  });
  return response.data;
}

export async function removeZScoreOutliers(column: string, threshold = 3.0) {
  const response = await api.post("/clean/outliers/zscore", null, {
    params: { column, threshold },
  });
  return response.data;
}

export async function convertDatatype(column: string, datatype: string) {
  const response = await api.post("/clean/datatype", null, {
    params: { column, datatype },
  });
  return response.data;
}

export async function autoCleanDataset() {
  const response = await api.post("/clean/auto-clean");
  return response.data;
}

export async function getCleaningHistory() {
  const response = await api.get("/clean/history");
  return response.data;
}
