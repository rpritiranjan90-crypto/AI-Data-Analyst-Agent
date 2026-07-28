import { useState } from "react";
import { Network, Database, Search } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

export default function DataFabricPage() {
  const [search, setSearch] = useState("");

  const datasets = [
    { id: "1", name: "enterprise_sales_q3.csv", owner: "Lead Analyst", freshness: "10 mins ago", quality: 98, rows: "162,059", schema: "v2.1" },
    { id: "2", name: "customer_churn_records.xlsx", owner: "Data Science Team", freshness: "1 hour ago", quality: 94, rows: "45,200", schema: "v1.4" },
    { id: "3", name: "postgresql_financial_db", owner: "Finance Admin", freshness: "Live Sync", quality: 100, rows: "1,250,000", schema: "v3.0" },
    { id: "4", name: "inventory_supply_chain.csv", owner: "Ops Lead", freshness: "Yesterday", quality: 91, rows: "89,400", schema: "v1.0" },
  ];

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
          </h3>

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
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Dataset Name</th>
                <th className="px-4 py-3">Owner Principal</th>
                <th className="px-4 py-3">Data Freshness</th>
                <th className="px-4 py-3">Schema</th>
                <th className="px-4 py-3">Rows</th>
                <th className="px-4 py-3">Quality Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database size={14} className="text-indigo-600 dark:text-indigo-400" /> {d.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{d.owner}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{d.freshness}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{d.schema}</td>
                  <td className="px-4 py-3">{d.rows}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {d.quality}/100 Score
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
