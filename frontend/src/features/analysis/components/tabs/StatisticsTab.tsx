import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { BarChart3, Sigma } from "lucide-react";

import { DataTable } from "../../../../components/data-table";
import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";
import type { NumericColumnStatistics } from "../../types/analysis";

interface StatisticsRow extends NumericColumnStatistics {
  column: string;
}

export default function StatisticsTab() {
  const { descriptive } = useAnalysisData();

  const tableData = useMemo<StatisticsRow[]>(() => {
    return Object.entries(descriptive).map(([column, stats]) => ({
      column,
      ...stats,
    }));
  }, [descriptive]);

  const columns = useMemo<ColumnDef<StatisticsRow>[]>(
    () => [
      {
        accessorKey: "column",
        header: "Column",
      },
      {
        accessorKey: "count",
        header: "Count",
      },
      {
        accessorKey: "mean",
        header: "Mean",
        cell: ({ row }) => row.original.mean.toFixed(2),
      },
      {
        accessorKey: "standard_deviation",
        header: "Std Dev",
        cell: ({ row }) =>
          row.original.standard_deviation.toFixed(2),
      },
      {
        accessorKey: "minimum",
        header: "Min",
      },
      {
        accessorKey: "q1",
        header: "Q1",
      },
      {
        accessorKey: "q2",
        header: "Median",
      },
      {
        accessorKey: "q3",
        header: "Q3",
      },
      {
        accessorKey: "maximum",
        header: "Max",
      },
      {
        accessorKey: "missing_values",
        header: "Missing",
      },
    ],
    []
  );

  if (tableData.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Statistics Not Available"
        description="No descriptive statistics were returned."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sigma}
        title="Descriptive Statistics"
        subtitle="Statistical summary of all numeric columns."
      />

      <DataTable
        columns={columns}
        data={tableData}
        pageSize={10}
        searchPlaceholder="Search numeric columns..."
      />
    </div>
  );
}