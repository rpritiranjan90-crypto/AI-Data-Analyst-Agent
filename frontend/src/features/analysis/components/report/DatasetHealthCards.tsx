import {
  Activity,
  Brain,
  ShieldCheck,
  Database,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface DatasetHealthCardsProps {
  datasetScore: number;
  mlReadiness: number;
  confidence: number;
  models: number;
}

function getStatus(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

export default function DatasetHealthCards({
  datasetScore,
  mlReadiness,
  confidence,
  models,
}: DatasetHealthCardsProps) {
  const cards = [
    {
      title: "Dataset Quality",
      value: `${datasetScore}/100`,
      status: getStatus(datasetScore),
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "ML Readiness",
      value: `${mlReadiness}/100`,
      status: getStatus(mlReadiness),
      icon: Brain,
      color: "text-green-600",
    },
    {
      title: "Confidence",
      value: `${confidence}/100`,
      status: getStatus(confidence),
      icon: ShieldCheck,
      color: "text-purple-600",
    },
    {
      title: "Recommended Models",
      value: models,
      status: "Available",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        📊 Dataset Health
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Icon className={card.color} size={28} />
              </div>

              <h3 className="mt-4 text-sm font-medium text-slate-500">
                {card.title}
              </h3>

              <div className="mt-2 text-3xl font-bold text-slate-900">
                {card.value}
              </div>

              <div className="mt-2 text-sm font-medium text-slate-600">
                {card.status}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}