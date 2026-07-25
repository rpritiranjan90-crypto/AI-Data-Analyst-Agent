import {
  AlertTriangle,
  BarChart3,
  CopyMinus,
  Database,
  HardDrive,
  ShieldCheck,
  Table2,
  Tags,
  Sparkles,
} from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useDatasetStore } from "../../../../store/datasetStore";
import { useAnalysisData } from "../../context/AnalysisContext";

import ExecutiveSummaryCard from "../dashboard/ExecutiveSummaryCard";
import DatasetHealthCard from "../dashboard/DatasetHealthCard";

import CleaningSuggestions from "../cleaning/CleaningSuggestions";
import { useCleaningReport } from "../../hooks/useCleaningReport";
import NLQueryWidget from "../nl-query/NLQueryWidget";


export default function OverviewTab() {
  const { dataset } = useDatasetStore();

  const analysis = useAnalysisData();

  const {
    correlation,
    categorical,
    insights,
  } = analysis;

  const cleaningReport = useCleaningReport();

  if (!dataset) {
    return (
      <EmptyState
        icon={Database}
        title="No Dataset Uploaded"
        description="Upload a CSV or Excel file to begin exploring your data."
      />
    );
  }

  const metadata = dataset.metadata;

  const qualityInsight =
    insights.find((item) =>
      item.toLowerCase().includes("dataset quality score")
    ) ?? "";

  let qualityLabel = "Unknown";

  let qualityVariant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral" = "neutral";

  if (qualityInsight.includes("Excellent")) {
    qualityLabel = "Excellent";
    qualityVariant = "success";
  } else if (qualityInsight.includes("Good")) {
    qualityLabel = "Good";
    qualityVariant = "info";
  } else if (qualityInsight.includes("Fair")) {
    qualityLabel = "Fair";
    qualityVariant = "warning";
  } else if (qualityInsight.includes("Poor")) {
    qualityLabel = "Poor";
    qualityVariant = "danger";
  }

  return (
    <div className="space-y-10">
      {/* Natural Language Query Widget (Talk to CSV Engine) */}
      <section>
        <NLQueryWidget />
      </section>

      {/* Executive Summary */}

      <section>
        <ExecutiveSummaryCard
          rows={metadata.rows}
          columns={metadata.columns}
          qualityLabel={qualityLabel}
          qualityVariant={qualityVariant}
          missingValues={metadata.missing_values}
          duplicateRows={metadata.duplicate_rows}
          numericColumns={correlation.total_numeric_columns}
          categoricalColumns={Object.keys(categorical).length}
          qualityInsight={qualityInsight}
        />
      </section>

      {/* Dataset Overview */}

      <section>
        <SectionHeader
          icon={Database}
          title="Dataset Overview"
          subtitle="Quick summary of the uploaded dataset."
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Rows"
            value={metadata.rows.toLocaleString()}
            subtitle="Dataset records"
            icon={BarChart3}
            color="blue"
          />

          <MetricCard
            title="Columns"
            value={metadata.columns}
            subtitle="Available fields"
            icon={Table2}
            color="purple"
          />

          <MetricCard
            title="Missing Values"
            value={metadata.missing_values}
            subtitle="Needs cleaning"
            icon={AlertTriangle}
            color="orange"
          />

          <MetricCard
            title="Duplicate Rows"
            value={metadata.duplicate_rows}
            subtitle="Potential duplicates"
            icon={CopyMinus}
            color="red"
          />

          <MetricCard
            title="Memory Usage"
            value={`${metadata.memory_usage_mb.toFixed(2)} MB`}
            subtitle="Dataset size"
            icon={HardDrive}
            color="green"
          />

          <MetricCard
            title="Numeric Columns"
            value={correlation.total_numeric_columns}
            subtitle="Ready for analysis"
            icon={BarChart3}
            color="blue"
          />

          <MetricCard
            title="Categorical Columns"
            value={Object.keys(categorical).length}
            subtitle="Category features"
            icon={Tags}
            color="purple"
          />

          <MetricCard
            title="Quality"
            value={qualityLabel}
            subtitle="Overall dataset health"
            icon={ShieldCheck}
            color="green"
          />
        </div>
      </section>

      {/* Dataset Health */}

      <section>
        <SectionHeader
          icon={ShieldCheck}
          title="Dataset Health Dashboard"
          subtitle="AI-powered quality assessment of the uploaded dataset."
        />

        <DatasetHealthCard
          rows={metadata.rows}
          columns={metadata.columns}
          missingValues={metadata.missing_values}
          duplicateRows={metadata.duplicate_rows}
          numericColumns={correlation.total_numeric_columns}
          categoricalColumns={Object.keys(categorical).length}
          qualityLabel={qualityLabel}
          qualityVariant={qualityVariant}
          qualityInsight={qualityInsight}
        />
      </section>

      {/* AI Cleaning Assistant */}

      {cleaningReport && (
        <section>
          <CleaningSuggestions report={cleaningReport} />
        </section>
      )}

      {/* AI Insights */}

      <section>
        <SectionHeader
          icon={BarChart3}
          title="AI Insights"
          subtitle="Automatically generated insights from your dataset."
        />

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-xs transition-shadow hover:shadow-md flex items-start gap-4"
            >
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Sparkles size={18} />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}