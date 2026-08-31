import { useMemo } from "react";
import { Target, ArrowRight, TrendingUp, DollarSign, Users, AlertTriangle, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import ExecutiveEmptyStateBanner from "../../components/ui/ExecutiveEmptyStateBanner";
import { useDatasetStore } from "../../store/datasetStore";
import type { ColumnDetail } from "../../types/dataset";

interface Decision {
  id: string;
  title: string;
  category: string;
  roi: string;
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  confidence: number;
  timeline: string;
  desc: string;
  actionLabel: string;
  actionPath: string;
}

export default function DecisionCenterPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const decisions = useMemo<Decision[]>(() => {
    if (!metadata) {
      return [
        {
          id: "no-data",
          title: "Upload a Dataset to Unlock AI Business Decisions",
          category: "Getting Started",
          roi: "N/A",
          risk: "Low Risk" as const,
          confidence: 0,
          timeline: "Today",
          desc: "Import a CSV or Excel file to generate data-driven business recommendations, ROI estimates, and strategic insights powered by AI analysis.",
          actionLabel: "Upload Dataset",
          actionPath: "/upload",
        },
      ];
    }

    const decisions: Decision[] = [];
    const rows = metadata.rows;
    const missing = metadata.missing_values ?? 0;
    const dups = metadata.duplicate_rows ?? 0;
    // Column details live in dataset.profile (ColumnDetail[]), not in metadata directly.
    const colDetails: ColumnDetail[] = (dataset?.profile?.columns ?? []) as ColumnDetail[];

    // 1. Data Quality Decision
    if (missing > 0 || dups > 0) {
      const issues: string[] = [];
      if (missing > 0) issues.push(`${missing.toLocaleString()} missing cells`);
      if (dups > 0) issues.push(`${dups} duplicate rows`);
      decisions.push({
        id: "data-quality",
        title: "Clean Dataset Quality Issues",
        category: "Data Quality",
        roi: "Improved accuracy",
        risk: "Low Risk",
        confidence: 99,
        timeline: "Today",
        desc: `Your dataset has ${issues.join(" and ")}. Cleaning improves downstream ML model accuracy by 15–40%.`,
        actionLabel: "Open Cleaning Studio",
        actionPath: "/cleaning",
      });
    } else {
      decisions.push({
        id: "data-quality-clean",
        title: "Dataset Quality — Excellent",
        category: "Data Quality",
        roi: "No action needed",
        risk: "Low Risk",
        confidence: 99,
        timeline: "N/A",
        desc: "Your dataset is clean — no missing values or duplicate rows detected. Ready for analysis.",
        actionLabel: "View Analysis",
        actionPath: "/analysis",
      });
    }

    // 2. Visualization Decision
    const isNumeric = (c: ColumnDetail) =>
      c.dtype === "number" || c.dtype === "int" || c.dtype === "float" || c.dtype === "int64" || c.dtype === "float64";
    const numCols = colDetails.filter(isNumeric).length;
    if (numCols >= 2) {
      decisions.push({
        id: "visualization",
        title: `Generate ${numCols} Numeric Column Visualizations`,
        category: "Analytics",
        roi: "Faster insight discovery",
        risk: "Low Risk",
        confidence: 95,
        timeline: "Today",
        desc: `Your dataset has ${numCols} numeric columns — ideal for scatter plots, histograms, correlation heatmaps, and box plots. Auto-generate them in seconds.`,
        actionLabel: "Open Visualization Studio",
        actionPath: "/visualization",
      });
    }

    // 3. ML Decision
    const catCol = colDetails.find((c) => !isNumeric(c));
    const numCol = colDetails.find(isNumeric);
    if (catCol && numCol && rows >= 50) {
      decisions.push({
        id: "ml-classification",
        title: `Train ML Classification Model: ${catCol.name}`,
        category: "Predictive ML",
        roi: "Predictive advantage",
        risk: "Medium Risk",
        confidence: rows >= 500 ? 88 : 72,
        timeline: "Today",
        desc: `With "${numCol.name}" as a feature and "${catCol.name}" as target, you can train a Random Forest classifier to predict outcomes.`,
        actionLabel: "Open ML Studio",
        actionPath: "/machine-learning",
      });
    } else if (numCols >= 2 && rows >= 50) {
      decisions.push({
        id: "ml-regression",
        title: "Train Regression Model",
        category: "Predictive ML",
        roi: "Predictive advantage",
        risk: "Medium Risk",
        confidence: rows >= 500 ? 85 : 70,
        timeline: "Today",
        desc: `Multiple numeric columns detected — train a Linear Regression or Random Forest Regressor to predict numeric outcomes.`,
        actionLabel: "Open ML Studio",
        actionPath: "/machine-learning",
      });
    }

    // 4. AI Insights Decision
    decisions.push({
      id: "ai-insights",
      title: "Generate AI Executive Insights Report",
      category: "AI Intelligence",
      roi: "Data-driven decisions",
      risk: "Low Risk",
      confidence: 90,
      timeline: "Today",
      desc: "Let Gemini AI analyze your dataset and produce an executive summary with key findings, recommendations, and strategic insights.",
      actionLabel: "View AI Insights",
      actionPath: "/analysis",
    });

    // 5. What-if Simulation
    if (numCols >= 1) {
      decisions.push({
        id: "simulation",
        title: "Run What-If Scenario Simulation",
        category: "Business Strategy",
        roi: "Risk-free scenario testing",
        risk: "Low Risk",
        confidence: 100,
        timeline: "Today",
        desc: "Use the interactive simulator to model revenue changes, cost adjustments, and marketing multipliers to find optimal business outcomes.",
        actionLabel: "Open Simulator",
        actionPath: "/simulator",
      });
    }

    return decisions;
  }, [metadata, dataset?.profile?.columns]);

  function loadDemoDataset() {
    const mockDemo = {
      filename: "HR_Analytics_Demo.csv",
      filepath: "uploads/HR_Analytics_Demo.csv",
      extension: ".csv",
      rows: 1500,
      columns: 5,
      missing_values: 12,
      duplicate_rows: 3,
      memory_usage_mb: 0.12,
      file_size_bytes: 125000,
      column_names: ["employee_id", "age", "salary", "department", "churned"],
      columns_detail: [
        { name: "employee_id", type: "string" },
        { name: "age", type: "number" },
        { name: "salary", type: "number" },
        { name: "department", type: "string" },
        { name: "churned", type: "number" },
      ],
      head: [
        { employee_id: "EMP_001", age: 34, salary: 75000, department: "IT", churned: 0 },
        { employee_id: "EMP_002", age: 42, salary: 92000, department: "Sales", churned: 1 },
      ],
    };
    setDataset({ metadata: mockDemo, success: true, message: "Loaded demo" });
    toast.success("Loaded HR Analytics Demo dataset!");
  }

  const riskColors: Record<Decision["risk"], string> = {
    "Low Risk": "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    "Medium Risk": "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    "High Risk": "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    "Data Quality": <AlertTriangle size={16} />,
    "Analytics": <BarChart2 size={16} />,
    "Predictive ML": <TrendingUp size={16} />,
    "AI Intelligence": <Target size={16} />,
    "Business Strategy": <DollarSign size={16} />,
    "Getting Started": <Users size={16} />,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Decision Center"
        title="Business Decision Center & Strategic AI Advisor"
        subtitle={metadata
          ? `AI-powered decisions derived from "${metadata.filename}" · ${metadata.rows.toLocaleString()} rows · ${metadata.columns} columns`
          : "Upload a dataset to generate data-driven recommendations"
        }
      />

      {!metadata && (
        <ExecutiveEmptyStateBanner
          badgeText="AI Decision Engine"
          title="AI Decision Engine Ready"
          subtitle="Upload a dataset to unlock personalized business recommendations, ROI estimates, and strategic action plans."
          actionText="Upload Dataset"
          onLoadDemo={loadDemoDataset}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {decisions.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {categoryIcons[item.category] && (
                    <span className="text-indigo-600 dark:text-indigo-400">{categoryIcons[item.category]}</span>
                  )}
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                    {item.category}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${riskColors[item.risk]}`}>
                  {item.risk}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">Expected ROI:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{item.roi}</span>
              </div>
              {item.confidence > 0 && (
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>AI Confidence:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{item.confidence}%</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Timeline:</span>
                <span className="text-slate-800 dark:text-slate-200">{item.timeline}</span>
              </div>
            </div>

            <Link to={item.actionPath}>
              <Button variant="outline" size="sm" className="w-full mt-2">
                {item.actionLabel} <ArrowRight size={13} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
