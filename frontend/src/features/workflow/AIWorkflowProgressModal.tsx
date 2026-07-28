import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, RefreshCw, Zap, LayoutDashboard, FileText, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Button from "../../components/ui/Button";

interface Step {
  id: number;
  label: string;
  status: "pending" | "running" | "completed";
}

interface AIWorkflowProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIWorkflowProgressModal({ isOpen, onClose }: AIWorkflowProgressModalProps) {
  const navigate = useNavigate();

  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: "Dataset & Schema Validation", status: "pending" },
    { id: 2, label: "Automated Data Cleaning & Outlier Removal", status: "pending" },
    { id: 3, label: "Descriptive Statistical Profiling", status: "pending" },
    { id: 4, label: "Exploratory Data Analysis (EDA)", status: "pending" },
    { id: 5, label: "35 Visualization Engine Selection", status: "pending" },
    { id: 6, label: "Pearson & Spearman Correlation Matrix", status: "pending" },
    { id: 7, label: "AutoML Model Recommendation", status: "pending" },
    { id: 8, label: "Isolation Forest Anomaly Detection", status: "pending" },
    { id: 9, label: "Executive AI Insights Generation", status: "pending" },
    { id: 10, label: "Temporal Trend & Time-Series Forecast", status: "pending" },
    { id: 11, label: "Executive Dashboard Layout Build", status: "pending" },
    { id: 12, label: "PowerPoint & PDF Slide Deck Compilation", status: "pending" },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      setSteps((prev) => prev.map((s) => ({ ...s, status: "pending" })));
      return;
    }

    let interval: ReturnType<typeof setInterval> | null = null;
    let idx = 0;

    setSteps((prev) =>
      prev.map((s, i) => ({
        ...s,
        status: i === 0 ? "running" : "pending",
      }))
    );

    interval = setInterval(() => {
      if (idx < steps.length - 1) {
        idx += 1;
        setCurrentStepIndex(idx);
        setSteps((prev) =>
          prev.map((s, i) => {
            if (i < idx) return { ...s, status: "completed" };
            if (i === idx) return { ...s, status: "running" };
            return { ...s, status: "pending" };
          })
        );
      } else {
        if (interval) clearInterval(interval);
        setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
        setIsFinished(true);
        toast.success("Autonomous AI Workflow Audit finished successfully!");
      }
    }, 450);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl overflow-hidden rounded-3xl border border-indigo-900/60 bg-slate-900 text-white shadow-2xl p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-600/30 p-3 text-indigo-400 border border-indigo-500/30">
                <Zap size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  Autonomous AI Workflow Agent
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Executing 12-Step Automated Analytics & ML Audit Pipeline
                </p>
              </div>
            </div>
            {isFinished && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                <ShieldCheck size={14} /> Audit Complete
              </span>
            )}
          </div>

          {/* Timeline Execution Steps */}
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2.5">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  step.status === "completed"
                    ? "bg-slate-950/60 border-emerald-900/50 text-emerald-300"
                    : step.status === "running"
                    ? "bg-indigo-950/60 border-indigo-500 text-indigo-200 animate-pulse"
                    : "bg-slate-950/30 border-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-[10px] font-mono text-slate-400">
                    {step.id < 10 ? `0${step.id}` : step.id}
                  </span>
                  <span>{step.label}</span>
                </div>

                <div>
                  {step.status === "completed" && (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  )}
                  {step.status === "running" && (
                    <RefreshCw size={15} className="animate-spin text-indigo-400" />
                  )}
                  {step.status === "pending" && (
                    <span className="w-2 h-2 rounded-full bg-slate-700 block" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Hub (Appears after completion) */}
          {isFinished ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-violet-900/40 to-slate-900 p-5 border border-indigo-700/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-300" /> Workflow Action Hub
                  </h4>
                  <p className="text-xs text-slate-300">
                    All reports, dashboards, and visualizations are compiled and ready.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  onClick={() => {
                    onClose();
                    navigate("/dashboard");
                  }}
                  variant="primary"
                  size="md"
                >
                  <LayoutDashboard size={16} /> Open Dashboard
                </Button>

                <Button
                  onClick={() => {
                    onClose();
                    navigate("/reports");
                  }}
                  variant="outline"
                  size="md"
                >
                  <FileText size={16} /> PowerPoint & PDF Exporters
                </Button>

                <Button
                  onClick={onClose}
                  variant="secondary"
                  size="md"
                >
                  Close Timeline
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-2">
              <span>Step {currentStepIndex + 1} of 12 running...</span>
              <span>Sub-second AI Processing</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
