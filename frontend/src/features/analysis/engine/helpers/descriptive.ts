import type {
  AnalysisSummaryResponse,
  NumericColumnStatistics,
} from "../../types/analysis";

export function getDescriptiveColumns(
  data: AnalysisSummaryResponse
): NumericColumnStatistics[] {
  return Object.values(data.descriptive);
}

export function getTotalMissingValues(
  data: AnalysisSummaryResponse
): number {
  return getDescriptiveColumns(data).reduce(
    (sum, column) => sum + column.missing_values,
    0
  );
}

export function getTotalCells(
  data: AnalysisSummaryResponse
): number {
  return getDescriptiveColumns(data).reduce(
    (sum, column) => sum + column.count,
    0
  );
}

export function getMissingPercentage(
  data: AnalysisSummaryResponse
): number {
  const totalCells = getTotalCells(data);

  if (totalCells === 0) {
    return 0;
  }

  return (
    (getTotalMissingValues(data) / totalCells) * 100
  );
}

export function getNumericColumnCount(
  data: AnalysisSummaryResponse
): number {
  return getDescriptiveColumns(data).length;
}