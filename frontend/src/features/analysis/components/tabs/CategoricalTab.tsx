import { useMemo, useState } from "react";
import { Search, Tags } from "lucide-react";

import CategoricalCard from "../cards/CategoricalCard";
import EmptyState from "../../../../components/ui/EmptyState";
import { useAnalysisData } from "../../context/AnalysisContext";

export default function CategoricalTab() {
  const { categorical } = useAnalysisData();
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    if (!categorical || typeof categorical !== "object") return [];
    if ("message" in categorical && Object.keys(categorical).length === 1) return [];

    return Object.entries(categorical)
      .filter(([column, stats]) => {
        if (column === "message") return false;
        if (!stats || typeof stats !== "object") return false;
        return column.toLowerCase().includes(search.toLowerCase());
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [categorical, search]);

  if (columns.length === 0) {
    const msg = (categorical as any)?.message;
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <EmptyState
          icon={Tags}
          title="No Categorical Columns Found"
          description={
            msg
              ? String(msg)
              : "This dataset does not contain any categorical (text/string/boolean) features for categorical analysis."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search categorical columns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-6">
        {columns.map(([column, stats]) => (
          <CategoricalCard
            key={column}
            column={column}
            stats={stats as any}
          />
        ))}
      </div>
    </div>
  );
}