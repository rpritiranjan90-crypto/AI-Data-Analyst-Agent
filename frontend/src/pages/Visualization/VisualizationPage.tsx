import { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Zap,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import Skeleton from "../../components/ui/Skeleton";
import ExecutiveEmptyStateBanner from "../../components/ui/ExecutiveEmptyStateBanner";
import { useDatasetStore } from "../../store/datasetStore";
import {
  autoVisualize,
  generateChart,
  getChartImageUrl,
  getSupportedChartTypes,
} from "../../services/visualizationService";
import type { ChartType, Theme } from "../../types/api";

export default function VisualizationPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [supportedCharts, setSupportedCharts] = useState<string[]>([]);
  const [chartType, setChartType] = useState("histogram");
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("default");

  const [generating, setGenerating] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [generatedChartPath, setGeneratedChartPath] = useState<string | null>(null);
  const [autoCharts, setAutoCharts] = useState<string[]>([]);

  const columns = metadata?.column_names || [];

  useEffect(() => {
    fetchSupportedTypes();
    const cols = metadata?.column_names || [];
    if (cols.length > 0) {
      setXCol(cols[0]);
      setYCol(cols[1] || cols[0]);
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

  async function fetchSupportedTypes() {
    try {
      const res = await getSupportedChartTypes();
      if (res.supported_charts) {
        setSupportedCharts(res.supported_charts);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerateChart() {
    if (!xCol) return;
    try {
      setGenerating(true);
      const payload: { chart_type: ChartType; x_column: string; title: string; theme: Theme; y_column?: string } = {
        chart_type: chartType as ChartType,
        x_column: xCol,
        title: title || `${chartType.toUpperCase()} of ${xCol}`,
        theme: theme as Theme,
      };

      if (["scatter", "line", "bar", "box", "violin"].includes(chartType)) {
        payload.y_column = yCol;
      }

      const res = await generateChart(payload);
      if (res.chart_path || res.image_path || res.file_path || res.path) {
        const path = res.chart_path || res.image_path || res.file_path || res.path;
        setGeneratedChartPath(path as string);
        toast.success("Visualization generated!");
      } else {
        toast.success("Chart created!");
      }
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Chart generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleAutoVisualize() {
    try {
      setAutoGenerating(true);
      const res = await autoVisualize();
      toast.success("Auto visualizations created!");
      if (res.charts && Array.isArray(res.charts)) {
        setAutoCharts(res.charts);
      }
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      toast.error(detail || "Auto visualization failed");
    } finally {
      setAutoGenerating(false);
    }
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Visualization Studio"
          subtitle="Generate high-resolution professional charts, graphs, heatmaps, and distribution plots."
        />
        <ExecutiveEmptyStateBanner
          badgeText="Interactive Chart & Graphics Engine"
          title="Visualization Studio"
          subtitle="Render 19+ interactive chart types, correlation heatmaps, histograms, and violin plots with high-res PNG export."
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
          title="Visualization Studio"
          subtitle={`Interactive chart engine for: ${metadata.filename}`}
        />
        <Button
          onClick={handleAutoVisualize}
          disabled={autoGenerating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
        >
          {autoGenerating ? (
            <Spinner size={18} label="Generating charts..." />
          ) : (
            <>
              <Zap size={18} className="mr-2" />
              Auto Visualize Dataset
            </>
          )}
        </Button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls Panel (4 Cols) */}
        <Card className="lg:col-span-4 p-6 space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-blue-600 dark:text-blue-400" size={18} />
              Chart Controls
            </h3>
            <button
              onClick={() => {
                setTitle("");
                setChartType("histogram");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <Select
            label="Chart Type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            options={
              supportedCharts.length > 0
                ? supportedCharts.map((c) => ({ label: c.toUpperCase(), value: c }))
                : [
                    { label: "Histogram", value: "histogram" },
                    { label: "Bar Chart", value: "bar" },
                    { label: "Line Chart", value: "line" },
                    { label: "Scatter Plot", value: "scatter" },
                    { label: "Box Plot", value: "box" },
                    { label: "Violin Plot", value: "violin" },
                    { label: "Correlation Heatmap", value: "heatmap" },
                    { label: "Count Plot", value: "count" },
                    { label: "Pie Chart", value: "pie" },
                  ]
            }
          />

          <Select
            label="X-Axis / Primary Column"
            value={xCol}
            onChange={(e) => setXCol(e.target.value)}
            options={columns.map((c) => ({ label: c, value: c }))}
          />

          {["scatter", "line", "bar", "box", "violin"].includes(chartType) && (
            <Select
              label="Y-Axis / Target Column"
              value={yCol}
              onChange={(e) => setYCol(e.target.value)}
              options={columns.map((c) => ({ label: c, value: c }))}
            />
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Custom Chart Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sales vs Marketing Spend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <Select
            label="Visual Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            options={[
              { label: "Default Modern", value: "default" },
              { label: "Dark Executive", value: "dark" },
              { label: "Seaborn Muted", value: "seaborn" },
              { label: "GGPlot Classic", value: "ggplot" },
            ]}
          />

          <Button
            onClick={handleGenerateChart}
            disabled={generating}
            className="w-full mt-4"
          >
            {generating ? (
              <Spinner size={18} label="Generating Chart..." />
            ) : (
              "Render Visualization"
            )}
          </Button>
        </Card>

        {/* Display Canvas (8 Cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Rendered Output</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Preview and download generated visualization
                </p>
              </div>

              {generatedChartPath && (
                <a
                  href={getChartImageUrl(generatedChartPath)}
                  download="visualization.png"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                >
                  <Download size={14} /> Download PNG
                </a>
              )}
            </div>

            {generating ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4" aria-live="polite" aria-busy="true">
                <Spinner size={28} label="Rendering visualization..." />
                <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-6 space-y-4 shadow-inner">
                  {/* Skeleton chart canvas — axes */}
                  <div className="flex items-end justify-between gap-2 h-56">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        h={`h-${32 + ((i * 13) % 24)}`}
                        w="w-full"
                        rounded="md"
                      />
                    ))}
                  </div>
                  {/* Skeleton axis labels */}
                  <div className="flex justify-between">
                    <Skeleton h="h-2.5" w="w-24" />
                    <Skeleton h="h-2.5" w="w-16" />
                  </div>
                </div>
              </div>
            ) : generatedChartPath ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-4 overflow-hidden shadow-inner">
                <img
                  src={getChartImageUrl(generatedChartPath)}
                  alt="Generated Chart"
                  className="max-h-[550px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ImageIcon size={56} className="mb-4 text-slate-300 dark:text-slate-600" />
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Chart Rendered Yet</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Configure your variables on the left panel and click "Render Visualization" or click "Auto Visualize".
                </p>
              </div>
            )}
          </div>

          {/* Auto Generated Gallery */}
          {autoGenerating && autoCharts.length === 0 && (
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6" aria-live="polite" aria-busy="true">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Auto-Generated Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs"
                  >
                    <Skeleton h="h-32" w="w-full" rounded="md" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {autoCharts.length > 0 && (
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Auto-Generated Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {autoCharts.map((chartPath, idx) => (
                  <div
                    key={idx}
                    onClick={() => setGeneratedChartPath(chartPath)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setGeneratedChartPath(chartPath);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View auto-generated chart ${idx + 1}`}
                    className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img
                      src={getChartImageUrl(chartPath)}
                      alt={`Auto chart ${idx}`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
