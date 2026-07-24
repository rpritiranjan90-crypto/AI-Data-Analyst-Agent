import {
  Brain,
  Database,
  HardDrive,
  Layers3,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Copy,
} from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { useDatasetStore } from "../../store/datasetStore";

export default function AIInsights() {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

  if (!metadata) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-2xl bg-blue-50 p-3">
            <Brain className="text-blue-600" size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              AI Workspace
            </h3>

            <p className="text-sm text-slate-500">
              Upload a dataset to generate AI insights.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Brain
            className="mx-auto mb-4 text-slate-300"
            size={48}
          />

          <p className="font-semibold text-slate-700">
            No dataset available
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Upload a CSV or Excel file to unlock AI-powered analysis.
          </p>
        </div>
      </Card>
    );
  }

  const health =
    metadata.missing_values === 0 &&
    metadata.duplicate_rows === 0
      ? "Excellent"
      : metadata.missing_values < 10
      ? "Good"
      : "Needs Review";

  const recommendations = [];

  if (metadata.columns >= 2)
    recommendations.push("Correlation Analysis");

  if (metadata.columns >= 1)
    recommendations.push("Distribution Analysis");

  if (metadata.columns >= 3)
    recommendations.push("Heatmap");

  if (metadata.rows > 100)
    recommendations.push("Outlier Detection");

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-3">
            <Brain
              className="text-blue-600"
              size={24}
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              AI Workspace
            </h3>

            <p className="text-sm text-slate-500">
              Intelligent dataset overview
            </p>
          </div>
        </div>

        <Badge color="green">
          Dataset Ready
        </Badge>
      </div>

      {/* Health */}
      <div className="mb-6 rounded-2xl bg-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Dataset Health
            </p>

            <h2 className="mt-1 text-2xl font-bold text-emerald-900">
              {health}
            </h2>
          </div>

          <ShieldCheck
            className="text-emerald-600"
            size={34}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoCard
          icon={<Database size={18} />}
          label="Rows"
          value={metadata.rows.toLocaleString()}
        />

        <InfoCard
          icon={<Layers3 size={18} />}
          label="Columns"
          value={metadata.columns}
        />

        <InfoCard
          icon={<AlertTriangle size={18} />}
          label="Missing"
          value={metadata.missing_values}
        />

        <InfoCard
          icon={<Copy size={18} />}
          label="Duplicates"
          value={metadata.duplicate_rows}
        />

        <InfoCard
          icon={<HardDrive size={18} />}
          label="Memory"
          value={`${metadata.memory_usage_mb.toFixed(2)} MB`}
        />
      </div>

      {/* Recommendations */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles
            className="text-amber-500"
            size={18}
          />

          <h4 className="font-semibold text-slate-900">
            AI Recommendations
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendations.map((item) => (
            <Badge
              key={item}
              variant="info"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 text-blue-600">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}