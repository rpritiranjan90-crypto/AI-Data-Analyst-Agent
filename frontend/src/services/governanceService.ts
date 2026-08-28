import api from "../api/axios";

export interface TokenConsumption {
  last_hour: number;
  last_24h: number;
  total_all_time: number;
  estimated_cost_usd: number;
  model: string;
}

export interface RequestMetrics {
  requests_last_hour: number;
  requests_last_24h: number;
  total_requests: number;
  avg_latency_ms: number;
  error_count_last_24h: number;
  error_rate_pct: number;
  success_rate_pct: number;
}

export interface AIProviderStatus {
  provider: string;
  model: string;
  status: "available" | "unavailable";
  message: string;
}

export interface SafetyPolicies {
  prompt_injection_shield: boolean;
  sql_read_only_sandbox: boolean;
  dde_formula_sanitization: boolean;
  output_validation: boolean;
}

export interface GovernanceStats {
  token_consumption: TokenConsumption;
  request_metrics: RequestMetrics;
  ai_provider_status: AIProviderStatus;
  safety_policies: SafetyPolicies;
  uptime_seconds: number;
  platform: Record<string, string>;
}

export async function getGovernanceStats(): Promise<GovernanceStats> {
  const res = await api.get<GovernanceStats>("/api/governance/stats");
  return res.data;
}

export async function recordAIMetrics(tokens: number = 0, latencyMs: number = 0, success: boolean = true): Promise<void> {
  await api.post("/api/governance/record", { tokens, latency_ms: latencyMs, success });
}

export async function getAIHealth(): Promise<AIProviderStatus> {
  const res = await api.get<AIProviderStatus>("/api/governance/health");
  return res.data;
}
