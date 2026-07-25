import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";
import { exportPDF } from "../../../../utils/pdf/exportPDF";

export default function ReportGenerator() {
  const analysis = useAnalysisData();

  const [exporting, setExporting] =
    useState(false);

  const {
    descriptive,
    correlation,
    distribution,
    insights,
  } = analysis;

  const summary = useMemo(() => {
    const numericColumns =
      Object.keys(descriptive).length;

    const normalColumns =
      Object.values(distribution).filter(
        (item) => item.normal_distribution,
      ).length;

    const outlierColumns =
      Object.values(distribution).filter(
        (item) => item.outliers.count > 0,
      ).length;

    return {
      numericColumns,
      normalColumns,
      outlierColumns,
      strongCorrelations:
        correlation.strong_correlations.length,
    };
  }, [
    descriptive,
    distribution,
    correlation,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      await exportPDF({
        elementId: "analysis-report",
        filename: "AI-Analysis-Report.pdf",
      });
    } catch (error) {
      console.error(
        "PDF export failed:",
        error,
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      id="analysis-report"
      className="space-y-8"
    >
      <SectionHeader
        icon={
          <FileText className="h-6 w-6 text-indigo-600" />
        }
        title="AI Analysis Report"
        subtitle="Professional AI generated report"
      />

      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              AI Data Analyst Report
            </h2>

            <p className="mt-2 text-slate-500">
              Generated automatically from
              descriptive statistics,
              correlation analysis,
              distribution analysis and AI
              insights.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 hover:bg-slate-100"
            >
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Download size={18} />

              {exporting
                ? "Generating..."
                : "Export PDF"}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center gap-2">
          <Sparkles
            size={22}
            className="text-violet-600"
          />

          <h2 className="text-xl font-bold">
            Executive Summary
          </h2>
        </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Numeric Features
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {summary.numericColumns}
            </h3>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm text-blue-700">
              Strong Correlations
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-700">
              {summary.strongCorrelations}
            </h3>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Normal Features
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-700">
              {summary.normalColumns}
            </h3>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-700">
              Outlier Features
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-700">
              {summary.outlierColumns}
            </h3>
          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">

          <h3 className="mb-5 text-xl font-bold text-slate-900">
            AI Executive Summary
          </h3>

          <div className="space-y-4 leading-8 text-slate-700">

            <p>
              This report summarizes the uploaded dataset
              using descriptive statistics, correlation
              analysis, distribution profiling and
              AI-generated insights.
            </p>

            <p>
              A total of{" "}
              <strong>{summary.numericColumns}</strong>{" "}
              numeric feature
              {summary.numericColumns === 1 ? "" : "s"}
              {" "}were analyzed.
            </p>

            <p>
              The analysis identified{" "}
              <strong>
                {summary.strongCorrelations}
              </strong>{" "}
              strong correlation
              {summary.strongCorrelations === 1 ? "" : "s"}
              {" "}and{" "}
              <strong>
                {summary.outlierColumns}
              </strong>{" "}
              feature
              {summary.outlierColumns === 1 ? "" : "s"}
              {" "}containing statistical outliers.
            </p>

            <p>
              Approximately{" "}
              <strong>
                {summary.normalColumns}
              </strong>{" "}
              feature
              {summary.normalColumns === 1 ? "" : "s"}
              {" "}follow a normal statistical
              distribution.
            </p>

          </div>

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Correlation Summary
            </h3>

            <div className="space-y-3">

              {correlation.strong_correlations.length > 0 ? (
                correlation.strong_correlations
                  .slice(0, 5)
                  .map((item, index) => (

                    <div
                      key={index}
                      className="rounded-xl bg-slate-50 p-4"
                    >

                      <div className="flex justify-between">

                        <span className="font-medium">
                          {item.column_1}
                        </span>

                        <span className="font-medium">
                          {item.column_2}
                        </span>

                        <strong
                          className={
                            item.correlation >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {item.correlation.toFixed(2)}
                        </strong>

                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.interpretation}
                      </p>

                    </div>

                  ))
              ) : (

                <p className="text-slate-500">
                  No strong correlations detected.
                </p>

              )}

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Distribution Summary
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Normal Features</span>
                <strong>{summary.normalColumns}</strong>
              </div>

              <div className="flex justify-between">
                <span>Outlier Features</span>
                <strong>{summary.outlierColumns}</strong>
              </div>

              <div className="flex justify-between">
                <span>Strong Correlations</span>
                <strong>{summary.strongCorrelations}</strong>
              </div>

              <div className="flex justify-between">
                <span>Numeric Features</span>
                <strong>{summary.numericColumns}</strong>
              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

          <h3 className="mb-5 text-xl font-bold">
            AI Key Findings
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            {insights.length > 0 ? (
              insights.map((insight, index) => (

                <div
                  key={index}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <p className="leading-7 text-slate-700">
                    {insight}
                  </p>
                </div>

              ))
            ) : (

              <div className="col-span-full rounded-xl bg-white p-5 text-center text-slate-500">
                No AI insights are available.
              </div>

            )}

          </div>

        </div>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              AI Recommendations
            </h3>

            <div className="space-y-4">

              <div className="rounded-xl bg-white p-4">

                <h4 className="font-semibold text-slate-900">
                  Feature Engineering
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Review highly correlated variables before
                  model development. Remove redundant
                  features or apply dimensionality
                  reduction where appropriate.
                </p>

              </div>

              <div className="rounded-xl bg-white p-4">

                <h4 className="font-semibold text-slate-900">
                  Data Quality
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Investigate detected outliers and verify
                  whether they represent genuine
                  observations or data quality issues
                  before training predictive models.
                </p>

              </div>

              <div className="rounded-xl bg-white p-4">

                <h4 className="font-semibold text-slate-900">
                  Distribution
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Consider scaling or transformation
                  techniques for non-normal variables
                  when using algorithms that assume
                  normally distributed inputs.
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              ML Readiness
            </h3>

            <div className="space-y-5">

              <div className="flex items-center justify-between rounded-xl bg-white p-4">
                <span>Dataset Status</span>

                <strong className="text-green-600">
                  Ready for Analysis
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-4">
                <span>Recommended Models</span>

                <strong>
                  Random Forest
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-4">
                <span>Advanced Models</span>

                <strong>
                  XGBoost / LightGBM
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-4">
                <span>Feature Scaling</span>

                <strong>
                  Recommended
                </strong>
              </div>

              <div className="rounded-xl border border-blue-200 bg-white p-5">

                <p className="text-sm leading-7 text-slate-700">
                  Based on the statistical analysis,
                  the dataset is suitable for predictive
                  analytics after completing standard
                  preprocessing such as feature scaling,
                  outlier review and
                  correlation-based feature selection.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-8">

          <h3 className="text-2xl font-bold text-slate-900">
            Final Report Conclusion
          </h3>

          <p className="mt-5 leading-8 text-slate-700">
            This report was generated automatically
            by the AI Data Analyst application using
            descriptive statistics, correlation analysis,
            distribution profiling and AI-generated
            insights. The results provide a comprehensive
            overview of dataset quality, feature
            relationships and statistical
            characteristics to support exploratory
            analysis and machine learning workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

            <span>
              Generated by{" "}
              <strong>
                AI Data Analyst Agent
              </strong>
            </span>

            <span>
              Generated on{" "}
              {new Date().toLocaleString()}
            </span>

          </div>

        </div>

      </Card>

    </div>

  );

}