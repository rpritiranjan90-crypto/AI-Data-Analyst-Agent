import { Sparkles, Zap, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

interface ExecutiveEmptyStateBannerProps {
  badgeText?: string;
  title: string;
  subtitle: string;
  actionText?: string;
  actionPath?: string;
  onLoadDemo?: () => void;
}

export default function ExecutiveEmptyStateBanner({
  badgeText = "Executive Analytics Workspace",
  title,
  subtitle,
  actionText = "Upload First Dataset",
  actionPath = "/upload",
  onLoadDemo,
}: ExecutiveEmptyStateBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 p-8 md:p-10 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
            <Sparkles size={13} className="text-indigo-400" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {title}
          </h2>

          <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actionPath && (
            <Link to={actionPath}>
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 border border-indigo-400/30 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 active:scale-95">
                <Zap size={16} className="fill-current" />
                <span>{actionText}</span>
              </Button>
            </Link>
          )}

          {onLoadDemo && (
            <Button
              variant="secondary"
              onClick={onLoadDemo}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <PlayCircle size={16} className="text-indigo-400" />
              <span>Load Demo Dataset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
