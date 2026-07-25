import {
  BarChart3,
  BrainCircuit,
  Database,
  FileSpreadsheet,
  Home,
  Sparkles,
  Upload,
  Wand2,
  FileText,
  X,
  Layers,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDatasetStore } from "../../store/datasetStore";

const mainSection = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "Upload Dataset",
    icon: Upload,
    path: "/upload",
  },
  {
    name: "Data Analysis",
    icon: BarChart3,
    path: "/analysis",
  },
];

const analyticsSection = [
  {
    name: "Data Cleaning",
    icon: Wand2,
    path: "/cleaning",
  },
  {
    name: "Visualization",
    icon: Sparkles,
    path: "/visualization",
  },
  {
    name: "Recommendations",
    icon: Database,
    path: "/recommendation",
  },
  {
    name: "Machine Learning",
    icon: BrainCircuit,
    path: "/machine-learning",
  },
  {
    name: "Reports & AI",
    icon: FileText,
    path: "/reports",
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 dark:bg-slate-900/95 dark:border-slate-800/80 backdrop-blur-xl transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Header */}
      <div className="flex h-20 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-2.5 shadow-md shadow-indigo-500/25 border border-indigo-400/30">
            <FileSpreadsheet className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Analyst
            </h2>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Enterprise Data Platform
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4 custom-scrollbar">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Layers size={12} />
            <span>Platform Core</span>
          </div>
          <div className="space-y-1">
            {mainSection.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 translate-x-1"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Analytics & AI Section */}
        <div>
          <div className="px-3 mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Sparkles size={12} />
            <span>Analytics & AI Studios</span>
          </div>
          <div className="space-y-1">
            {analyticsSection.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 translate-x-1"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Active Dataset Footer Card */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Dataset
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                metadata ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </div>
          <p className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-slate-200">
            {metadata?.filename || "No Dataset Loaded"}
          </p>
          {metadata && (
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {metadata.rows.toLocaleString()} rows • {metadata.columns} cols
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}