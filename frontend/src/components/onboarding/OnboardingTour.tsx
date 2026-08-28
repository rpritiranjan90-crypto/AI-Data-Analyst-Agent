import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, ArrowLeft, Sparkles, Upload, BarChart2 } from "lucide-react";

const STORAGE_KEY = "ai_data_analyst_onboarding_complete";

interface TourStep {
  title: string;
  description: string;
  icon: typeof Sparkles;
  cta: { label: string; path: string } | null;
}

const STEPS: TourStep[] = [
  {
    title: "Welcome to AI Data Analyst Agent",
    description:
      "Upload a CSV, clean it, visualize it, and let AI explain the patterns — all without writing code. Let us show you around in three quick steps.",
    icon: Sparkles,
    cta: null,
  },
  {
    title: "Start with a dataset",
    description:
      "Click below to upload a CSV or Excel file. If you don't have one, the dashboard has a 'Load Demo Dataset' button to explore the platform instantly.",
    icon: Upload,
    cta: { label: "Go to Upload", path: "/upload" },
  },
  {
    title: "Explore the 7-step pipeline",
    description:
      "Once you have a dataset, work through Upload → Cleaning → Visualization → Analysis → ML → Reports. The Decision Center auto-generates AI suggestions based on your data.",
    icon: BarChart2,
    cta: { label: "Open Dashboard", path: "/dashboard" },
  },
];

/**
 * OnboardingTour — first-time user walkthrough.
 * Hidden by default after the user clicks Skip or finishes step 3.
 */
export default function OnboardingTour() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY) === "true";
    if (!done) setVisible(true);
  }, []);

  function handleFinish() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((s) => s + 1);
    } else {
      handleFinish();
    }
  }

  function handleCta() {
    const step = STEPS[stepIndex];
    if (step.cta) {
      handleFinish();
      navigate(step.cta.path);
    }
  }

  if (!visible) return null;

  const step = STEPS[stepIndex];
  const Icon = step.icon;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-indigo-200/40 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-8 shadow-2xl">
        <button
          onClick={handleFinish}
          aria-label="Close onboarding tour"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 inline-flex mb-5">
          <Icon size={28} className="text-white" />
        </div>

        <h2 id="onboarding-title" className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          {step.title}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all ${
                  idx === stepIndex
                    ? "w-8 bg-indigo-600"
                    : idx < stepIndex
                    ? "w-2 bg-indigo-300"
                    : "w-2 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex((s) => s - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <ArrowLeft size={14} className="inline mr-1" /> Back
              </button>
            )}
            <button
              onClick={step.cta ? handleCta : handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition"
            >
              {isLast ? "Get Started" : step.cta ? step.cta.label : "Next"}
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleFinish}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
