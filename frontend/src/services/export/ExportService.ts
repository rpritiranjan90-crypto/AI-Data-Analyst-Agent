import type { ExportFormat } from "../../types/export";

import { exportCSV } from "./exporters/csv";
import { exportExcel } from "./exporters/excel";
import { exportPDF } from "../../utils/pdf/exportPDF";

export interface ExportRequest {
  format: ExportFormat;
  fileName: string;
  data?: unknown;
  element?: HTMLElement | null;
}

class ExportService {
  static async export(
    request: ExportRequest,
  ): Promise<void> {
    switch (request.format) {
      case "csv":
        return this.exportCSV(request);

      case "excel":
        return this.exportExcel(request);

      case "pdf":
        return this.exportPDF(request);

      case "png":
        return this.exportPNG(request);

      case "markdown":
        return this.exportMarkdown(request);

      default:
        throw new Error(
          `Unsupported export format: ${request.format}`,
        );
    }
  }

  private static async exportCSV(
    request: ExportRequest,
  ): Promise<void> {
    await exportCSV({
      fileName: request.fileName,
      data: (request.data ?? []) as Record<
        string,
        unknown
      >[],
    });
  }

  private static async exportExcel(
    request: ExportRequest,
  ): Promise<void> {
    await exportExcel({
      fileName: request.fileName,
      sheets: (request.data ?? []) as {
        name: string;
        data: Record<string, unknown>[];
      }[],
    });
  }

  private static async exportPDF(
    request: ExportRequest,
  ): Promise<void> {
    await exportPDF({
      elementId: "analysis-report",
      filename: `${request.fileName}.pdf`,
    });
  }

  private static async exportPNG(
    _request: ExportRequest,
  ): Promise<void> {
    console.info("PNG export is not implemented yet.");
  }

  private static async exportMarkdown(
    _request: ExportRequest,
  ): Promise<void> {
    console.info("Markdown export is not implemented yet.");
  }
}

export default ExportService;