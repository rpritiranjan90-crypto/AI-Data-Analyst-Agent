import Card from "../../../../components/ui/Card";

const legendItems = [
  {
    label: "Strong Positive",
    range: "+0.80 to +1.00",
    color: "bg-green-600",
  },
  {
    label: "Moderate Positive",
    range: "+0.50 to +0.79",
    color: "bg-green-400",
  },
  {
    label: "Weak / Neutral",
    range: "-0.49 to +0.49",
    color: "bg-slate-300",
  },
  {
    label: "Moderate Negative",
    range: "-0.79 to -0.50",
    color: "bg-red-400",
  },
  {
    label: "Strong Negative",
    range: "-1.00 to -0.80",
    color: "bg-red-600",
  },
];

export default function CorrelationLegend() {
  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">
          Correlation Legend
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Color intensity represents the strength and direction of the
          relationship between two numeric variables.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div
              className={`h-5 w-5 rounded-full ${item.color} flex-shrink-0`}
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {item.label}
              </p>

              <p className="text-xs text-slate-500">
                {item.range}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}