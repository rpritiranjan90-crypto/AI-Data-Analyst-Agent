import { useMemo } from "react";
import {
  Brain,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import EmptyState from "../../../../components/ui/EmptyState";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

export default function InsightsTab() {
  const analysis = useAnalysisData();

  const {
    descriptive,
    correlation,
    distribution,
    insights,
  } = analysis;

  const numericColumns = Object.keys(
    descriptive,
  ).length;

  const strongCorrelations =
    correlation.strong_correlations.length;

  const normalColumns = Object.values(
    distribution,
  ).filter(
    (item) => item.normal_distribution,
  ).length;

  const outlierColumns = Object.values(
    distribution,
  ).filter(
    (item) => item.outliers.count > 0,
  ).length;

  const healthScore = useMemo(() => {
    if (numericColumns === 0) {
      return 0;
    }

    const normalScore =
      (normalColumns / numericColumns) * 70;

    const correlationPenalty = Math.min(
      strongCorrelations * 2,
      20,
    );

    const outlierPenalty = Math.min(
      outlierColumns * 2,
      10,
    );

    return Math.max(
      Math.round(
        normalScore -
          correlationPenalty -
          outlierPenalty +
          30,
      ),
      0,
    );
  }, [
    numericColumns,
    normalColumns,
    strongCorrelations,
    outlierColumns,
  ]);

  if (numericColumns === 0) {
    return (
      <EmptyState
        icon={<Brain className="h-10 w-10" />}
        title="Insights Unavailable"
        description="Run analysis on a dataset to generate AI insights."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={
          <Brain className="h-6 w-6 text-violet-600" />
        }
        title="AI Executive Insights"
        subtitle="Automatic executive summary for your dataset."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Dataset Health"
          value={`${healthScore}%`}
          subtitle="Overall Quality"
          icon={TrendingUp}
          color={
            healthScore >= 80
              ? "green"
              : healthScore >= 60
              ? "orange"
              : "red"
          }
        />

        <MetricCard
          title="Numeric Features"
          value={numericColumns}
          subtitle="Analyzed"
          icon={Target}
          color="blue"
        />

        <MetricCard
          title="Strong Correlations"
          value={strongCorrelations}
          subtitle="Detected"
          icon={Sparkles}
          color="purple"
        />

        <MetricCard
          title="Normal Features"
          value={normalColumns}
          subtitle="Distribution"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      <Card>
                <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Brain
                size={22}
                className="text-violet-600"
              />

              <h2 className="text-xl font-bold text-slate-900">
                AI Executive Summary
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-7 text-slate-700">
              <p>
                The dataset contains{" "}
                <strong>{numericColumns}</strong> numeric
                feature{numericColumns === 1 ? "" : "s"} that
                have been statistically analyzed.
              </p>

              <p>
                <strong>{normalColumns}</strong> feature
                {normalColumns === 1 ? "" : "s"} follow an
                approximately normal distribution.
              </p>

              <p>
                <strong>{strongCorrelations}</strong> strong
                correlation
                {strongCorrelations === 1 ? "" : "s"} were
                detected between numeric variables.
              </p>

              <p>
                <strong>{outlierColumns}</strong> feature
                {outlierColumns === 1 ? "" : "s"} contain
                statistical outliers.
              </p>

              <p>
                Based on statistical profiling, the dataset
                currently has an estimated health score of{" "}
                <strong>{healthScore}%</strong>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Dataset Health
            </h3>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Overall Health
                  </span>

                  <strong>{healthScore}%</strong>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      healthScore >= 80
                        ? "bg-green-500"
                        : healthScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${healthScore}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Normal Features
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {normalColumns}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Outlier Features
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {outlierColumns}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Strong Correlations
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {strongCorrelations}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    AI Status
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    {healthScore >= 80
                      ? "Excellent"
                      : healthScore >= 60
                      ? "Good"
                      : "Needs Review"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-5 text-lg font-semibold">
            AI Key Findings
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles
                      size={18}
                      className="mt-1 text-blue-600"
                    />

                    <p className="text-sm leading-7 text-slate-700">
                      {insight}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-xl bg-white p-5 text-center text-slate-500">
                No AI insights are currently available.
              </div>
            )}
          </div>
        </div>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Brain
                size={22}
                className="text-emerald-600"
              />

              <h3 className="text-lg font-semibold text-slate-900">
                AI Recommendations
              </h3>
            </div>

            <div className="space-y-4">

              <div className="rounded-xl bg-white p-4">
                <h4 className="font-semibold text-slate-900">
                  Data Quality
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {outlierColumns > 0
                    ? "Review variables containing outliers before model training."
                    : "No major outlier issues detected."}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <h4 className="font-semibold text-slate-900">
                  Feature Engineering
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {strongCorrelations > 5
                    ? "Several highly correlated features were found. Consider feature selection or dimensionality reduction."
                    : "Correlation levels are acceptable for most machine learning workflows."}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <h4 className="font-semibold text-slate-900">
                  Distribution
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {normalColumns === numericColumns
                    ? "Most features follow a normal distribution."
                    : "Consider scaling or transformation for non-normal features when using linear models."}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Recommended Algorithms
            </h3>

            <div className="grid gap-3">
              {[
                "Linear Regression",
                "Logistic Regression",
                "Random Forest",
                "XGBoost",
                "LightGBM",
                "CatBoost",
                "Support Vector Machine",
                "K-Nearest Neighbors",
              ].map((algorithm) => (
                <div
                  key={algorithm}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <p className="font-medium text-slate-800">
                    {algorithm}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-indigo-300 bg-white p-4">
              <h4 className="font-semibold text-slate-900">
                ML Readiness
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {healthScore >= 85
                  ? "Excellent dataset quality. Only minimal preprocessing is recommended before training."
                  : healthScore >= 70
                  ? "Good dataset quality. Review correlations and outliers before model development."
                  : "Additional preprocessing is recommended before building predictive models."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-6">
          <div className="flex items-start gap-4">
            <Brain
              size={28}
              className="mt-1 text-violet-600"
            />

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Final AI Conclusion
              </h3>

              <p className="mt-4 leading-8 text-slate-700">
                The analysis indicates that this dataset has been successfully
                profiled across descriptive statistics, correlation patterns,
                distribution characteristics and AI-generated insights.
                Reviewing correlated features, addressing outliers where
                appropriate and selecting suitable preprocessing techniques
                will improve model performance and reliability.
              </p>
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
}