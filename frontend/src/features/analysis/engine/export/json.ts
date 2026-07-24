import type { AIReport } from "../report/types";
import type { ExportFormat } from "./types";

export const jsonExporter: ExportFormat = {
  name: "JSON",

  extension: "json",

  mimeType: "application/json",

  generate(report: AIReport) {
    return JSON.stringify(report, null, 2);
  },
};