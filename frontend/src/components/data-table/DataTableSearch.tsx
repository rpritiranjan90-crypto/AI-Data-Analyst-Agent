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
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}