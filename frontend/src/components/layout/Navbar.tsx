import {
  FileSpreadsheet,
  Menu,
  Plus,
  UserCircle2,
  Trash2,
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

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
      {/* Left section - Mobile Menu & Active Dataset Indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        {metadata ? (
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-2">
            <FileSpreadsheet className="text-blue-600" size={18} />
            <div className="hidden sm:block text-xs">
              <span className="font-bold text-slate-800">
                {metadata.filename}
              </span>
              <span className="ml-2 text-slate-500">
                ({metadata.rows.toLocaleString()} rows, {metadata.columns} cols)
              </span>
            </div>
            <button
              onClick={clearDataset}
              title="Clear Active Dataset"
              className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-blue-100 hover:text-red-600 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            No dataset loaded
          </div>
        )}
      </div>

      {/* Right section - Actions & User Avatar */}
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => navigate("/upload")}>
          <Plus size={17} />
          <span className="ml-1.5 hidden sm:inline font-semibold">New Dataset</span>
        </Button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-1.5">
            <UserCircle2 size={32} className="text-slate-600" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">
                Data Analyst
              </p>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">
                Admin Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}