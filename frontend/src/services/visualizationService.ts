import api from "../api/axios";

export async function getSupportedChartTypes() {
  const response = await api.get("/visualization/supported");
  return response.data;
}

export async function generateChart(payload: Record<string, any>) {
  const response = await api.post("/visualization/generate", payload);
  return response.data;
}

export async function autoVisualize() {
  const response = await api.post("/visualization/auto-visualize");
  return response.data;
}

export function getChartImageUrl(chartPath: string): string {
  const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  if (!chartPath) return "";
  if (chartPath.startsWith("http")) return chartPath;
  const cleanPath = chartPath.startsWith("/") ? chartPath : `/${chartPath}`;
  return `${baseURL}${cleanPath}`;
}
