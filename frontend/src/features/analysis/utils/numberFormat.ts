/**
 * Formats large numbers into a compact, human-readable format.
 * Examples:
 * 1250      -> 1.25K
 * 1250000   -> 1.25M
 * 1250000000-> 1.25B
 */
export function formatCompactNumber(
  value: number,
  digits = 2
): string {
  if (!Number.isFinite(value)) return "-";

  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(digits)}B`;
  }

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(digits)}M`;
  }

  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(digits)}K`;
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

/**
 * Formats numbers with thousand separators.
 * Example:
 * 12345678.9 -> 12,345,678.90
 */
export function formatNumber(
  value: number,
  digits = 2
): string {
  if (!Number.isFinite(value)) return "-";

  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}