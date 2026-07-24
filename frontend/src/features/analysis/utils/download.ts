import type { ExportFormat } from "../engine/export";
import type { AIReport } from "../engine/report/types";

export function downloadReport(
  report: AIReport,
  exporter: ExportFormat,
  filename: string
) {
  const content = exporter.generate(report);

  if (exporter.extension === "pdf") {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(content);
    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);

    return;
  }

  const blob = new Blob([content], {
    type: exporter.mimeType,
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.${exporter.extension}`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
