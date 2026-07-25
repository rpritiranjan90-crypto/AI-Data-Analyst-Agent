import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Database,
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
import { useDatasetStore } from "../../store/datasetStore";
import { getAutoRecommendations } from "../../services/recommendationService";

export default function RecommendationPage() {
  const { dataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    if (metadata) {
      fetchRecommendations();
    }
  }, [metadata]);

  async function fetchRecommendations() {
    try {
      setLoading(true);
      const res = await getAutoRecommendations();
      setRecommendations(res);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to load recommendations");
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
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Database size={48} className="mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No Active Dataset</h3>
          <p className="mt-1 text-sm text-slate-500">
            Please upload a dataset first to generate recommendations.
          </p>
          <Link to="/upload" className="mt-6">
            <Button variant="primary">Upload Dataset</Button>
          </Link>
        </Card>
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
              <Sparkles size={16} className="mr-2 text-indigo-600" />
              Refresh Recommendations
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <Card className="flex flex-col items-center justify-center p-16">
          <Spinner size={36} label="Analyzing dataset and generating smart recommendations..." />
        </Card>
      ) : recommendations ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Data Cleaning Actions */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Data Cleaning Advice</h3>
                <p className="text-xs text-slate-500">Recommended preprocessing steps</p>
              </div>
            </div>

            <ul className="space-y-3">
              {metadata.missing_values > 0 ? (
                <li className="flex items-start gap-3 text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>Found <strong>{metadata.missing_values} missing values</strong>. Head to the Data Cleaning Studio to impute mean/median for numerical columns.</span>
                </li>
              ) : (
                <li className="flex items-start gap-3 text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>No missing values detected. Dataset structure is clean!</span>
                </li>
              )}

              {metadata.duplicate_rows > 0 && (
                <li className="flex items-start gap-3 text-xs text-slate-700 bg-red-50/60 p-3 rounded-xl border border-red-100">
                  <Lightbulb size={16} className="text-red-600 shrink-0 mt-0.5" />
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
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <BarChart2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Suggested Visualizations</h3>
                <p className="text-xs text-slate-500">Best chart choices for this dataset</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Use a <strong>Histogram</strong> on numerical columns to observe value distributions and skewness.</span>
              </li>
              <li className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Generate a <strong>Correlation Heatmap</strong> to spot strong linear relationships between variables.</span>
              </li>
            </ul>

            <Link to="/visualization" className="inline-block mt-2">
              <Button size="sm" variant="secondary">Open Chart Engine</Button>
            </Link>
          </Card>

          {/* Card 3: Machine Learning Potential */}
          <Card className="p-6 space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Predictive Modeling Opportunities</h3>
                <p className="text-xs text-slate-500">Recommended machine learning tasks</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs text-slate-700">
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1.5">
                <span className="font-bold text-purple-900 text-sm">Classification Task</span>
                <p className="text-slate-600">
                  Select a categorical target column to train a Random Forest or Logistic Regression classifier.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1.5">
                <span className="font-bold text-purple-900 text-sm">Regression Task</span>
                <p className="text-slate-600">
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
