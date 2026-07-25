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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDatasetStore } from "../../store/datasetStore";

const menu = [
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
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Header */}
      <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 shadow-md shadow-blue-500/20">
            <FileSpreadsheet className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              AI Analyst
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Data Platform
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Active Dataset Footer Card */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Dataset
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                metadata ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
              }`}
            />
          </div>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">
            {metadata?.filename || "No Dataset Loaded"}
          </p>
          {metadata && (
            <p className="mt-0.5 text-xs text-slate-500">
              {metadata.rows.toLocaleString()} rows • {metadata.columns} cols
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}