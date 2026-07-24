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

  const datasetScore = Number(report.metrics[0]?.value ?? 0);
  const mlReadiness = Number(report.metrics[1]?.value ?? 0);
  const confidence = Number(report.metrics[2]?.value ?? 0);
  const models = Number(report.metrics[3]?.value ?? 0);

  console.log("===== AI REPORT METRICS =====");
  console.log(report.metrics);
  console.log("Dataset Score:", datasetScore);
  console.log("ML Readiness:", mlReadiness);
  console.log("Confidence:", confidence);
  console.log("Models:", models);
  console.log("=============================");

  return (
    <div className="space-y-6">
      <ReportHeader
        title={report.title}
        generatedAt={report.generatedAt}
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