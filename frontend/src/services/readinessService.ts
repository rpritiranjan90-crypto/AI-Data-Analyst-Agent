import api from "../api/axios";

export interface ReadinessCheck {
  name: string;
  category: string;
  passed: boolean;
  score: number;
  details: string;
  checked_at: string;
}

export interface ReadinessResponse {
  total_score: number;
  max_score: number;
  grade: string;
  checks: ReadinessCheck[];
  environment: Record<string, string>;
  checked_at: string;
}

export async function getReadinessChecks(): Promise<ReadinessResponse> {
  const res = await api.get<ReadinessResponse>("/api/readiness/check");
  return res.data;
}
