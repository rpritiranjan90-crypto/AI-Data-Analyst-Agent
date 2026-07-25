import { Search, X } from "lucide-react";

interface CorrelationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CorrelationSearch({
  value,
  onChange,
}: CorrelationSearchProps) {
  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        placeholder="Search columns..."
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}