import type {
  CleaningPriority,
  CleaningSuggestion,
} from "./types";

export function getMissingPriority(
  percentage: number,
): CleaningPriority {
  if (percentage >= 20) return "critical";
  if (percentage >= 5) return "warning";
  return "info";
}

export function getDuplicatePriority(
  duplicates: number,
): CleaningPriority {
  if (duplicates > 100) return "critical";
  if (duplicates > 0) return "warning";
  return "info";
}

export function getCardinalityPriority(
  uniqueValues: number,
): CleaningPriority {
  if (uniqueValues >= 100) return "warning";
  return "info";
}

export function createSuggestion(
  suggestion: CleaningSuggestion,
): CleaningSuggestion {
  return suggestion;
}

export function calculateCleaningScore(
  critical: number,
  warnings: number,
): number {
  const score =
    100 -
    critical * 20 -
    warnings * 5;

  return Math.max(0, score);
}

export function isReadyForML(
  critical: number,
): boolean {
  return critical === 0;
}