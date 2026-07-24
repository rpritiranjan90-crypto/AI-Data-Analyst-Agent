import {
  Brain,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import StatCard from "../../../../components/ui/StatCard";

interface ReportKPIsProps {
  datasetScore: number;
  mlReadiness: number;
  confidence: number;
  models: number;
}

export default function ReportKPIs({
  datasetScore,
  mlReadiness,
  confidence,
  models,
}: ReportKPIsProps) {
  const datasetStatus =
    datasetScore >= 90
      ? "Excellent"
      : datasetScore >= 75
      ? "Good"
      : "Needs Review";

  const mlStatus =
    mlReadiness >= 90
      ? "Production Ready"
      : mlReadiness >= 70
      ? "Suitable"
      : "Further Preparation";

  const confidenceStatus =
    confidence >= 90
      ? "High Confidence"
      : confidence >= 75
      ? "Moderate Confidence"
      : "Low Confidence";

  const items = [
    {
      title: "Dataset Score",
      value: `${datasetScore}/100`,
      progress: datasetScore,
      subtitle: datasetStatus,
      icon: (
        <Database className="h-6 w-6 text-blue-600" />
      ),
    },
    {
      title: "ML Readiness",
      value: `${mlReadiness}/100`,
      progress: mlReadiness,
      subtitle: mlStatus,
      icon: (
        <Brain className="h-6 w-6 text-purple-600" />
      ),
    },
    {
      title: "AI Confidence",
      value: `${confidence}/100`,
      progress: confidence,
      subtitle: confidenceStatus,
      icon: (
        <ShieldCheck className="h-6 w-6 text-green-600" />
      ),
    },
    {
      title: "Recommended Models",
      value: models,
      subtitle:
        models === 1
          ? "1 algorithm suggested"
          : `${models} algorithms suggested`,
      icon: (
        <Sparkles className="h-6 w-6 text-amber-600" />
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Executive Metrics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          High-level indicators generated from the AI analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <StatCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            progress={item.progress}
          />
        ))}
      </div>
    </section>
  );
}