import { useEffect, useState } from "react";
import { Network, Database, Search, RefreshCw, Inbox } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { listDatasets, type DatasetListItem } from "../../services/uploadService";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Unknown";
  const diffSec = Math.floor((Date.now() - then) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hour${Math.floor(diffSec / 3600) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffSec / 86400)} day${Math.floor(diffSec / 86400) > 1 ? "s" : ""} ago`;
}

function inferQuality(rows: number | null, sizeBytes: number): number {
  // Heuristic quality score: larger datasets with structured filenames score higher.
  if (rows === null) return 75;
  let score = 70;
  if (rows > 1000) score += 10;
  if (rows > 100000) score += 10;
  if (sizeBytes > 1024 * 1024) score += 5;
  return Math.min(100, score);
}

export default function DataFabricPage() {
  const [search, setSearch] = useState("");
  const [datasets, setDatasets] = useState<DatasetListItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDatasets() {
    try {
      setLoading(true);
      const res = await listDatasets();
      setDatasets(res.items);
    } catch (err) {
      // Soft-fail: keep the page usable even if backend is down.
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDatasets();
  }, []);

  const filtered = datasets.filter((d) =>
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  const lineageNodes = [
    { title: "Source Datasets", desc: "CSV, XLSX, PostgreSQL, Snowflake", color: "bg-indigo-600" },
    { title: "Data Fabric Ingestion", desc: "Magic Byte Validation & DDE Defense", color: "bg-cyan-600" },
    { title: "AI Profiling & DuckDB", desc: "IQR Outliers & Scipy Correlations", color: "bg-violet-600" },
    { title: "Analytics & Reports", desc: "35 Visual Charts, PowerPoint & PDF", color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Data Fabric"
        title="Enterprise Data Fabric & Metadata Catalog"
        subtitle="Unified metadata catalog, interactive data lineage visualization, schema evolution tracking, and quality scorecards."
      />

      {/* Interactive Data Lineage Flow */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Network size={18} className="text-indigo-600 dark:text-indigo-400" /> Enterprise Data Lineage & Provenance Flow
        </h3>

        <div className="grid gap-4 md:grid-cols-4 pt-2">
          {lineageNodes.map((node, idx) => (
            <div key={idx} className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`w-3 h-3 rounded-full ${node.color}`} />
                <span className="text-[10px] font-mono font-bold text-slate-400">Step 0{idx + 1}</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{node.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Data Catalog */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Database size={18} className="text-indigo-600 dark:text-indigo-400" /> Enterprise Data Assets Catalog
            <span className="text-[10px] font-bold text-slate-400 ml-2">({filtered.length} of {datasets.length})</span>
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog metadata..."
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-8 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>
            <button
              onClick={loadDatasets}
              aria-label="Refresh dataset catalog"
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-500 hover:text-indigo-600 transition"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No datasets in catalog yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              {datasets.length === 0
                ? "Upload a CSV or Excel file from the Upload page. The catalog auto-populates as soon as a dataset lands on the server."
                : "No matches for your search. Try a different filename fragment."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Dataset Name</th>
                  <th className="px-4 py-3">File Size</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Rows</th>
                  <th className="px-4 py-3">Columns</th>
                  <th className="px-4 py-3">Quality Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filtered.map((d) => {
                  const quality = inferQuality(d.rows, d.size_bytes);
                  return (
                    <tr key={d.filename} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Database size={14} className="text-indigo-600 dark:text-indigo-400" /> {d.filename}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{formatBytes(d.size_bytes)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{timeAgo(d.uploaded_at)}</td>
                      <td className="px-4 py-3 text-slate-500">{d.rows !== null ? d.rows.toLocaleString() : "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{d.columns !== null ? d.columns : "—"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {quality}/100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
