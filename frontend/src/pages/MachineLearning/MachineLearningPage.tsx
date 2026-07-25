import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Cpu,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import { useDatasetStore } from "../../store/datasetStore";
import {
  getAvailableModels,
  getMLTrainingSummary,
  trainModel,
} from "../../services/mlService";

export default function MachineLearningPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [targetCol, setTargetCol] = useState("");
  const [algorithm, setAlgorithm] = useState("random_forest");
  const [testSize, setTestSize] = useState(0.2);
  const [randomState, setRandomState] = useState(42);

  const [training, setTraining] = useState(false);
  const [trainingResults, setTrainingResults] = useState<any>(null);

  const columns = metadata?.column_names || [];

  useEffect(() => {
    fetchModels();
    fetchSummary();
    if (columns.length > 0) {
      setTargetCol(columns[columns.length - 1]);
    }
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

  async function fetchModels() {
    try {
      await getAvailableModels();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSummary() {
    try {
      const res = await getMLTrainingSummary();
      if (res && res.metrics) {
        setTrainingResults(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTrain() {
    if (!targetCol) return;
    try {
      setTraining(true);
      const res = await trainModel({
        target: targetCol,
        algorithm,
        test_size: Number(testSize),
        random_state: Number(randomState),
      });
      setTrainingResults(res);
      toast.success("ML Model trained successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "ML Training failed");
    } finally {
      setTraining(false);
    }
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Machine Learning Studio"
          subtitle="Train classification and regression models, evaluate performance metrics, and predict outcomes."
        />
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-500 mb-4 border border-purple-500/20">
            <BrainCircuit size={42} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Active Dataset</h3>
          <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-md">
            Please upload a CSV or Excel dataset to train Random Forest, XGBoost, or Logistic Regression models.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/upload">
              <Button variant="primary">Upload Dataset</Button>
            </Link>
            <Button variant="secondary" onClick={loadDemoDataset} className="flex items-center gap-2">
              <PlayCircle size={16} /> Load Demo Dataset
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Machine Learning Studio"
        subtitle={`Automated ML Pipeline for: ${metadata.filename}`}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Training Parameters Controls (4 Cols) */}
        <Card className="lg:col-span-4 p-6 space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="text-purple-600 dark:text-purple-400" size={18} />
              Pipeline Controls
            </h3>
            <button
              onClick={() => {
                setTestSize(0.2);
                setRandomState(42);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <Select
            label="Target Column (Prediction Goal)"
            value={targetCol}
            onChange={(e) => setTargetCol(e.target.value)}
            options={columns.map((c) => ({ label: c, value: c }))}
          />

          <Select
            label="Machine Learning Algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            options={[
              { label: "Random Forest Classifier / Regressor", value: "random_forest" },
              { label: "Linear / Logistic Regression", value: "linear_regression" },
              { label: "Decision Tree", value: "decision_tree" },
              { label: "Gradient Boosting", value: "gradient_boosting" },
              { label: "K-Nearest Neighbors (KNN)", value: "knn" },
              { label: "Support Vector Machine (SVM)", value: "svm" },
            ]}
          />

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Test Split Ratio</span>
              <span>{Math.round(testSize * 100)}% Test / {Math.round((1 - testSize) * 100)}% Train</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={testSize}
              onChange={(e) => setTestSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Random Seed
            </label>
            <input
              type="number"
              value={randomState}
              onChange={(e) => setRandomState(parseInt(e.target.value) || 42)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <Button
            onClick={handleTrain}
            disabled={training}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20"
          >
            {training ? (
              <Spinner size={18} label="Training ML Model..." />
            ) : (
              <>
                <Play size={16} className="mr-2 fill-current" />
                Train ML Model
              </>
            )}
          </Button>
        </Card>

        {/* Results & Metrics Panel (8 Cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Model Performance & Metrics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Evaluation results from cross-validated train-test split
                </p>
              </div>

              {trainingResults && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={14} /> Trained
                </span>
              )}
            </div>

            {training ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Spinner size={40} label="Building pipeline, splitting data & training model..." />
              </div>
            ) : trainingResults ? (
              <div className="space-y-6">
                {/* Model Overview Summary Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      Algorithm
                    </span>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white capitalize">
                      {trainingResults.algorithm || algorithm}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Primary Score
                    </span>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                      {trainingResults.metrics?.accuracy !== undefined
                        ? `${(trainingResults.metrics.accuracy * 100).toFixed(1)}%`
                        : trainingResults.metrics?.r2_score !== undefined
                        ? (trainingResults.metrics.r2_score).toFixed(3)
                        : "N/A"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {trainingResults.metrics?.accuracy !== undefined ? "Accuracy Score" : "R² Score"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      Target Variable
                    </span>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      {trainingResults.target || targetCol}
                    </p>
                  </div>
                </div>

                {/* Detailed Metrics Table / Breakdown */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-6 space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Sliders size={16} className="text-purple-600 dark:text-purple-400" />
                    Metrics Breakdown
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    {Object.entries(trainingResults.metrics || {}).map(([key, val]: [string, any]) => (
                      <div key={key} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wide">
                          {key.replace(/_/g, " ")}
                        </span>
                        <p className="mt-1 font-bold text-slate-900 dark:text-white text-base">
                          {typeof val === "number" ? val.toFixed(4) : String(val)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <BrainCircuit size={56} className="mb-4 text-slate-300 dark:text-slate-600" />
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">Model Not Trained Yet</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Select your target prediction column and click "Train ML Model" to execute the pipeline.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
