import {
  Database,
  Table2,
  TriangleAlert,
  FileSpreadsheet,
} from "lucide-react";

import AIInsights from "../../components/dashboard/AIInsights";
import DatasetSummaryChart from "../../components/dashboard/DatasetSummaryChart";
import KPICard from "../../components/dashboard/KPICard";
import RecentUploads from "../../components/dashboard/RecentUploads";
import PageHeader from "../../components/ui/PageHeader";
import { useDatasetStore } from "../../store/datasetStore";

export default function DashboardPage() {
  const dataset = useDatasetStore((state) => state.dataset);

  const metadata = dataset?.metadata;

  return (
    <div className="space-y-8">
      <PageHeader
        title="👋 Welcome back"
        subtitle="Here's what's happening with your AI Data Analyst workspace today."
      />

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
          color="bg-green-500"
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
          value={metadata?.memory_usage_mb ?? 0}
          trend={8}
          icon={FileSpreadsheet}
          color="bg-purple-500"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DatasetSummaryChart />
        <RecentUploads />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AIInsights />

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
          Quick Actions (Coming Next)
        </div>
      </div>
    </div>
  );
}