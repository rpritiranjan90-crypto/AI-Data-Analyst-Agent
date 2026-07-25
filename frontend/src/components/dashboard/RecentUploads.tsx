import {
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  FileType,
} from "lucide-react";

import Card from "../ui/Card";
import { useDatasetStore } from "../../store/datasetStore";

export default function RecentUploads() {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Recent Dataset
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest uploaded dataset information
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3">
          <FileSpreadsheet
            size={24}
            className="text-blue-600"
          />
        </div>
      </div>

      {!metadata ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <FileSpreadsheet
            size={48}
            className="mb-4 text-slate-300"
          />

          <h4 className="text-lg font-semibold text-slate-700">
            No Dataset Uploaded
          </h4>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload a CSV or Excel dataset to start exploring
            AI-powered analytics and visualizations.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Status
              </p>

              <p className="mt-1 font-semibold text-emerald-900">
                Dataset Ready
              </p>
            </div>

            <CheckCircle2
              className="text-emerald-600"
              size={28}
            />
          </div>

          {/* Details */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet
                  className="text-blue-600"
                  size={20}
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Filename
                  </p>

                  <p className="font-semibold text-slate-900">
                    {metadata.filename}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <FileType
                  className="text-indigo-600"
                  size={20}
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    File Type
                  </p>

                  <p className="font-semibold uppercase text-slate-900">
                    {metadata.extension}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <CalendarDays
                  className="text-orange-600"
                  size={20}
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Uploaded
                  </p>

                  <p className="font-semibold text-slate-900">
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