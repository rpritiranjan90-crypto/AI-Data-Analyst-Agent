export default function CorrelationLegend() {
  const legend = [
    {
      label: "Strong Negative",
      color: "bg-red-700",
      value: "-1.0",
    },
    {
      label: "Moderate Negative",
      color: "bg-red-400",
      value: "-0.5",
    },
    {
      label: "No Correlation",
      color: "bg-slate-100 border border-slate-300",
      value: "0.0",
    },
    {
      label: "Moderate Positive",
      color: "bg-blue-400",
      value: "+0.5",
    },
    {
      label: "Strong Positive",
      color: "bg-blue-700",
      value: "+1.0",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Correlation Legend
      </h3>

      <div className="flex flex-wrap gap-4">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            <div
              className={`h-5 w-5 rounded ${item.color}`}
            />

            <span className="text-sm text-slate-700">
              {item.label}
            </span>

            <span className="text-xs font-medium text-slate-500">
              ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}