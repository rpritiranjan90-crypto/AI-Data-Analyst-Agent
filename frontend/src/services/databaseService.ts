import api from "../api/axios";
import type { DatasetResponse } from "../types/dataset";

export interface ConnectRequest {
  connection_string: string;
}

export interface QueryRequest {
  connection_string: string;
  query: string;
  dataset_name?: string;
  /** Allowlist of valid table names for this connection. If supplied the backend
   *  rejects the query if it references a table not in this list. */
  table_names?: string[];
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

export async function generateNlToSql(
  prompt: string,
  tableName: string = "dataset",
  columns: string[] = []
): Promise<{ success: boolean; prompt: string; generated_sql: string }> {
  const response = await api.post("/database/nl-to-sql", {
    prompt,
    table_name: tableName,
    columns,
  });
  return response.data;
}
