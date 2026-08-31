import { useState, useEffect } from "react";
import {
  Trash2,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import ExecutiveEmptyStateBanner from "../../components/ui/ExecutiveEmptyStateBanner";
import { useDatasetStore } from "../../store/datasetStore";
import {
  autoCleanDataset,
  convertDatatype,
  fillMissingValues,
  getDatasetQuality,
  removeDuplicates,
  removeIqROutliers,
  removeZScoreOutliers,
} from "../../services/cleaningService";

interface QualityData {
  quality_score?: number;
  // Backend may surface other fields; keep them loosely typed.
  [key: string]: unknown;
}

export default function CleaningPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [qualityData, setQualityData] = useState<QualityData | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Form States
  const [missingCol, setMissingCol] = useState("");
  const [missingMethod, setMissingMethod] = useState("mean");
  const [missingValue, setMissingValue] = useState("");

  const [outlierCol, setOutlierCol] = useState("");
  const [outlierMethod, setOutlierMethod] = useState("iqr");
  const [zThreshold, setZThreshold] = useState("3.0");

  const [dtypeCol, setDtypeCol] = useState("");
  const [targetDtype, setTargetDtype] = useState("int64");

  const columns = metadata?.column_names || [];

  useEffect(() => {
    if (metadata) {
      fetchQuality();
      const cols = metadata.column_names || [];
      if (cols.length > 0) {
        setMissingCol(cols[0]);
        setOutlierCol(cols[0]);
        setDtypeCol(cols[0]);
      }
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

  async function fetchQuality() {
    try {
      const res = await getDatasetQuality();
      setQualityData(res);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAutoClean() {
    try {
      setActiveAction("autoclean");
      const res = await autoCleanDataset();
      toast.success(res.message || "Dataset automatically cleaned!");
      fetchQuality();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Auto cleaning failed");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleFillMissing() {
    if (!missingCol) return;
    try {
      setActiveAction("missing");
      const res = await fillMissingValues(missingCol, missingMethod, missingValue);
      toast.success(res.message || `Missing values filled for ${missingCol}`);
      fetchQuality();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Failed to fill missing values");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleRemoveDuplicates() {
    try {
      setActiveAction("duplicates");
      const res = await removeDuplicates();
      toast.success(res.message || "Duplicate rows removed");
      fetchQuality();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Failed to remove duplicates");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleRemoveOutliers() {
    if (!outlierCol) return;
    try {
      setActiveAction("outliers");
      let res;
      if (outlierMethod === "iqr") {
        res = await removeIqROutliers(outlierCol);
      } else {
        res = await removeZScoreOutliers(outlierCol, parseFloat(zThreshold) || 3.0);
      }
      toast.success(res.message || `Outliers removed from ${outlierCol}`);
      fetchQuality();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Failed to remove outliers");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleConvertDtype() {
    if (!dtypeCol) return;
    try {
      setActiveAction("dtype");
      const res = await convertDatatype(dtypeCol, targetDtype);
      toast.success(res.message || `Converted ${dtypeCol} to ${targetDtype}`);
      fetchQuality();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Failed to convert datatype");
    } finally {
      setActiveAction(null);
    }
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Data Cleaning Studio"
          subtitle="Clean missing values, handle outliers, drop duplicates, and optimize dataset data types."
        />
        <ExecutiveEmptyStateBanner
          badgeText="Data Quality & Preprocessing Studio"
          title="Data Cleaning Studio"
          subtitle="Automated 1-Click data cleaning, missing value imputation, outlier detection, and duplicate purging."
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
          title="Data Cleaning Studio"
          subtitle={`Clean dataset: ${metadata.filename} (${metadata.rows.toLocaleString()} rows)`}
        />
        <Button
          onClick={handleAutoClean}
          disabled={activeAction !== null}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20"
        >
          {activeAction === "autoclean" ? (
            <Spinner size={18} label="Cleaning..." />
          ) : (
            <>
              <Zap size={18} className="mr-2" />
              1-Click Auto Clean
            </>
          )}
        </Button>
      </div>

      {/* Dataset Quality & Quick Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-800 dark:to-slate-900 border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Quality Rating
            </span>
            <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {qualityData?.quality_score ?? 95}%
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Overall Dataset Health</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Missing Values
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {(metadata.missing_values ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Across all columns</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Duplicates
            </span>
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {(metadata.duplicate_rows ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Duplicate rows found</p>
          </div>
        </Card>
      </div>

      {/* Cleaning Tools Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Missing Values Handler */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="rounded-xl bg-amber-50 dark:bg-slate-800 p-2.5 text-amber-600 dark:text-amber-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Missing Values Handler</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fill or impute missing data</p>
            </div>
          </div>

          <div className="space-y-3">
            <Select
              label="Select Column"
              value={missingCol}
              onChange={(e) => setMissingCol(e.target.value)}
              options={columns.map((c) => ({ label: c, value: c }))}
            />

            <Select
              label="Imputation Method"
              value={missingMethod}
              onChange={(e) => setMissingMethod(e.target.value)}
              options={[
                { label: "Mean (Numeric)", value: "mean" },
                { label: "Median (Numeric)", value: "median" },
                { label: "Mode (Most Frequent)", value: "mode" },
                { label: "Constant Value", value: "constant" },
                { label: "Forward Fill (ffill)", value: "ffill" },
                { label: "Backward Fill (bfill)", value: "bfill" },
                { label: "Drop Rows with Missing", value: "drop" },
              ]}
            />

            {missingMethod === "constant" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Constant Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unknown or 0"
                  value={missingValue}
                  onChange={(e) => setMissingValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            )}

            <Button
              onClick={handleFillMissing}
              disabled={activeAction !== null}
              className="w-full mt-2"
            >
              {activeAction === "missing" ? (
                <Spinner size={16} label="Imputing..." />
              ) : (
                "Apply Missing Value Imputation"
              )}
            </Button>
          </div>
        </Card>

        {/* 2. Outliers Handler */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="rounded-xl bg-blue-50 dark:bg-slate-800 p-2.5 text-blue-600 dark:text-blue-400">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Outlier Detection & Removal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Filter numerical extremes</p>
            </div>
          </div>

          <div className="space-y-3">
            <Select
              label="Select Column"
              value={outlierCol}
              onChange={(e) => setOutlierCol(e.target.value)}
              options={columns.map((c) => ({ label: c, value: c }))}
            />

            <Select
              label="Detection Strategy"
              value={outlierMethod}
              onChange={(e) => setOutlierMethod(e.target.value)}
              options={[
                { label: "IQR (Interquartile Range 1.5x)", value: "iqr" },
                { label: "Z-Score Threshold", value: "zscore" },
              ]}
            />

            {outlierMethod === "zscore" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Z-Score Threshold (default: 3.0)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={zThreshold}
                  onChange={(e) => setZThreshold(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            )}

            <Button
              onClick={handleRemoveOutliers}
              disabled={activeAction !== null}
              variant="secondary"
              className="w-full mt-2"
            >
              {activeAction === "outliers" ? (
                <Spinner size={16} label="Filtering..." />
              ) : (
                "Remove Outliers"
              )}
            </Button>
          </div>
        </Card>

        {/* 3. Duplicate Removal */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="rounded-xl bg-red-50 dark:bg-slate-800 p-2.5 text-red-600 dark:text-red-400">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Duplicate Records</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Drop identical dataset rows</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Identifies and removes exact duplicate rows across all columns.
          </p>

          <Button
            onClick={handleRemoveDuplicates}
            disabled={activeAction !== null}
            variant="danger"
            className="w-full"
          >
            {activeAction === "duplicates" ? (
              <Spinner size={16} label="Removing..." />
            ) : (
              "Purge All Duplicate Rows"
            )}
          </Button>
        </Card>

        {/* 4. Type Converter */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="rounded-xl bg-purple-50 dark:bg-slate-800 p-2.5 text-purple-600 dark:text-purple-400">
              <RefreshCw size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Datatype Converter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Convert column data types</p>
            </div>
          </div>

          <div className="space-y-3">
            <Select
              label="Select Column"
              value={dtypeCol}
              onChange={(e) => setDtypeCol(e.target.value)}
              options={columns.map((c) => ({ label: c, value: c }))}
            />

            <Select
              label="Target Type"
              value={targetDtype}
              onChange={(e) => setTargetDtype(e.target.value)}
              options={[
                { label: "Integer (int64)", value: "int64" },
                { label: "Float (float64)", value: "float64" },
                { label: "String / Object (category)", value: "object" },
                { label: "DateTime (datetime64)", value: "datetime64" },
                { label: "Boolean (bool)", value: "bool" },
              ]}
            />

            <Button
              onClick={handleConvertDtype}
              disabled={activeAction !== null}
              variant="secondary"
              className="w-full mt-2"
            >
              {activeAction === "dtype" ? (
                <Spinner size={16} label="Converting..." />
              ) : (
                "Convert Datatype"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
