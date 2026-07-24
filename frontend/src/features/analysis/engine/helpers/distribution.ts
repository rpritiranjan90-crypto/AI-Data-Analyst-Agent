import type {
  AnalysisSummaryResponse,
  DistributionStatistics,
} from "../../types/analysis";

export function getDistributionColumns(
  data: AnalysisSummaryResponse
): DistributionStatistics[] {
  return Object.values(data.distribution);
}

export function getTotalOutliers(
  data: AnalysisSummaryResponse
): number {
  return getDistributionColumns(data).reduce(
    (sum, column) => sum + column.outliers.count,
    0
  );
}

export function getNormalDistributionCount(
  data: AnalysisSummaryResponse
): number {
  return getDistributionColumns(data).filter(
    (column) => column.normal_distribution
  ).length;
}

export function getNormalDistributionRatio(
  data: AnalysisSummaryResponse
): number {
  const columns = getDistributionColumns(data);

  if (columns.length === 0) {
    return 0;
  }

  return (
    getNormalDistributionCount(data) /
    columns.length
  );
}

export function getSkewedColumnCount(
  data: AnalysisSummaryResponse
): number {
  return getDistributionColumns(data).filter(
    (column) => !column.normal_distribution
  ).length;
}