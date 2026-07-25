import api from "../api/axios";

export async function getAIInsights() {
  const response = await api.get("/ai-insights");
  return response.data;
}

export async function getAutoInsights() {
  const response = await api.post("/ai-insights/auto-insights");
  return response.data;
}

export async function generateReport() {
  const response = await api.get("/generate-report");
  return response.data;
}

export async function listReports() {
  const response = await api.get("/reports");
  return response.data;
}

export function getReportDownloadUrl(filename: string): string {
  const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  return `${baseURL}/download-report/${filename}`;
}

export async function promptAI(prompt: string) {
  const response = await api.post("/ai/generate", { prompt });
  return response.data;
}
