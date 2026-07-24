import {
  BarChart3,
  BrainCircuit,
  Database,
  FileSpreadsheet,
  Home,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    name: "Analysis",
    icon: BarChart3,
    path: "/analysis",
  },
  {
    name: "Cleaning",
    icon: Wand2,
    path: "/cleaning",
  },
  {
    name: "Visualization",
    icon: Sparkles,
    path: "/visualization",
  },
  {
    name: "Machine Learning",
    icon: BrainCircuit,
    path: "/machine-learning",
  },
  {
    name: "Recommendation",
    icon: Database,
    path: "/recommendation",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <FileSpreadsheet
              className="text-white"
              size={22}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Analyst
            </h2>

            <p className="text-xs text-slate-500">
              Data Analytics Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-900">
            AI Data Analyst
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Professional Analytics Dashboard
          </p>
        </div>
      </div>
    </aside>
  );
}