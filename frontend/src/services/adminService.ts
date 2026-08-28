import api from "../api/axios";

export interface AdminStats {
  total_requests: number;
  total_uploads: number;
  total_cleaning_ops: number;
  total_charts_generated: number;
  total_ml_runs: number;
  total_reports_generated: number;
  uptime_seconds: number;
  environment: string;
  version: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  status: string;
  details: string;
  timestamp: string;
  time_ago: string;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get<AdminStats>("/api/admin/stats");
  return res.data;
}

export async function getAuditLogs(page = 1, pageSize = 50): Promise<AuditLogResponse> {
  const res = await api.get<AuditLogResponse>("/api/admin/audit-logs", {
    params: { page, page_size: pageSize },
  });
  return res.data;
}
