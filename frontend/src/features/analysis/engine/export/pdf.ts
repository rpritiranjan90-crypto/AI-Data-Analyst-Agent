import type { AIReport } from "../report/types";
import type { ExportFormat } from "./types";
import { htmlExporter } from "./html";

export const pdfExporter: ExportFormat = {
  name: "PDF",

  extension: "pdf",

  mimeType: "text/html",

  generate(report: AIReport) {
    return htmlExporter.generate(report);
  },
};