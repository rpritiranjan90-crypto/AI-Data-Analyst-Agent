import Card from "../../../../components/ui/Card";

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
  const items = [
    {
      label: "Dataset Score",
      value: `${datasetScore}/100`,
    },
    {
      label: "ML Readiness",
      value: `${mlReadiness}/100`,
    },
    {
      label: "Confidence",
      value: `${confidence}/100`,
    },
    {
      label: "Models",
      value: models,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="text-sm text-slate-500">
            {item.label}
          </div>

          <div className="mt-2 text-3xl font-bold text-slate-900">
            {item.value}
          </div>
        </Card>
      ))}
    </div>
  );
}