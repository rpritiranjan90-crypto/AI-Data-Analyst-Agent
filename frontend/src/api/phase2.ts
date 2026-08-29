import api from "./axios";

// ─── Usage metering ───────────────────────────────────────────────────────────
export interface UsageInfo {
  workspace_id: string;
  rows_uploaded: number;
  ai_calls: number;
  reports_generated: number;
  ml_models_trained: number;
  limits: {
    rows_uploaded: number | null;
    ai_calls: number | null;
    reports_generated: number | null;
    ml_models_trained: number | null;
  };
  rows_uploaded_pct: number | null;
  ai_calls_pct: number | null;
  reports_generated_pct: number | null;
  ml_models_trained_pct: number | null;
  period_start: string;
}

export async function getUsage(): Promise<UsageInfo> {
  const res = await api.get<{ success: boolean } & UsageInfo>("/usage");
  const { success: _success, ...rest } = res.data;
  return rest as UsageInfo;
}

// ─── GDPR ─────────────────────────────────────────────────────────────────────
export interface ExportRequest {
  id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export async function requestDataExport(): Promise<{ export_id: string; status: string; expires_at: string; download_url: string }> {
  const res = await api.post<{ success: boolean; export_id: string; status: string; expires_at: string; download_url: string }>("/gdpr/export");
  return res.data;
}

export async function listExports(): Promise<ExportRequest[]> {
  const res = await api.get<{ success: boolean; exports: ExportRequest[] }>("/gdpr/exports");
  return res.data.exports;
}

export async function downloadExport(exportId: string): Promise<unknown> {
  const res = await api.get(`/gdpr/exports/${exportId}/download`);
  return res.data;
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const res = await api.delete<{ success: boolean; message: string }>("/gdpr/account");
  return res.data;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  plan_required?: string;
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  total: number;
  completed: number;
  progress_pct: number;
}

export async function getOnboarding(): Promise<OnboardingProgress> {
  const res = await api.get<{ success: boolean } & OnboardingProgress>("/onboarding");
  const { success: _success, ...rest } = res.data;
  return rest as OnboardingProgress;
}

export async function markOnboardingStep(stepId: string): Promise<void> {
  await api.post(`/onboarding/${stepId}`);
}

// ─── System Status (public) ──────────────────────────────────────────────────
export interface SystemStatus {
  status: "operational" | "degraded" | "outage";
  version: string;
  environment: string;
  timestamp: string;
  uptime_seconds: number;
  components: Record<string, { status: string; latency_ms?: number; message?: string }>;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  // Direct fetch (no auth) — bypass the axios auth interceptor by using raw fetch
  const baseURL = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${baseURL}/status`);
  return res.json();
}
