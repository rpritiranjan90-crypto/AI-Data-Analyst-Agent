import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  Table2,
  TriangleAlert,
  FileSpreadsheet,
  Upload,
  BrainCircuit,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import AIInsights from "../../components/dashboard/AIInsights";
import DatasetSummaryChart from "../../components/dashboard/DatasetSummaryChart";
import KPICard from "../../components/dashboard/KPICard";
import RecentUploads from "../../components/dashboard/RecentUploads";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { useDatasetStore } from "../../store/datasetStore";
import OnboardingChecklist from "../../components/onboarding/OnboardingChecklist";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;
  const [loadingDemo, setLoadingDemo] = useState(false);

  function loadDemoDataset() {
    if (loadingDemo) return;
    setLoadingDemo(true);
    // Simulate async work so the user sees clear feedback
    setTimeout(() => {
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
          { name: "department", type: "number" },
          { name: "churned", type: "number" },
        ],
        head: [
          { employee_id: "EMP_001", age: 34, salary: 75000, department: "IT", churned: 0 },
          { employee_id: "EMP_002", age: 42, salary: 92000, department: "Sales", churned: 1 },
        ],
      };
      setDataset({ metadata: mockDemo, success: true, message: "Loaded demo" });
      toast.success("Loaded HR Analytics Demo dataset!");
      setLoadingDemo(false);
    }, 500);
  }

  const executiveDecisions = [
    { title: "Optimize High-Margin Product Pricing", roi: "+$340k / yr", category: "Revenue", confidence: "96%" },
    { title: "Automate Tier-1 Churn Mitigation", roi: "+$210k preserved", category: "Retention", confidence: "92%" },
    { title: "Consolidate Low-Volume DB Cluster", roi: "-$48k expense", category: "Cost", confidence: "98%" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        breadcrumb="Platform / Overview"
        title="Executive Intelligence Dashboard"
        subtitle="AI-powered dataset profiling, real-time metrics, automated charts, and strategic business decisions."
      />

      {/* Onboarding checklist */}
      <OnboardingChecklist />

      {/* Quick Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Quick Actions: Import new dataset or test with demo data
        </span>
        <div className="flex gap-3">
          <Button onClick={loadDemoDataset} variant="outline" size="sm" disabled={loadingDemo}>
            {loadingDemo ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {loadingDemo ? "Loading..." : "Load Demo Dataset"}
          </Button>
          <Button onClick={() => navigate("/upload")} variant="primary" size="sm">
            <Upload size={14} /> Import Dataset
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-live="polite" aria-busy={loadingDemo}>
        {loadingDemo ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton h="h-3" w="w-20" />
                <Skeleton h="h-8" w="h-8" rounded="lg" />
              </div>
              <Skeleton h="h-7" w="w-16" />
              <Skeleton h="h-2.5" w="w-24" />
            </div>
          ))
        ) : (
          <>
            <KPICard
              title="Active Dataset"
              value={metadata ? metadata.filename : "No dataset"}
              trendLabel={metadata ? `${metadata.extension.toUpperCase()} Format` : "Upload a file to begin"}
              icon={FileSpreadsheet}
            />

            <KPICard
              title="Total Rows"
              value={metadata ? metadata.rows.toLocaleString() : "0"}
              trendLabel="Record count"
              icon={Database}
            />

            <KPICard
              title="Columns"
              value={metadata ? metadata.columns : 0}
              trendLabel="Feature dimension"
              icon={Table2}
            />

            <KPICard
              title="Missing Cells"
              value={metadata ? metadata.missing_values.toLocaleString() : "0"}
              trendLabel={metadata && metadata.missing_values > 0 ? "Requires cleaning" : "Data complete"}
              icon={TriangleAlert}
            />

            <KPICard
              title="Duplicate Rows"
              value={metadata ? metadata.duplicate_rows.toLocaleString() : "0"}
              trendLabel={metadata && metadata.duplicate_rows > 0 ? "Duplicates detected" : "No duplicates"}
              icon={TriangleAlert}
            />

            <KPICard
              title="Memory Usage"
              value={metadata ? `${metadata.memory_usage_mb.toFixed(2)} MB` : "0 MB"}
              trendLabel="RAM footprint"
              icon={BrainCircuit}
            />
          </>
        )}
      </section>

      {/* Featured Section: Business Decision Center & Strategic AI Advisor */}
      <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={20} className="text-indigo-600 dark:text-indigo-400" /> Strategic Business Decision Center
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized AI business recommendations with expected financial ROI ($) and confidence scores.
            </p>
          </div>

          <Button onClick={() => navigate("/decision-center")} variant="outline" size="sm">
            Open Full Decision Center <ArrowRight size={14} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 pt-1">
          {executiveDecisions.map((d, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="uppercase text-indigo-600 dark:text-indigo-400">{d.category}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{d.confidence} Confidence</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{d.title}</h4>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                ROI: {d.roi}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Insights & Quick Action Launchers */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {metadata ? (
            <AIInsights />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/60 p-8 shadow-xl min-h-[240px] flex flex-col justify-between"
            >
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-3 text-indigo-400">
                    <BrainCircuit size={26} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg">AI Workspace</h3>
                    <p className="text-xs text-slate-400">Upload a dataset to generate AI insights.</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                  <Sparkles size={11} className="text-purple-400" /> Powered by Gemini AI
                </div>

                <h4 className="text-2xl font-extrabold bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  No Dataset Available
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  Upload a CSV or Excel file to unlock AI-powered analysis, pattern recognition, automated reports, and intelligent recommendations.
                </p>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/upload")}
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200"
                >
                  <Upload size={15} className="inline mr-2" /> Upload First Dataset
                </button>
                <button
                  onClick={loadDemoDataset}
                  disabled={loadingDemo}
                  className="rounded-2xl border border-slate-600/60 bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingDemo ? <Loader2 size={15} className="inline mr-2 animate-spin" /> : "⚡ "}Load Demo Dataset
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar: Dataset Summary Chart */}
        <div>
          <DatasetSummaryChart />
        </div>
      </section>

      {/* Recent Uploads Section */}
      <section>
        <Card className="p-6">
          <RecentUploads />
        </Card>
      </section>
    </div>
  );
}