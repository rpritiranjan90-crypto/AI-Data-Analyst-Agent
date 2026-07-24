import Card from "../../../../components/ui/Card";

import { useAIReport } from "../../hooks/useAIReport";

import ReportHeader from "./ReportHeader";
import ReportKPIs from "./ReportKPIs";

export default function AIReport() {
  const report = useAIReport();

  const sections = [
    report.executiveSummary,
    report.datasetHealth,
    report.featureEngineering,
    report.modelRecommendations,
    report.conclusion,
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title={report.title}
        generatedAt={report.generatedAt}
      />

      <Card>
        <ReportKPIs
          datasetScore={Number(
            String(report.metrics[0].value).split("/")[0]
          )}
          mlReadiness={Number(
            String(report.metrics[1].value).split("/")[0]
          )}
          confidence={Number(
            String(report.metrics[2].value).split("/")[0]
          )}
          models={Number(report.metrics[3].value)}
        />

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                {section.title}
              </h2>

              <div className="rounded-xl bg-slate-50 p-5">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                  {section.content}
                </pre>
              </div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}