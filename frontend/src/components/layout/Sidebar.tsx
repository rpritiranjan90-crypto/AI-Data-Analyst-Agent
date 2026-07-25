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
  CreditCard,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDatasetStore } from "../../store/datasetStore";

const mainSection = [
  { name: "Dashboard",     icon: Home,          path: "/dashboard" },
  { name: "Upload Dataset",icon: Upload,         path: "/upload" },
  { name: "Data Analysis", icon: BarChart3,      path: "/analysis" },
];

const analyticsSection = [
  { name: "Data Cleaning",    icon: Wand2,        path: "/cleaning" },
  { name: "Visualization",    icon: Sparkles,     path: "/visualization" },
  { name: "Recommendations",  icon: Database,     path: "/recommendation" },
  { name: "Machine Learning", icon: BrainCircuit, path: "/machine-learning" },
  { name: "Reports & AI",     icon: FileText,     path: "/reports" },
  { name: "Pricing & Plans",  icon: CreditCard,   path: "/pricing" },
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
      className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col
        border-r border-slate-200/70 dark:border-slate-800/70
        bg-white/97 dark:bg-slate-950/97
        backdrop-blur-xl
        transition-all duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl shadow-slate-900/10 md:shadow-none" : "-translate-x-full"}`}
    >
      {/* ── LOGO HEADER ── */}
      <div className="relative flex h-[68px] items-center justify-between border-b border-slate-100/80 dark:border-slate-800/70 px-5">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-600/60 via-indigo-500/60 to-violet-500/40 rounded-t-none" />

        <div className="flex items-center gap-3">
          <div className="relative rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-2.5 shadow-md shadow-indigo-500/30 border border-indigo-300/20">
            <FileSpreadsheet className="text-white" size={20} />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 pulse-glow" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              AI Analyst
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
              Enterprise Platform
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-150 md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Platform Core */}
        <div>
          <div className="flex items-center gap-1.5 px-2 mb-2">
            <Layers size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.10em] text-slate-400 dark:text-slate-500">
              Platform Core
            </span>
          </div>
          <div className="space-y-0.5">
            {mainSection.map((item) => (
              <SideNavLink key={item.path} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-slate-100 dark:border-slate-800/70" />
          </div>
        </div>

        {/* Analytics & Enterprise */}
        <div>
          <div className="flex items-center gap-1.5 px-2 mb-2">
            <Sparkles size={10} className="text-indigo-400" />
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.10em] text-slate-400 dark:text-slate-500">
              Analytics & Enterprise
            </span>
          </div>
          <div className="space-y-0.5">
            {analyticsSection.map((item) => (
              <SideNavLink key={item.path} item={item} onClose={onClose} />
            ))}
          </div>
        </div>
      </nav>

      {/* ── ACTIVE DATASET FOOTER ── */}
      <div className="border-t border-slate-100 dark:border-slate-800/70 p-4">
        <div
          className={`rounded-2xl border p-3.5 transition-all duration-300 ${
            metadata
              ? "border-emerald-200/70 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-950/30 dark:to-slate-800/60"
              : "border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className={metadata ? "text-emerald-500" : "text-slate-400"} />
              <span className="text-[9.5px] font-extrabold uppercase tracking-[0.10em] text-slate-400 dark:text-slate-500">
                Active Dataset
              </span>
            </div>
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                metadata
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50 pulse-glow"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </div>
          <p className={`truncate text-xs font-bold leading-tight ${
            metadata ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
          }`}>
            {metadata?.filename || "No Dataset Loaded"}
          </p>
          {metadata && (
            <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {metadata.rows.toLocaleString()} rows · {metadata.columns} cols
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ── SIDEBAR NAV LINK ── */
interface NavItem { name: string; icon: React.ElementType; path: string; }

function SideNavLink({ item, onClose }: { item: NavItem; onClose?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `nav-item-active group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left accent bar */}
          {!isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 rounded-r bg-indigo-500 opacity-0 group-hover:w-0.5 group-hover:h-4 group-hover:opacity-100 transition-all duration-200" />
          )}
          <Icon
            size={16}
            className={`flex-shrink-0 transition-transform duration-200 ${
              isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 group-hover:scale-110"
            }`}
          />
          <span className={isActive ? "text-white font-bold" : ""}>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}