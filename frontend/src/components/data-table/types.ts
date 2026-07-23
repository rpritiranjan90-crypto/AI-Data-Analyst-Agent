import type {
  ColumnDef,
  RowData,
  Table,
} from "@tanstack/react-table";

export interface DataTableProps<
  TData extends RowData,
  TValue
> {
  columns: ColumnDef<TData, TValue>[];

  data: TData[];

  pageSize?: number;

  searchPlaceholder?: string;

  isLoading?: boolean;
}

export interface DataTableToolbarProps<TData extends RowData> {
  table: Table<TData>;

  searchPlaceholder?: string;
}

export interface DataTablePaginationProps<
  TData extends RowData
> {
  table: Table<TData>;
}

export interface DataTableColumnHeaderProps<
  TData,
  TValue
> {
  column: import("@tanstack/react-table").Column<
    TData,
    TValue
  >;

  title: string;
}