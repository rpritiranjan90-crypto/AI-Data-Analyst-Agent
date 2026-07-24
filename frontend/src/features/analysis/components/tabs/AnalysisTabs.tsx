import type { AnalysisTab } from "../../pages/AnalysisPage";

interface AnalysisTabsProps {
  activeTab: AnalysisTab;
  onChange: (tab: AnalysisTab) => void;
}

const tabs: {
  id: AnalysisTab;
  label: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "statistics",
    label: "Statistics",
  },
  {
    id: "correlation",
    label: "Correlation",
  },
  {
    id: "strong-correlation",
    label: "Strong Correlation",
  },
  {
    id: "categorical",
    label: "Categorical",
  },
  {
    id: "distribution",
    label: "Distribution",
  },
  {
    id: "timeseries",
    label: "Time Series",
  },
  {
    id: "insights",
    label: "AI Insights",
  },
  {
    id: "report",
    label: "AI Report",
  },
];

export default function AnalysisTabs({
  activeTab,
  onChange,
}: AnalysisTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}