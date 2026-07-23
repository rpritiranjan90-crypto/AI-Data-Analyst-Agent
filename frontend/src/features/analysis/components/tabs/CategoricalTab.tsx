import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import CategoricalCard from "../cards/CategoricalCard";
import { useAnalysisData } from "../../context/AnalysisContext";

export default function CategoricalTab() {
  const { categorical } = useAnalysisData();

  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    return Object.entries(categorical)
      .filter(([column]) =>
        column.toLowerCase().includes(search.toLowerCase())
      )
      .sort(([a], [b]) => a.localeCompare(b));
  }, [categorical, search]);

  if (columns.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-700">
          No categorical columns found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try another search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search categorical columns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-6">
        {columns.map(([column, stats]) => (
          <CategoricalCard
            key={column}
            column={column}
            stats={stats}
          />
        ))}
      </div>
    </div>
  );
}