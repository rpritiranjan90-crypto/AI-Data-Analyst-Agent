import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";

import EmptyState from "../ui/EmptyState";
import LoadingCard from "../ui/LoadingCard";

import { Database } from "lucide-react";

import DataTablePagination from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";
import type { DataTableProps } from "./types";

export default function DataTable<
  TData extends RowData,
  TValue,
>({
  columns,
  data,
  pageSize = 10,
  searchPlaceholder = "Search...",
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] =
    useState("");

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize,
    });

  const memoData = useMemo(
    () => data,
    [data]
  );

  const memoColumns = useMemo<
    ColumnDef<TData, TValue>[]
  >(() => columns, [columns]);

  const table = useReactTable({
    data: memoData,

    columns: memoColumns,

    state: {
      sorting,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,

    onGlobalFilterChange: setGlobalFilter,

    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),
  });

  if (isLoading) {
    return <LoadingCard rows={6} />;
  }

  if (!data.length) {
    return (
      <EmptyState
  icon={<Database className="h-10 w-10" />}
  title="No Data Available"
  description="There are no records to display."
/>
    );
  }

  return (
    <div className="space-y-4">

      <DataTableToolbar
        table={table}
        searchPlaceholder={
          searchPlaceholder
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              {table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-sm font-semibold text-slate-700"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column
                                  .columnDef
                                  .header,
                                header.getContext()
                              )}
                        </th>
                      )
                    )}
                  </tr>
                ))}

            </thead>

            <tbody>

              {table
                .getRowModel()
                .rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-slate-50"
                  >
                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm"
                        >
                          {flexRender(
                            cell.column.columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

      <DataTablePagination
        table={table}
      />

    </div>
  );
}