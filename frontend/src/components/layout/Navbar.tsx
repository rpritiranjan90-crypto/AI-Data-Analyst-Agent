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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

        {/* Global Search Input */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dataset, metrics, or AI reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-150"
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

        {/* User Initials Avatar */}
        <div
          title="Data Analyst Workspace"
          className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-semibold w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-xs cursor-pointer ml-1"
        >
          DA
        </div>
      </div>
    </header>
  );
}