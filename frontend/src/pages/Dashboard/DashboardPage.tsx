import { useNavigate } from "react-router-dom";
import {
  Database,
  Table2,
  TriangleAlert,
  FileSpreadsheet,
  Upload,
  BarChart3,
  BrainCircuit,
  Sparkles,
  Zap,
  Wand2,
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
import { useDatasetStore } from "../../store/datasetStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

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

  return (
    <div className="space-y-8">
      {/* Executive Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-slate-900/10"
      >
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-40 -bottom-10 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/20">
              <Sparkles size={14} className="text-blue-400" /> Executive Analytics Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              AI Intelligence Center
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Automated data profiling, statistical discovery, machine learning, and executive AI insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(metadata ? "/analysis" : "/upload")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 border border-blue-400/30 px-5 py-3"
            >
              <Zap size={18} className="mr-2" />
              {metadata ? "Explore Dataset Analysis" : "Upload First Dataset"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Overview Section */}
      <section>
        <PageHeader
          title="Executive KPI Metrics"
          subtitle="Real-time profiling of the active dataset"
          badge="Live Analytics"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="Total Records (Rows)"
            value={metadata?.rows ?? 0}
            trend={12}
            icon={Database}
            color="bg-gradient-to-tr from-blue-600 to-blue-500"
          />

          <KPICard
            title="Dataset Attributes (Cols)"
            value={metadata?.columns ?? 0}
            trend={4}
            icon={Table2}
            color="bg-gradient-to-tr from-emerald-600 to-emerald-500"
          />

          <KPICard
            title="Missing Data Points"
            value={metadata?.missing_values ?? 0}
            trend={-2}
            icon={TriangleAlert}
            color="bg-gradient-to-tr from-amber-600 to-amber-500"
          />

          <KPICard
            title="Memory Usage (MB)"
            value={metadata?.memory_usage_mb?.toFixed(2) ?? "0.00"}
            trend={8}
            icon={FileSpreadsheet}
            color="bg-gradient-to-tr from-purple-600 to-purple-500"
          />
        </div>
      </section>

      {/* Analytics & Summary Section */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DatasetSummaryChart />
        </div>

        {/* Recent Dataset - Executive Banner style */}
        {metadata ? (
          <RecentUploads />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 shadow-xl flex flex-col justify-between min-h-[260px]"
          >
            {/* Ambient glows */}
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3 text-blue-400">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Recent Dataset</h3>
                  <p className="text-xs text-slate-400">Latest uploaded dataset information</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                  <Sparkles size={11} className="text-indigo-400" />
                  Dataset Import Portal
                </div>
                <h4 className="text-lg font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  No Dataset Uploaded
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload a CSV or Excel dataset to unlock AI-powered analytics, real-time profiling, and insights.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-col gap-2">
              <button
                onClick={() => navigate("/upload")}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200"
              >
                <Upload size={14} className="inline mr-2" />
                Upload Dataset
              </button>
              <button
                onClick={loadDemoDataset}
                className="w-full rounded-2xl border border-slate-600/60 bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all duration-200"
              >
                ⚡ Load Demo Dataset
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* AI Insights & Quick Action Launchers */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* AI Workspace - Executive Banner when no dataset */}
          {metadata ? (
            <AIInsights />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/60 p-8 shadow-xl min-h-[240px] flex flex-col justify-between"
            >
              {/* Ambient glows */}
              <div className="absolute top-0 right-0 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

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
                  <Sparkles size={11} className="text-purple-400" />
                  Powered by Gemini AI
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
                  <Upload size={15} className="inline mr-2" />
                  Upload First Dataset
                </button>
                <button
                  onClick={loadDemoDataset}
                  className="rounded-2xl border border-slate-600/60 bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all duration-200"
                >
                  ⚡ Load Demo Dataset
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Workspace Shortcuts */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="rounded-2xl bg-indigo-50 dark:bg-slate-800 p-3 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Workspace Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct access to platform modules
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ActionButton
              icon={<Upload size={18} />}
              title="Dataset Importer"
              description="Upload new CSV or Excel files"
              onClick={() => navigate("/upload")}
            />

            <ActionButton
              icon={<Wand2 size={18} />}
              title="Data Cleaning Studio"
              description="Impute missing & clean outliers"
              onClick={() => navigate("/cleaning")}
            />

            <ActionButton
              icon={<BarChart3 size={18} />}
              title="Visualization Studio"
              description="Build interactive charts"
              onClick={() => navigate("/visualization")}
            />

            <ActionButton
              icon={<BrainCircuit size={18} />}
              title="ML Studio"
              description="Train predictive models"
              onClick={() => navigate("/machine-learning")}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

function ActionButton({
  icon,
  title,
  description,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-4 text-left transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:shadow-md active:scale-95 shadow-slate-200/40"
    >
      <div className="rounded-xl bg-white dark:bg-slate-700 p-3 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-600">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </button>
  );
}