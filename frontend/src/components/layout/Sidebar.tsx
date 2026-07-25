import {
  BarChart3,
  BrainCircuit,
  Database,
  Home,
  Sparkles,
  Upload,
  Wand2,
  FileText,
  X,
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
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        bg-[#0F1629] border-r border-white/5
        transition-all duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"}`}
    >
      {/* ── LOGO HEADER ── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold px-2 py-0.5 rounded-md text-xs shadow-xs">
            AI
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight tracking-tight">
              AI Data Analyst
            </h2>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Enterprise Intelligence
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {/* Main Section */}
        <div>
          <div className="text-slate-500 uppercase text-[10px] tracking-[0.1em] font-semibold px-3 mb-2">
            PLATFORM CORE
          </div>
          <div className="space-y-1">
            {mainSection.map((item) => (
              <SideNavLink key={item.path} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <div className="text-slate-500 uppercase text-[10px] tracking-[0.1em] font-semibold px-3 mb-2">
            ANALYTICS & AI
          </div>
          <div className="space-y-1">
            {analyticsSection.map((item) => (
              <SideNavLink key={item.path} item={item} onClose={onClose} />
            ))}
          </div>
        </div>
      </nav>

      {/* ── FOOTER & ACTIVE DATASET STATUS ── */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {/* Active Dataset Status */}
        {metadata && (
          <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                <Zap size={10} className="text-indigo-400" /> Active Dataset
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="truncate font-semibold text-white text-xs">{metadata.filename}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {metadata.rows.toLocaleString()} rows · {metadata.columns} cols
            </p>
          </div>
        )}

        {/* AI Provider Gemini Badge */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 border border-white/5">
          <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-cyan-400">●</span> AI Provider:
          </span>
          <span className="text-cyan-300 font-semibold text-xs">Gemini</span>
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
        `flex items-center gap-3 px-3 py-2.5 text-xs transition-all duration-150 ease-in-out hover:translate-x-0.5 ${
          isActive
            ? "bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500 rounded-r-lg"
            : "text-slate-400 hover:bg-white/5 hover:text-white rounded-lg"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`}
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}