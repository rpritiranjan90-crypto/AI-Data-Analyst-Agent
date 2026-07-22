import {
  AlertTriangle,
  BarChart3,
  CopyMinus,
  Database,
  HardDrive,
  ShieldCheck,
  Table2,
  Tags,
} from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useDatasetStore } from "../../../../store/datasetStore";
import { useAnalysisSummary } from "../../hooks";

export default function OverviewTab() {
  const { dataset } = useDatasetStore();

  const {
    data,
    isLoading,
    isError,
  } = useAnalysisSummary();

  if (!dataset) {
    return (
      <EmptyState
        icon={Database}
        title="No Dataset Uploaded"
        description="Upload a CSV or Excel file to begin exploring your data."
      />
    );
  }

  if (isLoading) {
    return <LoadingCard rows={8} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Analysis Failed"
        description="Unable to load the dataset analysis. Please try again."
      />
    );
  }

  const metadata = dataset.metadata;

  const qualityInsight =
    data.insights.find((item) =>
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
            value={data.correlation.total_numeric_columns}
            subtitle="Ready for analysis"
            icon={BarChart3}
            color="blue"
          />

          <MetricCard
            title="Categorical Columns"
            value={Object.keys(data.categorical).length}
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

      <section>
        <SectionHeader
          icon={ShieldCheck}
          title="Dataset Quality"
          subtitle="Overall quality assessment."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <StatusBadge
            label={qualityLabel}
            variant={qualityVariant}
          />

          {qualityInsight && (
            <p className="mt-4 text-slate-600">
              {qualityInsight}
            </p>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={BarChart3}
          title="AI Insights"
          subtitle="Automatically generated insights from your dataset."
        />

        <div className="space-y-4">
          {data.insights.map((insight, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {insight}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}