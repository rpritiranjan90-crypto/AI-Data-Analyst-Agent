import {
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  FileType,
  Upload,
} from "lucide-react";

import Card from "../ui/Card";
import { useDatasetStore } from "../../store/datasetStore";
import { useNavigate } from "react-router-dom";

export default function RecentUploads() {
  const navigate = useNavigate();
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Recent Dataset
          </h3>

          <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Latest uploaded dataset information
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          <FileSpreadsheet size={22} />
        </div>
      </div>

      {!metadata ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 py-10 px-4 text-center space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
            <FileSpreadsheet size={36} />
          </div>

          <div>
            <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              No Dataset Uploaded
            </h4>

            <p className="mt-1 max-w-sm text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload a CSV or Excel dataset to start exploring AI-powered analytics and visualizations.
            </p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 shadow-md transition-all active:scale-95"
          >
            <Upload size={14} /> Upload Dataset
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Status
              </p>

              <p className="mt-0.5 text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                Dataset Ready for Analysis
              </p>
            </div>

            <CheckCircle2
              className="text-emerald-600 dark:text-emerald-400"
              size={24}
            />
          </div>

          {/* Details */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5">
              <div className="flex items-center gap-3">
                <FileSpreadsheet
                  className="text-indigo-600 dark:text-indigo-400"
                  size={18}
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Filename
                  </p>

                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {metadata.filename}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5">
              <div className="flex items-center gap-3">
                <FileType
                  className="text-cyan-600 dark:text-cyan-400"
                  size={18}
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    File Format
                  </p>

                  <p className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">
                    {metadata.extension}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5">
              <div className="flex items-center gap-3">
                <CalendarDays
                  className="text-amber-600 dark:text-amber-400"
                  size={18}
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Upload Time
                  </p>

                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {metadata.upload_time
                      ? new Date(metadata.upload_time).toLocaleString()
                      : "Just now"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}