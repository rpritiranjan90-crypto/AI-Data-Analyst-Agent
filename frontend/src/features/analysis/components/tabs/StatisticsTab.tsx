import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BarChart3,
  Sigma,
  Database,
  Hash,
  AlertTriangle,
} from "lucide-react";

import { DataTable } from "../../../../components/data-table";
import Card from "../../../../components/ui/Card";
import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";
import type { NumericColumnStatistics } from "../../types/analysis";

interface StatisticsRow extends NumericColumnStatistics {
  column: string;
}

function formatNum(val: unknown, decimals: number = 2): string {
  if (val === null || val === undefined) return "N/A";
  const n = Number(val);
  return isNaN(n) ? "N/A" : n.toFixed(decimals);
}

export default function StatisticsTab() {
  const { descriptive } = useAnalysisData();

  const tableData = useMemo<StatisticsRow[]>(() => {
    if (!descriptive || typeof descriptive !== "object") return [];
    return Object.entries(descriptive)
      .filter(([_, stats]) => stats && typeof stats === "object")
      .map(([column, stats]) => ({
        column,
        ...stats,
      }));
  }, [descriptive]);

  const summary = useMemo(() => {
    const totalColumns = tableData.length;

    const totalRecords =
      tableData.reduce(
        (sum, item) => sum + (item.count || 0),
        0
      ) || 0;

    const totalMissing =
      tableData.reduce(
        (sum, item) => sum + (item.missing_values || 0),
        0
      ) || 0;

    return {
      totalColumns,
      totalRecords,
      totalMissing,
    };
  }, [tableData]);

  const columns = useMemo<ColumnDef<StatisticsRow>[]>(
    () => [
      {
        accessorKey: "column",
        header: "Column",
      },
      {
        accessorKey: "count",
        header: "Count",
        cell: ({ row }) => row.original.count ?? "0",
      },
      {
        accessorKey: "mean",
        header: "Mean",
        cell: ({ row }) => formatNum(row.original.mean, 2),
      },
      {
        accessorKey: "standard_deviation",
        header: "Std Dev",
        cell: ({ row }) => formatNum(row.original.standard_deviation, 2),
      },
      {
        accessorKey: "minimum",
        header: "Min",
        cell: ({ row }) => formatNum(row.original.minimum, 2),
      },
      {
        accessorKey: "q1",
        header: "Q1",
        cell: ({ row }) => formatNum(row.original.q1, 2),
      },
      {
        accessorKey: "q2",
        header: "Median",
        cell: ({ row }) => formatNum(row.original.q2 ?? row.original.median, 2),
      },
      {
        accessorKey: "q3",
        header: "Q3",
        cell: ({ row }) => formatNum(row.original.q3, 2),
      },
      {
        accessorKey: "maximum",
        header: "Max",
        cell: ({ row }) => formatNum(row.original.maximum, 2),
      },
      {
        accessorKey: "missing_values",
        header: "Missing",
        cell: ({ row }) => row.original.missing_values ?? 0,
      },
    ],
    []
  );

  if (tableData.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-10 w-10" />}
        title="Statistics Not Available"
        description="No descriptive statistics were returned for numeric columns."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Sigma className="h-6 w-6 text-indigo-600" />}
        title="Descriptive Statistics"
        subtitle="Comprehensive statistical summary of every numeric column."
      />

      {/* Executive Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<Database className="text-blue-600" size={24} />}
          title="Numeric Columns"
          value={summary.totalColumns}
        />

        <SummaryCard
          icon={<Hash className="text-emerald-600" size={24} />}
          title="Total Records"
          value={summary.totalRecords.toLocaleString()}
        />

        <SummaryCard
          icon={<AlertTriangle className="text-orange-600" size={24} />}
          title="Missing Values"
          value={summary.totalMissing}
        />
      </div>

      <Card className="overflow-hidden">
        <DataTable
          columns={columns}
          data={tableData}
          pageSize={10}
          searchPlaceholder="Search numeric columns..."
        />
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

function SummaryCard({
  icon,
  title,
  value,
}: SummaryCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          {icon}
        </div>
      </div>
    </Card>
  );
}