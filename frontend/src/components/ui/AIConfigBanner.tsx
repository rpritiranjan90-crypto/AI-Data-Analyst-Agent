import { useEffect, useState } from "react";
import { AlertCircle, ExternalLink, X, Sparkles } from "lucide-react";
import { getAIHealth, type AIProviderStatus } from "../../services/governanceService";

const DISMISS_KEY = "ai_config_banner_dismissed";

/**
 * AIConfigBanner
 * Shows a soft warning when the AI provider is unconfigured. Banner can be
 * dismissed for the current session via the X button.
 */
export default function AIConfigBanner() {
  const [status, setStatus] = useState<AIProviderStatus | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem(DISMISS_KEY) === "true";
  });

  useEffect(() => {
    let cancelled = false;
    getAIHealth()
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        // Soft-fail: banner simply doesn't render if governance endpoint is down
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed || !status || status.status === "available") return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-4 flex items-start gap-3 mb-6"
    >
      <Sparkles size={20} className="text-amber-600 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-2">
          <AlertCircle size={14} /> AI features require a provider key
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
          {status.message} Set <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">GEMINI_API_KEY</code> in
          <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded mx-1">backend/.env</code>
          to enable AI-powered analysis. All non-AI features (upload, cleaning, visualization, ML) work without a key.
        </p>
        <a
          href="https://github.com/personal/AI-Data-Analyst-Agent#quick-start-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline mt-2"
        >
          View Setup Guide <ExternalLink size={12} />
        </a>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss AI config banner"
        className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}
