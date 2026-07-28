export default function CorrelationLegend() {
  const legend = [
    {
      label: "Strong Negative",
      color: "bg-red-700 dark:bg-red-600",
      value: "-1.0",
    },
    {
      label: "Moderate Negative",
      color: "bg-red-400 dark:bg-red-500",
      value: "-0.5",
    },
    {
      label: "No Correlation",
      color: "bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600",
      value: "0.0",
    },
    {
      label: "Moderate Positive",
      color: "bg-blue-400 dark:bg-blue-500",
      value: "+0.5",
    },
    {
      label: "Strong Positive",
      color: "bg-blue-700 dark:bg-indigo-600",
      value: "+1.0",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <h3 className="mb-4 text-sm font-extrabold text-slate-900 dark:text-white">
        Correlation Legend
      </h3>

      <div className="flex flex-wrap gap-4">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            <div
              className={`h-4 w-4 rounded-md ${item.color}`}
            />

            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {item.label}
            </span>

            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400 font-semibold">
              ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}