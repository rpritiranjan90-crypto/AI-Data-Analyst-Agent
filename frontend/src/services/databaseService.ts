import api from "../api/axios";
import type { DatasetResponse } from "../types/dataset";

export interface ConnectRequest {
  connection_string: string;
}

export interface QueryRequest {
  connection_string: string;
  query: string;
  dataset_name?: string;
}

export async function testDbConnection(connectionString: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post("/database/test-connection", { connection_string: connectionString });
  return response.data;
}

export async function listDbTables(connectionString: string): Promise<{ success: boolean; tables: string[] }> {
  const response = await api.post("/database/tables", { connection_string: connectionString });
  return response.data;
}

export async function queryDatabase(req: QueryRequest): Promise<DatasetResponse> {
  const response = await api.post<DatasetResponse>("/database/query", req);
  return response.data;
}
