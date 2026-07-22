import {
  BarChart3,
  Brain,
  FileBarChart2,
  Home,
  Sparkles,
  Upload,
  Wrench,
  LineChart,
  Bot,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    section: "MAIN",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: Home,
      },
      {
        title: "Upload Dataset",
        path: "/upload",
        icon: Upload,
      },
    ],
  },
  {
    section: "DATA",
    items: [
      {
        title: "Analysis",
        path: "/analysis",
        icon: BarChart3,
      },
      {
        title: "Data Cleaning",
        path: "/cleaning",
        icon: Wrench,
      },
      {
        title: "Visualization",
        path: "/visualization",
        icon: LineChart,
      },
    ],
  },
  {
    section: "AI",
    items: [
      {
        title: "AI Insights",
        path: "/ai-insights",
        icon: Brain,
      },
      {
        title: "Recommendations",
        path: "/recommendation",
        icon: Sparkles,
      },
      {
        title: "Machine Learning",
        path: "/machine-learning",
        icon: Bot,
      },
    ],
  },
  {
    section: "REPORTS",
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: FileBarChart2,
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 px-8 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
            AI
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              AI Data Analyst
            </h1>

            <p className="text-sm text-slate-500">
              Analytics Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-5 py-6">
        {navigation.map((group) => (
          <div key={group.section} className="mb-8">
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {group.section}
            </p>

            <ul className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-5">
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Version
          </p>

          <p className="mt-1 text-sm font-medium text-slate-900">
            AI Data Analyst v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}