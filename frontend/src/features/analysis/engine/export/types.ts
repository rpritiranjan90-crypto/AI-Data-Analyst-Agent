import type { AIReport } from "../report/types";

export interface ExportFormat {
  name: string;
  extension: string;
  mimeType: string;

  generate(report: AIReport): string;
}