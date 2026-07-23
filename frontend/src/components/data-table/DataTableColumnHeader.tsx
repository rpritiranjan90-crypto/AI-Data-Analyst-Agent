import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from "lucide-react";

import type { DataTableColumnHeaderProps } from "./types";

export default function DataTableColumnHeader<
  TData,
  TValue
>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <button
      className="flex items-center gap-2 font-semibold"
      onClick={() =>
        column.toggleSorting(
          column.getIsSorted() === "asc"
        )
      }
    >
      {title}

      {column.getIsSorted() === "asc" && (
        <ArrowUp size={16} />
      )}

      {column.getIsSorted() === "desc" && (
        <ArrowDown size={16} />
      )}

      {column.getIsSorted() === false && (
        <ChevronsUpDown size={16} />
      )}
    </button>
  );
}