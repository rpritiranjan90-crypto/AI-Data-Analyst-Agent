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
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

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

        <RecentUploads />
      </section>

      {/* AI Insights & Quick Action Launchers */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AIInsights />
        </div>

        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Workspace Shortcuts
              </h3>
              <p className="text-xs text-slate-500">
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
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-md shadow-slate-200/40"
    >
      <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm border border-slate-100">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}