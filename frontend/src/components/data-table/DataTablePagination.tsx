import type { RowData } from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { DataTablePaginationProps } from "./types";

export default function DataTablePagination<
  TData extends RowData
>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {table.getState().pagination.pageIndex + 1}
        {" / "}
        {table.getPageCount()}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border p-2 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg border p-2 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}