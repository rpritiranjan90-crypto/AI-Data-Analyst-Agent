import type { CategoricalColumnAnalysis } from "../types/analysis";

export type CategoryChartData = Record<
  string,
  string | number
> & {
  category: string;
  count: number;
};

const MAX_LABEL_LENGTH = 20;

/**
 * Converts a category label into a user-friendly display value.
 */
function formatCategoryLabel(value: string): string {
  const trimmed = value.trim();

  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "nan" ||
    trimmed.toLowerCase() === "none" ||
    trimmed.toLowerCase() === "null"
  ) {
    return "Missing";
  }

  if (trimmed.length > MAX_LABEL_LENGTH) {
    return `${trimmed.slice(0, MAX_LABEL_LENGTH)}...`;
  }

  return trimmed;
}

/**
 * Converts categorical statistics into chart-ready data.
 * Uses only the backend's top_categories to keep charts readable.
 */
export function buildCategoryChartData(
  stats: CategoricalColumnAnalysis
): CategoryChartData[] {
  return Object.entries(stats.top_categories)
    .map(([category, count]) => ({
      category: formatCategoryLabel(category),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}