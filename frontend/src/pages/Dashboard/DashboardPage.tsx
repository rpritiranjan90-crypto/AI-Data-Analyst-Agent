import {
  Database,
  Table2,
  TriangleAlert,
  FileSpreadsheet,
  Upload,
  BarChart3,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

import AIInsights from "../../components/dashboard/AIInsights";
import DatasetSummaryChart from "../../components/dashboard/DatasetSummaryChart";
import KPICard from "../../components/dashboard/KPICard";
import RecentUploads from "../../components/dashboard/RecentUploads";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import { useDatasetStore } from "../../store/datasetStore";

export default function DashboardPage() {
  const dataset = useDatasetStore((state) => state.dataset);

  const metadata = dataset?.metadata;

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Data Analyst Workspace"
        subtitle="Monitor your datasets, explore insights, and generate AI-powered analytics from one place."
      />

      {/* KPI Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Executive Overview
            </h2>

            <p className="text-sm text-slate-500">
              Real-time dataset statistics
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="Rows"
            value={metadata?.rows ?? 0}
            trend={12}
            icon={Database}
            color="bg-blue-500"
          />

          <KPICard
            title="Columns"
            value={metadata?.columns ?? 0}
            trend={4}
            icon={Table2}
            color="bg-emerald-500"
          />

          <KPICard
            title="Missing Values"
            value={metadata?.missing_values ?? 0}
            trend={-2}
            icon={TriangleAlert}
            color="bg-orange-500"
          />

          <KPICard
            title="Memory (MB)"
            value={metadata?.memory_usage_mb?.toFixed(2) ?? "0.00"}
            trend={8}
            icon={FileSpreadsheet}
            color="bg-purple-500"
          />
        </div>
      </section>

      {/* Analytics */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DatasetSummaryChart />
        </div>

        <RecentUploads />
      </section>

      {/* AI + Actions */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AIInsights />
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3">
              <Sparkles
                className="text-indigo-600"
                size={22}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h3>

              <p className="text-sm text-slate-500">
                Frequently used tools
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ActionButton
              icon={<Upload size={18} />}
              title="Upload Dataset"
              description="Import CSV or Excel files"
            />

            <ActionButton
              icon={<BarChart3 size={18} />}
              title="Visualize Data"
              description="Create interactive charts"
            />

            <ActionButton
              icon={<BrainCircuit size={18} />}
              title="AI Analysis"
              description="Generate intelligent insights"
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
}

function ActionButton({
  icon,
  title,
  description,
}: ActionButtonProps) {
  return (
    <button
      className="
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        border
        border-slate-200
        p-4
        text-left
        transition-all
        duration-200
        hover:border-blue-200
        hover:bg-blue-50
      "
    >
      <div className="rounded-xl bg-slate-100 p-3 text-blue-600">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">
          {title}
        </h4>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}