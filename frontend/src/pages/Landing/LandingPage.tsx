import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Database, BarChart3, Cpu, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

export default function LandingPage() {
  const navigate = useNavigate();
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  function handleLaunch() {
    navigate("/dashboard");
  }

  function handleGuest() {
    setGuestMode(true);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Hero Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <Sparkles size={20} />
          </div>
          <span className="text-lg font-black tracking-tight">AI Data Analyst Agent</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-xs font-extrabold text-slate-300 hover:text-white transition"
          >
            Sign In
          </button>
          <Button onClick={handleLaunch} variant="primary" size="md">
            Launch App <ArrowRight size={15} />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-extrabold">
          <Zap size={14} className="text-amber-300 animate-pulse" /> Enterprise AI Analytics & AutoML Platform
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Turn Raw Datasets into Instant Executive Decisions & AutoML Models
        </h1>

        <p className="text-base text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
          Upload CSVs, connect live SQL databases (PostgreSQL, MySQL, SQLite, Snowflake), query using plain English natural language or voice, build 35 high-impact visual charts, and export PowerPoint slide decks in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button onClick={handleLaunch} variant="primary" size="lg">
            Start Free Trial <ArrowRight size={16} />
          </Button>

          <button
            onClick={handleGuest}
            className="px-6 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-extrabold transition flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400" /> Guest Preview Mode
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 py-16 max-w-screen-xl mx-auto border-t border-slate-800">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="rounded-xl bg-indigo-600/20 p-3 text-indigo-400 w-fit">
              <Database size={24} />
            </div>
            <h3 className="text-base font-extrabold text-white">Live SQL & Multi-File Importer</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Connect PostgreSQL, MySQL, SQLite, Snowflake, or upload CSV/Excel files with magic byte signature security.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="rounded-xl bg-indigo-600/20 p-3 text-indigo-400 w-fit">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-base font-extrabold text-white">35 Visualizations & AI Voice Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Recharts engine, heatmaps, box plots, and speech synthesis voice narration for hands-free analytics.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="rounded-xl bg-indigo-600/20 p-3 text-indigo-400 w-fit">
              <Cpu size={24} />
            </div>
            <h3 className="text-base font-extrabold text-white">AutoML & Anomaly Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Train Random Forest & XGBoost models with SHAP feature explainability and Isolation Forest radar detection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500 font-semibold">
        © {new Date().getFullYear()} AI Data Analyst Agent · Enterprise Platform
      </footer>
    </div>
  );
}
