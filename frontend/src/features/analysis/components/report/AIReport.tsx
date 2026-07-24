import { useState } from "react";

import type { ExportFormat } from "../../../../types/export";
import ExportService from "../../../../services/export/ExportService";
import { mapAIReportToCSV } from "../../../../services/export/reportMapper";

import AICopilot from "./AICopilot";
import AIInsights from "./AIInsights";
import AIKeyFindings from "./AIKeyFindings";
import DatasetHealthCards from "./DatasetHealthCards";
import ExecutiveDashboard from "./ExecutiveDashboard";
import FeatureEngineeringCards from "./FeatureEngineeringCards";
import GaugeGrid from "./GaugeGrid";
import ModelRecommendationCards from "./ModelRecommendationCards";
import ReportHeader from "./ReportHeader";
import ReportKPIs from "./ReportKPIs";

import { useAIReport } from "../../hooks/useAIReport";

export default function AIReport() {
  const report = useAIReport();

  const [showExportMenu, setShowExportMenu] =
    useState(false);

  const datasetScore = Number(report.metrics[0]?.value ?? 0);
  const mlReadiness = Number(report.metrics[1]?.value ?? 0);
  const confidence = Number(report.metrics[2]?.value ?? 0);
  const models = Number(report.metrics[3]?.value ?? 0);

  const handleExport = async (
    format: ExportFormat,
  ) => {
    try {
      switch (format) {
        case "csv": {
          const rows = mapAIReportToCSV({
            title: report.title,
            generatedAt: report.generatedAt,
            metrics: report.metrics.map((metric) => ({
              label: metric.label,
              value: metric.value,
            })),
            findings: report.findings,
            executiveSummary: report.executiveSummary,
            conclusion: report.conclusion,
          });

          await ExportService.export({
            format: "csv",
            fileName: "AI_Executive_Report",
            data: rows,
          });

          break;
        }

        case "excel":
        case "pdf":
        case "png":
        case "markdown":
          await ExportService.export({
            format,
            fileName: "AI_Executive_Report",
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setShowExportMenu(false);
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title={report.title}
        generatedAt={report.generatedAt}
        onExportClick={() =>
          setShowExportMenu((prev) => !prev)
        }
        showExportMenu={showExportMenu}
        onExportSelect={handleExport}
      />

      <ReportKPIs
        datasetScore={datasetScore}
        mlReadiness={mlReadiness}
        confidence={confidence}
        models={models}
      />

      <AICopilot copilot={report.copilot} />

      <AIInsights insights={report.insights} />

      <GaugeGrid
        datasetScore={datasetScore}
        mlReadiness={mlReadiness}
        confidence={confidence}
        datasetHealth={datasetScore}
      />

      <ExecutiveDashboard
        strengths={[
          "High dataset quality",
          "Strong ML readiness",
          "Minimal missing values",
        ]}
        risks={[
          "Potential feature imbalance",
          "Correlation between predictors",
        ]}
        recommendations={[
          "Normalize numerical features",
          "Perform feature selection",
          "Validate using cross-validation",
        ]}
      />

      <AIKeyFindings findings={report.findings} />

      <DatasetHealthCards
        datasetScore={datasetScore}
        mlReadiness={mlReadiness}
        confidence={confidence}
        models={models}
      />

      <FeatureEngineeringCards
        cards={report.featureCards}
      />

      <ModelRecommendationCards
        cards={report.modelCards}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">
          {report.executiveSummary.title}
        </h2>

        <p className="whitespace-pre-line leading-7 text-slate-700">
          {report.executiveSummary.content}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">
          {report.conclusion.title}
        </h2>

        <p className="whitespace-pre-line leading-7 text-slate-700">
          {report.conclusion.content}
        </p>
      </section>
    </div>
  );
}