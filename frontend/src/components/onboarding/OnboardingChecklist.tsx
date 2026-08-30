import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, X, Loader2, Rocket, Upload, BarChart3, LineChart, Brain, FileText, UserPlus, Crown } from "lucide-react";
import { toast } from "sonner";
import { getOnboarding, markOnboardingStep, type OnboardingStep } from "../../api/phase2";
import { useAuthStore } from "../../store/authStore";

const ICON_MAP: Record<string, React.ReactNode> = {
  upload_dataset: <Upload size={18} />,
  run_analysis: <BarChart3 size={18} />,
  create_chart: <LineChart size={18} />,
  train_model: <Brain size={18} />,
  generate_report: <FileText size={18} />,
  invite_team: <UserPlus size={18} />,
  upgrade_plan: <Crown size={18} />,
};

export default function OnboardingChecklist({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const { activeWorkspace, isAuthenticated } = useAuthStore();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, progress_pct: 0 });
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("onboarding_dismissed") === "true";
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getOnboarding()
      .then((data) => {
        setSteps(data.steps);
        setProgress({ total: data.total, completed: data.completed, progress_pct: data.progress_pct });
      })
      .catch(() => toast.error("Failed to load onboarding"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, activeWorkspace?.id]);

  const handleStepClick = async (step: OnboardingStep) => {
    if (step.completed) return;
    if (step.id === "upgrade_plan") {
      navigate("/pricing");
      return;
    }
    // Navigate to the right page based on step
    const routes: Record<string, string> = {
      upload_dataset: "/upload",
      run_analysis: "/dashboard",
      create_chart: "/visualization",
      train_model: "/ml",
      generate_report: "/reports",
      invite_team: "/settings/workspace",
    };
    navigate(routes[step.id] || "/dashboard");
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("onboarding_dismissed", "true");
    onClose?.();
  };

  if (dismissed) return null;
  if (loading) return null;
  if (progress.total === 0) return null;
  if (progress.completed === progress.total) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/40 p-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition"
        title="Dismiss"
      >
        <X size={16} className="text-slate-400" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-900">
          <Rocket size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Get Started with {activeWorkspace?.name || "your workspace"}
          </h3>
          <p className="text-xs text-slate-500">
            {progress.completed} of {progress.total} steps complete
          </p>
        </div>
      </div>

      <div className="w-full h-1.5 bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progress.progress_pct}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {steps.slice(0, 5).map((step) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(step)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
              step.completed
                ? "bg-white/40 dark:bg-slate-900/40"
                : "bg-white dark:bg-slate-900 hover:shadow-md"
            }`}
          >
            <div className={step.completed ? "text-emerald-500" : "text-slate-300"}>
              {step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>
            <div
              className={`p-1.5 rounded-lg ${
                step.completed
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
              }`}
            >
              {ICON_MAP[step.id] || <Rocket size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-bold ${
                  step.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-slate-500 truncate">{step.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
