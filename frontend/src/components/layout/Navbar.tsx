import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Menu,
  Plus,
  Trash2,
  Sun,
  Moon,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useDatasetStore } from "../../store/datasetStore";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();
  const { dataset, clearDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme_mode") === "dark";
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme_mode", "light");
    }
  }, [isDarkMode]);

  return (
    <header
      className={`nav-glass sticky top-0 z-30 flex h-[68px] items-center justify-between px-5 transition-all duration-300 ${
        scrolled ? "shadow-md shadow-slate-900/5" : ""
      }`}
    >
      {/* Gradient accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      {/* ── LEFT SECTION ── */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-all duration-200 md:hidden shadow-xs"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        {/* Active Dataset Pill */}
        {metadata ? (
          <div className="flex items-center gap-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 shadow-md shadow-slate-300/50 dark:shadow-none transition-all duration-300">
            <div className="relative">
              <FileSpreadsheet className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 pulse-glow" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-black text-black dark:text-white leading-none">
                {metadata.filename.length > 22
                  ? metadata.filename.slice(0, 22) + "…"
                  : metadata.filename}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">
                  {metadata.rows.toLocaleString()} rows
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">
                  {metadata.columns} cols
                </span>
              </div>
            </div>
            <button
              onClick={clearDataset}
              title="Clear Active Dataset"
              className="ml-1 rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 transition-all duration-150"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-black dark:text-white px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md shadow-slate-300/50 dark:shadow-none">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            No dataset loaded
          </div>
        )}
      </div>

      {/* ── RIGHT SECTION ── */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative rounded-xl border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 shadow-xs"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-xl border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-xs"
        >
          {isDarkMode ? (
            <Sun size={17} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon size={17} className="text-slate-600 transition-transform duration-300" />
          )}
        </button>

        {/* New Dataset CTA */}
        <Button
          variant="primary"
          onClick={() => navigate("/upload")}
          className="hidden sm:inline-flex shadow-md shadow-blue-500/20"
        >
          <Plus size={16} />
          <span className="ml-1 font-bold">New Dataset</span>
        </Button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200/80 dark:bg-slate-700/60 mx-1" />

        {/* User Avatar */}
        <button className="flex items-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 shadow-xs group">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm shadow-indigo-500/30 ring-2 ring-indigo-100 dark:ring-indigo-900/50">
            DA
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
              Data Analyst
            </p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-500 leading-tight mt-0.5">
              Admin Workspace
            </p>
          </div>
          <ChevronDown size={13} className="hidden md:block text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform group-hover:rotate-180 duration-200" />
        </button>
      </div>
    </header>
  );
}