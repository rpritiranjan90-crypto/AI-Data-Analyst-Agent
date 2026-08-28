import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import ExecutiveEmptyStateBanner from "../../components/ui/ExecutiveEmptyStateBanner";
import { useDatasetStore } from "../../store/datasetStore";
import { getAutoRecommendations } from "../../services/recommendationService";
import type { RecommendationResponse } from "../../types/api";

export default function RecommendationPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (metadata) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

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

  async function fetchRecommendations() {
    try {
      setLoading(true);
      setError(null);
      const res = await getAutoRecommendations();
      setRecommendations(res);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(err);
      toast.error(message ?? "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Smart Recommendations"
          subtitle="AI-driven recommendations for data cleaning, chart choices, and predictive modeling."
        />
        <ExecutiveEmptyStateBanner
          badgeText="Automated AI Guidance System"
          title="Smart Recommendations"
          subtitle="Automated AI advice for dataset cleaning, recommended visualization engines, and machine learning opportunities."
          actionText="Upload First Dataset"
          onLoadDemo={loadDemoDataset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Smart Recommendations"
          subtitle={`AI analytics guidance for: ${metadata.filename}`}
        />
        <Button
          onClick={fetchRecommendations}
          disabled={loading}
          variant="secondary"
        >
          {loading ? (
            <Spinner size={16} label="Analyzing..." />
          ) : (
            <>
              <Sparkles size={16} className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Refresh Recommendations
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Card className="flex flex-col items-center justify-center p-16">
          <Spinner size={36} label="Analyzing dataset and generating smart recommendations..." />
        </Card>
      ) : error && !recommendations ? (
        <Card className="p-6 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <p className="text-sm font-bold text-red-700 dark:text-red-300">
            Failed to load recommendations. The AI service may be temporarily unavailable.
          </p>
          <Button onClick={fetchRecommendations} variant="secondary" className="mt-3">
            Retry
          </Button>
        </Card>
      ) : recommendations ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Data Cleaning Actions */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="rounded-xl bg-amber-50 dark:bg-slate-800 p-2.5 text-amber-600 dark:text-amber-400">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Data Cleaning Advice</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recommended preprocessing steps</p>
              </div>
            </div>

            <ul className="space-y-3">
              {metadata.missing_values > 0 ? (
                <li className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200 bg-amber-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-amber-100 dark:border-slate-700">
                  <Lightbulb size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>Found <strong>{metadata.missing_values} missing values</strong>. Head to the Data Cleaning Studio to impute mean/median for numerical columns.</span>
                </li>
              ) : (
                <li className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200 bg-emerald-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-emerald-100 dark:border-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>No missing values detected. Dataset structure is clean!</span>
                </li>
              )}

              {metadata.duplicate_rows > 0 && (
                <li className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200 bg-red-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-red-100 dark:border-slate-700">
                  <Lightbulb size={16} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>Detected <strong>{metadata.duplicate_rows} duplicate rows</strong>. Purge duplicates to avoid bias.</span>
                </li>
              )}
            </ul>

            <Link to="/cleaning" className="inline-block mt-2">
              <Button size="sm" variant="secondary">Go to Cleaning Studio</Button>
            </Link>
          </Card>

          {/* Card 2: Recommended Charts */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="rounded-xl bg-blue-50 dark:bg-slate-800 p-2.5 text-blue-600 dark:text-blue-400">
                <BarChart2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Suggested Visualizations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Best chart choices for this dataset</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-3 bg-blue-50/50 dark:bg-slate-800/60 p-3 rounded-xl border border-blue-100 dark:border-slate-700">
                <Sparkles size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>Use a <strong>Histogram</strong> on numerical columns to observe value distributions and skewness.</span>
              </li>
              <li className="flex items-start gap-3 bg-blue-50/50 dark:bg-slate-800/60 p-3 rounded-xl border border-blue-100 dark:border-slate-700">
                <Sparkles size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>Generate a <strong>Correlation Heatmap</strong> to spot strong linear relationships between variables.</span>
              </li>
            </ul>

            <Link to="/visualization" className="inline-block mt-2">
              <Button size="sm" variant="secondary">Open Chart Engine</Button>
            </Link>
          </Card>

          {/* Card 3: Machine Learning Potential */}
          <Card className="p-6 space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="rounded-xl bg-purple-50 dark:bg-slate-800 p-2.5 text-purple-600 dark:text-purple-400">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Predictive Modeling Opportunities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recommended machine learning tasks</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs text-slate-700 dark:text-slate-200">
              <div className="p-4 rounded-xl border border-purple-100 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-800/50 space-y-1.5">
                <span className="font-bold text-purple-900 dark:text-purple-300 text-sm">Classification Task</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Select a categorical target column to train a Random Forest or Logistic Regression classifier.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-purple-100 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-800/50 space-y-1.5">
                <span className="font-bold text-purple-900 dark:text-purple-300 text-sm">Regression Task</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Select a numerical target column to train a Linear Regression or Random Forest Regressor.
                </p>
              </div>
            </div>

            <Link to="/machine-learning" className="inline-block mt-2">
              <Button variant="primary">Launch Machine Learning Studio</Button>
            </Link>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
