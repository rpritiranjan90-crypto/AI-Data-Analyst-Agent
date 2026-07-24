import type { AIFinding } from "../../features/analysis/engine/findings/types";
import type { ExcelSheet } from "./exporters/excel";

export interface AIReportExportData {
  title: string;
  generatedAt: string;

  metrics: {
    label: string;
    value: string | number;
  }[];

  findings: AIFinding[];

  executiveSummary: {
    title: string;
    content: string;
  };

  conclusion: {
    title: string;
    content: string;
  };
}

export function mapAIReportToCSV(
  report: AIReportExportData,
): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];

  rows.push({
    Section: "Report",
    Title: "Title",
    Value: report.title,
  });

  rows.push({
    Section: "Report",
    Title: "Generated At",
    Value: new Date(report.generatedAt).toLocaleString(),
  });

  report.metrics.forEach((metric) => {
    rows.push({
      Section: "Metric",
      Title: metric.label,
      Value: metric.value,
    });
  });

  report.findings.forEach((finding) => {
    rows.push({
      Section: "Finding",
      Title: finding.title,
      Value: finding.description,
      Type: finding.type,
    });
  });

  rows.push({
    Section: "Executive Summary",
    Title: report.executiveSummary.title,
    Value: report.executiveSummary.content,
  });

  rows.push({
    Section: "Conclusion",
    Title: report.conclusion.title,
    Value: report.conclusion.content,
  });

  return rows;
}

export function mapAIReportToExcel(
  report: AIReportExportData,
): ExcelSheet[] {
  return [
    {
      name: "Executive Summary",
      data: [
        {
          Title: report.executiveSummary.title,
          Content: report.executiveSummary.content,
        },
      ],
    },
    {
      name: "Metrics",
      data: report.metrics.map((metric) => ({
        Metric: metric.label,
        Value: metric.value,
      })),
    },
    {
      name: "AI Findings",
      data: report.findings.map((finding) => ({
        Title: finding.title,
        Description: finding.description,
        Type: finding.type,
      })),
    },
    {
      name: "Conclusion",
      data: [
        {
          Title: report.conclusion.title,
          Content: report.conclusion.content,
        },
      ],
    },
  ];
}