import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Menu,
  Plus,
  Trash2,
  Sun,
  Moon,
  Bell,
  Search,
  Building2,
  ChevronDown,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDatasetStore } from "../../store/datasetStore";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";
import { toast } from "sonner";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();
  const { dataset, clearDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const { user, activeWorkspace, workspaces, setAuth, isAuthenticated } = useAuthStore();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme_mode") === "dark";
  });

  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [switchingWs, setSwitchingWs] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme_mode", "light");
    }
  }, [isDarkMode]);

  // Close workspace dropdown on outside click or Escape
  useEffect(() => {
    if (!wsDropdownOpen) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e instanceof KeyboardEvent && e.key === "Escape"
          ? true
          : !target.closest("[data-ws-dropdown]")
      ) {
        setWsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    // Use setTimeout so the current click that opened the dropdown doesn't close it immediately
    const timeout = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("click", handler);
      clearTimeout(timeout);
    };
  }, [wsDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 bg-[#F8F9FC]/95 dark:bg-[#0F1629]/95 backdrop-blur border-b border-slate-200/60 dark:border-white/5 transition-colors">
      {/* ── LEFT SECTION ── */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition md:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        {/* Prominent Workspace Switcher */}
        <div className="relative">
          <button
            data-ws-dropdown
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Building2 size={15} className="text-indigo-600 dark:text-indigo-400" />
            <span>{activeWorkspace?.name || "Acme Analytics"}</span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              {activeWorkspace?.role || "Owner"}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {wsDropdownOpen && (
            <div data-ws-dropdown className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 space-y-1 max-h-[80vh] overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                Switch Enterprise Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={async () => {
                    if (activeWorkspace?.id === ws.id) { setWsDropdownOpen(false); return; }
                    setSwitchingWs(ws.id);
                    setWsDropdownOpen(false);
                    try {
                      const res = await api.post("/auth/switch-workspace", {
                        workspace_id: ws.id,
                      });
                      const { token, user: refreshedUser, workspaces: refreshedWorkspaces } = res.data;
                      if (token) localStorage.setItem("ai_analyst_jwt_token", token);
                      if (refreshedUser && token) {
                        const mappedUser = {
                          id: refreshedUser.id,
                          email: refreshedUser.email,
                          name: refreshedUser.name || refreshedUser.email,
                          role: (refreshedUser.role || "Analyst") as "Owner" | "Admin" | "Data Scientist" | "Analyst" | "Viewer",
                        };
                        setAuth(mappedUser as any, token, refreshedWorkspaces);
                      }
                      toast.success(`Switched to ${ws.name}`);
                    } catch {
                      toast.error("Failed to switch workspace. Please try again.");
                    } finally {
                      setSwitchingWs(null);
                    }
                  }}
                  disabled={switchingWs !== null}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-60 ${
                    activeWorkspace?.id === ws.id
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {ws.name}
                    {ws.plan && ws.plan !== "free" && (
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1 rounded font-mono uppercase">
                        {ws.plan}
                      </span>
                    )}
                  </span>
                  {switchingWs === ws.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <span className="text-[10px] font-mono text-slate-400">{ws.role}</span>
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Input */}
        <div className="relative hidden xl:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dataset, metrics, or AI reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-150"
          />
        </div>

        {/* Active Dataset Pill */}
        {metadata && (
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1 text-xs shadow-xs">
            <FileSpreadsheet size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {metadata.filename}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {metadata.rows.toLocaleString()} rows
            </span>
            <button
              onClick={clearDataset}
              title="Clear Active Dataset"
              className="ml-1 text-slate-400 hover:text-red-500 transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── RIGHT SECTION ── */}
      <div className="flex items-center gap-2">
        {/* Admin Portal Button */}
        <button
          onClick={() => navigate("/admin")}
          title="Admin Security Portal"
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" /> Admin
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <Bell size={17} />
          <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1" />
        </button>

        {/* New Analysis CTA Button */}
        <button
          onClick={() => navigate("/upload")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2 text-sm font-medium shadow-[0_1px_8px_rgba(79,70,229,0.35)] transition-all duration-150 flex items-center gap-1.5 active:scale-[0.97]"
        >
          <Plus size={16} />
          <span>New Analysis</span>
        </button>

        {/* User Profile Avatar or Sign In */}
        {isAuthenticated && user ? (
          <div
            onClick={() => navigate("/login")}
            title={`${user.name} (${user.role}) — Click to sign out`}
            className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-black w-9 h-9 rounded-full flex items-center justify-center text-xs shadow-xs cursor-pointer ml-1"
          >
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}