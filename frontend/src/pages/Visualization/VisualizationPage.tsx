import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Zap,
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
  autoVisualize,
  generateChart,
  getChartImageUrl,
  getSupportedChartTypes,
} from "../../services/visualizationService";

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
    if (columns.length > 0) {
      setXCol(columns[0]);
      setYCol(columns[1] || columns[0]);
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
      const payload: any = {
        chart_type: chartType,
        column: xCol,
        x_column: xCol,
        title: title || `${chartType.toUpperCase()} of ${xCol}`,
        theme,
      };

      if (["scatter", "line", "bar", "box", "violin"].includes(chartType)) {
        payload.y_column = yCol;
      }

      const res = await generateChart(payload);
      if (res.chart_path || res.image_path || res.file_path || res.path) {
        const path = res.chart_path || res.image_path || res.file_path || res.path;
        setGeneratedChartPath(path);
        toast.success("Visualization generated!");
      } else {
        toast.success("Chart created!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Chart generation failed");
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
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Auto visualization failed");
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
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-500 mb-4 border border-blue-500/20">
            <Sparkles size={42} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Active Dataset</h3>
          <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-md">
            Please upload a CSV or Excel dataset to render 19+ interactive chart types, histograms, and heatmaps.
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
            <Spinner size={18} label="Rendering..." />
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
              <div className="flex flex-col items-center justify-center py-24">
                <Spinner size={36} label="Creating visualization..." />
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
          {autoCharts.length > 0 && (
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Auto-Generated Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {autoCharts.map((chartPath, idx) => (
                  <div
                    key={idx}
                    onClick={() => setGeneratedChartPath(chartPath)}
                    className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition shadow-xs"
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
