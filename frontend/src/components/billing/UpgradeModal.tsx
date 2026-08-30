import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Sparkles, Crown } from "lucide-react";
import { startCheckout } from "../../api/billing";
import { toast } from "sonner";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string; // e.g. "AutoML is a Pro feature"
}

const PLAN_FEATURES: Record<"pro" | "enterprise", string[]> = {
  pro: [
    "100 MB file uploads",
    "AutoML training pipelines",
    "Anomaly detection",
    "Priority AI processing",
    "Voice input for AI chat",
    "Up to 10 team members",
  ],
  enterprise: [
    "Unlimited file size",
    "PowerPoint export",
    "Multi-file joiner",
    "AI multi-agent swarms",
    "Webhooks & alerts",
    "Unlimited team members",
    "Priority email support",
  ],
};

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<"pro" | "enterprise" | null>(null);

  const handleUpgrade = async (plan: "pro" | "enterprise") => {
    setLoadingPlan(plan);
    try {
      const url = await startCheckout(plan);
      window.location.href = url;
    } catch (err) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || (err as Error).message
        || "Failed to start checkout";
      toast.error(msg);
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close upgrade modal"
            >
              <X size={18} />
            </button>

            <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="text-indigo-600" />
                Upgrade to unlock more
              </h2>
              {reason && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{reason}</p>
              )}
            </div>

            <div className="p-8 grid sm:grid-cols-2 gap-4">
              {/* Pro plan */}
              <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-indigo-600" size={20} />
                  <h3 className="text-lg font-extrabold">Pro Analyst</h3>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  $29
                  <span className="text-sm font-medium text-slate-500"> / month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 flex-1">
                  {PLAN_FEATURES.pro.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade("pro")}
                  disabled={loadingPlan !== null}
                  className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 transition disabled:opacity-50"
                >
                  {loadingPlan === "pro" ? "Loading…" : "Upgrade to Pro"}
                </button>
              </div>

              {/* Enterprise plan */}
              <div className="rounded-2xl border-2 border-violet-300 dark:border-violet-700 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/30 dark:to-fuchsia-950/30 p-6 flex flex-col relative">
                <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-extrabold px-2 py-0.5">
                  MOST POPULAR
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-violet-600" size={20} />
                  <h3 className="text-lg font-extrabold">Enterprise SaaS</h3>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  $299
                  <span className="text-sm font-medium text-slate-500"> / month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 flex-1">
                  {PLAN_FEATURES.enterprise.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade("enterprise")}
                  disabled={loadingPlan !== null}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-2.5 transition disabled:opacity-50"
                >
                  {loadingPlan === "enterprise" ? "Loading…" : "Upgrade to Enterprise"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
