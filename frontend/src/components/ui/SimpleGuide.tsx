/**
 * SimpleGuide — context-aware floating help widget.
 *
 * Appears as a persistent bottom-right button.
 * Clicking it opens a small panel that shows:
 *   1. "Where am I?" — current page name + one-line description
 *   2. "What should I do next?" — next action based on dataset state
 *   3. "Quick actions" — 1–2 one-click buttons
 *   4. "Tip of the day" — rotating tip relevant to the current page
 *
 * Zero backend dependency. Purely frontend.
 */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageCircle,
  X,
  ChevronRight,
  Zap,
  Upload,
  BarChart3,
  Wand2,
  FileText,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { useDatasetStore } from "../../store/datasetStore";
import { useAuthStore } from "../../store/authStore";

/* ── Page context definitions ─────────────────────────── */
const PAGE_CONTEXT: Record<string, { label: string; description: string }> = {
  "/dashboard": {
    label: "Dashboard",
    description: "Overview of your data, AI insights, and quick actions.",
  },
  "/upload": {
    label: "Upload Data",
    description: "Upload a CSV or Excel file to start analyzing.",
  },
  "/analysis": {
    label: "Analyze Data",
    description: "Explore statistics, correlations, and patterns.",
  },
  "/cleaning": {
    label: "Clean Data",
    description: "Fix missing values, remove duplicates, and outliers.",
  },
  "/visualization": {
    label: "Visualize",
    description: "Create charts and graphs from your data.",
  },
  "/machine-learning": {
    label: "ML Models",
    description: "Train models to predict outcomes and detect anomalies.",
  },
  "/decision-center": {
    label: "Decision Center",
    description: "AI-powered business decisions ranked by ROI.",
  },
  "/reports": {
    label: "Reports",
    description: "Generate and download PDF or PowerPoint reports.",
  },
  "/governance": {
    label: "AI Insights & Cost",
    description: "Track AI usage, costs, and governance policies.",
  },
  "/pricing": {
    label: "Pricing",
    description: "Compare plans and upgrade your workspace.",
  },
  "/help": {
    label: "Help",
    description: "Documentation and support for all features.",
  },
  "/settings/workspace": {
    label: "Workspace Settings",
    description: "Manage your workspace, members, and billing.",
  },
  "/settings/usage": {
    label: "Usage",
    description: "View your plan limits and usage this period.",
  },
  "/settings/gdpr": {
    label: "Privacy & Data",
    description: "Export or delete your data. GDPR compliance tools.",
  },
  "/knowledge": {
    label: "Ask AI",
    description: "Ask questions about your data in plain English.",
  },
  "/simulator": {
    label: "What-If Simulator",
    description: "Test scenarios and see their predicted impact.",
  },
  "/data-fabric": {
    label: "Data Fabric",
    description: "Catalog and manage all your datasets.",
  },
  "/readiness": {
    label: "Production Readiness",
    description: "Check if your data and models are production-ready.",
  },
};

/* ── Tips by section ─────────────────────────────────── */
const TIPS_BY_SECTION: Record<string, string[]> = {
  default: [
    "Upload a CSV or Excel file to start analyzing your data.",
    "Use the 'Load Demo Dataset' button to explore without uploading.",
    "Your data never leaves your browser during analysis.",
    "Hover over any chart to see detailed values.",
    "You can switch between workspaces using the dropdown in the top bar.",
  ],
  "/dashboard": [
    "The 'Load Demo Dataset' button lets you explore without uploading.",
    "AI insights appear automatically once you have a dataset.",
    "The Decision Center shows the highest-ROI recommendations first.",
  ],
  "/upload": [
    "Supported formats: CSV, XLSX, XLS — up to your plan limit.",
    "Larger files (>50MB) are processed with priority on Pro plans.",
    "Your file is processed locally; raw data is not stored on servers.",
  ],
  "/analysis": [
    "Start with the Overview tab to understand your data at a glance.",
    "Use the Distribution tab to find outliers and skewness.",
    "The Correlation tab reveals which columns are related.",
    "AI Insights auto-generates when you open this page.",
  ],
  "/cleaning": [
    "Apply suggestions one by one, or 'Apply All' for quick fixes.",
    "Each change is logged in your audit trail.",
    "Missing values can be filled with mean, median, or a custom value.",
  ],
  "/visualization": [
    "Pick a chart type based on what you want to show — comparison, trend, or distribution.",
    "Export charts as PNG, SVG, or embed them in a PDF report.",
    "Hover over any chart element to see the exact value.",
  ],
  "/machine-learning": [
    "Start with 'AutoML' to let the platform choose the best model.",
    "Use Anomaly Detection to find unusual patterns in your data.",
    "Classification predicts categories; regression predicts numbers.",
  ],
  "/reports": [
    "Reports include AI-generated insights and all your charts.",
    "Download as PDF for stakeholders or PowerPoint for presentations.",
    "AI-generated reports update automatically when your data changes.",
  ],
};

