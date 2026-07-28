import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, UploadCloud, BarChart3, Sparkles, Sliders, Cpu, FileText, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRunWorkflow?: () => void;
}

export default function CommandPalette({ isOpen, onClose, onRunWorkflow }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setSearch("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "run-workflow",
      label: "Run Autonomous AI Workflow Audit",
      category: "AI Actions",
      icon: Zap,
      action: () => {
        onClose();
        if (onRunWorkflow) onRunWorkflow();
      },
    },
    {
      id: "nav-dashboard",
      label: "Go to Executive Dashboard",
      category: "Navigation",
      icon: LayoutDashboard,
      action: () => {
        onClose();
        navigate("/dashboard");
      },
    },
    {
      id: "nav-upload",
      label: "Importer & Live SQL Connectors",
      category: "Navigation",
      icon: UploadCloud,
      action: () => {
        onClose();
        navigate("/upload");
      },
    },
    {
      id: "nav-analysis",
      label: "Analysis Studio (7 Tabs)",
      category: "Navigation",
      icon: BarChart3,
      action: () => {
        onClose();
        navigate("/analysis");
      },
    },
    {
      id: "nav-cleaning",
      label: "Automated Data Cleaning Studio",
      category: "Navigation",
      icon: Sliders,
      action: () => {
        onClose();
        navigate("/cleaning");
      },
    },
    {
      id: "nav-visualization",
      label: "35 High-Impact Visualizations",
      category: "Navigation",
      icon: Sparkles,
      action: () => {
        onClose();
        navigate("/visualization");
      },
    },
    {
      id: "nav-ml",
      label: "AutoML & Anomaly Radar",
      category: "Navigation",
      icon: Cpu,
      action: () => {
        onClose();
        navigate("/machine-learning");
      },
    },
    {
      id: "nav-reports",
      label: "Executive Report & Deck Exporters",
      category: "Navigation",
      icon: FileText,
      action: () => {
        onClose();
        navigate("/reports");
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        >
          {/* Header Input */}
          <div className="relative flex items-center border-b border-slate-800 px-4 py-3">
            <Search size={18} className="text-indigo-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search... (Press ESC to exit)"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400 outline-none"
            />
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-400">
                No matching commands found.
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between rounded-xl p-3 text-left transition hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800 p-2 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-white">{item.label}</div>
                        <div className="text-[10px] font-semibold text-slate-400">{item.category}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-300">
                      Press ↵
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-2 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">Ctrl</kbd> + <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">K</kbd> to open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">ESC</kbd> to close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
