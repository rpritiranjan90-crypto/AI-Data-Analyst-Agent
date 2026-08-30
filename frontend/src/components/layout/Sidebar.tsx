import {
  BarChart3,
  BrainCircuit,
  Home,
  Sparkles,
  Upload,
  Wand2,
  FileText,
  X,
  CreditCard,
  Sliders,
  BookOpen,
  ShieldCheck,
  Target,
  Network,
  HelpCircle,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDatasetStore } from "../../store/datasetStore";

/**
 * Sidebar navigation.
 *
 * Design principles:
 * - Plain language that answers "What do I want to do?"
 * - 4 top-level sections users can scan in seconds
 * - Advanced tools hidden behind a single "More Tools" expander
 *   so first-time users are not overwhelmed
 * - Icons + short labels, no marketing words ("Studio", "Radar")
 */

const getStartedSection = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Upload Data", icon: Upload, path: "/upload" },
];

const understandSection = [
  { name: "Analyze Data", icon: BarChart3, path: "/analysis" },
  { name: "Clean Data", icon: Wand2, path: "/cleaning" },
  { name: "Visualize", icon: Sparkles, path: "/visualization" },
  { name: "Train ML Models", icon: BrainCircuit, path: "/machine-learning" },
];

const decideSection = [
  { name: "Decision Center", icon: Target, path: "/decision-center" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "AI Insights & Cost", icon: ShieldCheck, path: "/governance" },
];

const workspaceSection = [
  { name: "Workspace", icon: Network, path: "/settings/workspace" },
  { name: "Usage", icon: TrendingUp, path: "/settings/usage" },
  { name: "Privacy & Data", icon: Shield, path: "/settings/gdpr" },
  { name: "Upgrade Plan", icon: CreditCard, path: "/pricing" },
  { name: "Help", icon: HelpCircle, path: "/help" },
];

// "More Tools" — advanced / power-user items collapsed by default
const advancedSection = [
  { name: "Data Fabric", icon: Network, path: "/data-fabric" },
  { name: "What-If Simulator", icon: Sliders, path: "/simulator" },
  { name: "Ask AI", icon: BookOpen, path: "/knowledge" },
  { name: "Production Readiness", icon: ShieldCheck, path: "/readiness" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
        bg-[#0F1629] border-r border-white/5
        transition-all duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"}`}
    >
      {/* ── LOGO HEADER ── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-md text-xs">
            AI
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              AIFlow Enterprise
            </h2>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Data Analyst Platform
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        <NavGroup title="Get Started" items={getStartedSection} onClose={onClose} />
        <NavGroup title="Understand Your Data" items={understandSection} onClose={onClose} />
        <NavGroup title="Decide & Report" items={decideSection} onClose={onClose} />
        <NavGroup title="Workspace" items={workspaceSection} onClose={onClose} />

        {/* Advanced tools — collapsed by default */}
        <div>
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            className="w-full flex items-center justify-between text-slate-500 uppercase text-[10px] tracking-wider font-bold px-3 mb-2 hover:text-slate-300 transition"
            aria-expanded={advancedOpen}
          >
            <span className="flex items-center gap-1.5">
              <Wrench size={11} /> More Tools
            </span>
            {advancedOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
          {advancedOpen && (
            <div className="space-y-1">
              {advancedSection.map((item) => (
                <SideNavLink key={item.path} item={item} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── FOOTER: ACTIVE DATASET ── */}
      {metadata && (
        <div className="border-t border-white/5 p-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400">
                Active Dataset
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="truncate font-semibold text-white text-xs">{metadata.filename}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {metadata.rows.toLocaleString()} rows · {metadata.columns} cols
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ── NAV GROUP ── */
interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

function NavGroup({
  title,
  items,
  onClose,
}: {
  title: string;
  items: NavItem[];
  onClose?: () => void;
}) {
  return (
    <div>
      <div className="text-slate-500 uppercase text-[10px] tracking-wider font-bold px-3 mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <SideNavLink key={item.path} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

/* ── SIDEBAR NAV LINK ── */
function SideNavLink({ item, onClose }: { item: NavItem; onClose?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 text-xs transition hover:bg-white/5 rounded-lg ${
          isActive
            ? "bg-indigo-600/15 text-indigo-400 font-semibold border-l-2 border-indigo-500 rounded-l-none"
            : "text-slate-400 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={16}
            className={`flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`}
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}