/* ── Next-action logic ───────────────────────────────── */
function getNextAction(hasDataset: boolean, path: string): {
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
} | null {
  if (!hasDataset) {
    return {
      label: "Upload a dataset",
      description: "Start by uploading your data.",
      icon: Upload,
      path: "/upload",
    };
  }
  if (path === "/upload") {
    return {
      label: "Analyze your data",
      description: "See patterns, stats, and AI insights.",
      icon: BarChart3,
      path: "/analysis",
    };
  }
  if (path === "/analysis" || path === "/cleaning") {
    return {
      label: "Create a visualization",
      description: "Turn your findings into charts.",
      icon: Wand2,
      path: "/visualization",
    };
  }
  if (path === "/visualization") {
    return {
      label: "Generate a report",
      description: "Export insights as a PDF or slides.",
      icon: FileText,
      path: "/reports",
    };
  }
  return null;
}

export default function SimpleGuide() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dataset } = useDatasetStore();
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const path = location.pathname;
  const hasDataset = !!dataset?.metadata;

  const context = PAGE_CONTEXT[path] ?? {
    label: "AIFlow",
    description: "Your AI-powered data analyst.",
  };

  const tips = TIPS_BY_SECTION[path] ?? TIPS_BY_SECTION.default;
  const currentTip = tips[tipIndex % tips.length];
  const nextAction = getNextAction(hasDataset, path);

  // Rotate tips every 20 seconds
  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => i + 1), 20_000);
    return () => clearInterval(id);
  }, []);

  // Reset tip index on route change
  useEffect(() => {
    setTipIndex(0);
  }, [path]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open help guide"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">{open ? "Close" : "Help"}</span>
      </button>

      {/* ── Guide panel ── */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-indigo-200" />
              <span className="text-white font-bold text-sm">SimpleGuide</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-indigo-200 hover:text-white transition"
              aria-label="Close guide"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Where am I? */}
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Where am I?</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{context.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{context.description}</p>
            </div>

            {/* What should I do next? */}
            {nextAction && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                  What should I do next?
                </p>
                <button
                  onClick={() => {
                    navigate(nextAction.path);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3 py-2.5 text-left transition"
                >
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900 p-1.5">
                    <nextAction.icon size={14} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{nextAction.label}</p>
                    <p className="text-[10px] text-slate-500">{nextAction.description}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Quick Actions</p>
              <div className="flex gap-2">
                {!hasDataset && (
                  <button
                    onClick={() => {
                      navigate("/upload");
                      setOpen(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold transition"
                  >
                    <Upload size={12} /> Upload
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold transition"
                >
                  <BarChart3 size={12} /> Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/help");
                    setOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold transition"
                >
                  <Lightbulb size={12} /> Docs
                </button>
                <button
                  onClick={() => {
                    navigate("/pricing");
                    setOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-3 py-1.5 text-xs font-semibold transition"
                >
                  <Zap size={12} /> Upgrade
                </button>
              </div>
            </div>

            {/* Tip of the day */}
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Lightbulb size={12} className="text-amber-500" />
                <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  Tip of the day
                </p>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{currentTip}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
