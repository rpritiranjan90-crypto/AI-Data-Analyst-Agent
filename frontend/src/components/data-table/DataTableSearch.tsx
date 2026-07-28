import { Search } from "lucide-react";

interface DataTableSearchProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function DataTableSearch({
  value,
  placeholder = "Search...",
  onChange,
}: DataTableSearchProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
      />
    </div>
  );
}