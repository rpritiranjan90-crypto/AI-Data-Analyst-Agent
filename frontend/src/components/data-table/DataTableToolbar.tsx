import type { RowData } from "@tanstack/react-table";

import DataTableSearch from "./DataTableSearch";
import type { DataTableToolbarProps } from "./types";

export default function DataTableToolbar<
  TData extends RowData
>({
  table,
  searchPlaceholder = "Search...",
}: DataTableToolbarProps<TData>) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="w-full max-w-sm">
        <DataTableSearch
          value={
            (table.getState().globalFilter as string) ?? ""
          }
          placeholder={searchPlaceholder}
          onChange={(value) =>
            table.setGlobalFilter(value)
          }
        />
      </div>
    </div>
  );
}