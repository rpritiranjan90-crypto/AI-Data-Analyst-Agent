import type { AnalysisTab } from "../../pages/AnalysisPage";
import {
  LayoutDashboard,
  Calculator,
  GitCommit,
  Zap,
  Tags,
  Activity,
  CalendarClock,
  Sparkles,
  FileText,
  type LucideIcon,
} from "lucide-react";

interface AnalysisTabsProps {
  activeTab: AnalysisTab;
  onChange: (tab: AnalysisTab) => void;
}

const tabs: {
  id: AnalysisTab;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "statistics", label: "Statistics", icon: Calculator },
  { id: "correlation", label: "Correlation", icon: GitCommit },
  { id: "strong-correlation", label: "Strong Correlations", icon: Zap },
  { id: "categorical", label: "Categorical", icon: Tags },
  { id: "distribution", label: "Distribution", icon: Activity },
  { id: "timeseries", label: "Time Series", icon: CalendarClock },
  { id: "insights", label: "AI Insights", icon: Sparkles },
  { id: "report", label: "AI Report", icon: FileText },
];

export default function AnalysisTabs({
  activeTab,
  onChange,
}: AnalysisTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-md shadow-slate-300/50 dark:shadow-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
            }`}
          >
            <Icon size={15} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}