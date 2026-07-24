import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Database,
  Lightbulb,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface KeyFindingsProps {
  insights: string[];
}

export default function KeyFindings({
  insights,
}: KeyFindingsProps) {
  const grouped = {
    quality: insights.filter((item) => {
      const text = item.toLowerCase();
      return (
        text.includes("missing") ||
        text.includes("duplicate") ||
        text.includes("outlier")
      );
    }),

    statistics: insights.filter((item) => {
      const text = item.toLowerCase();
      return (
        text.includes("correlation") ||
        text.includes("distribution") ||
        text.includes("skew") ||
        text.includes("variance")
      );
    }),

    ml: insights.filter((item) => {
      const text = item.toLowerCase();
      return (
        text.includes("model") ||
        text.includes("machine learning") ||
        text.includes("feature") ||
        text.includes("training")
      );
    }),

    recommendation: insights.filter((item) => {
      const text = item.toLowerCase();
      return (
        text.includes("recommend") ||
        text.includes("should") ||
        text.includes("consider") ||
        text.includes("suggest")
      );
    }),
  };

  const sections = [
    {
      title: "Data Quality",
      icon: Database,
      color: "text-blue-600",
      items: grouped.quality,
    },
    {
      title: "Statistical Findings",
      icon: BrainCircuit,
      color: "text-violet-600",
      items: grouped.statistics,
    },
    {
      title: "ML Insights",
      icon: CheckCircle2,
      color: "text-green-600",
      items: grouped.ml,
    },
    {
      title: "Recommendations",
      icon: Lightbulb,
      color: "text-amber-600",
      items: grouped.recommendation,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sections.map((section) => {
        const Icon = section.icon;

        return (
          <Card key={section.title}>
            <div className="flex items-center gap-3">
              <Icon
                size={22}
                className={section.color}
              />

              <h3 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {section.items.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-slate-500">
                  <AlertTriangle size={18} />
                  <span>No findings detected.</span>
                </div>
              ) : (
                section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-1 flex-shrink-0 text-green-600"
                    />

                    <p className="text-sm leading-6 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}