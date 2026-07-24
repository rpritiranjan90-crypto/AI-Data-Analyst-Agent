import type { CorrelationMatrix } from "../../types/analysis";

export interface CorrelationStrength {
  label: string;
  shortLabel: string;
  bgClass: string;
  textClass: string;
}

export function getCorrelationStrength(
  value: number,
  diagonal = false,
): CorrelationStrength {
  if (diagonal) {
    return {
      label: "Self Correlation",
      shortLabel: "Self",
      bgClass: "bg-slate-900",
      textClass: "text-white",
    };
  }

  if (value >= 0.8) {
    return {
      label: "Very Strong Positive",
      shortLabel: "Strong +",
      bgClass: "bg-emerald-700",
      textClass: "text-white",
    };
  }

  if (value >= 0.5) {
    return {
      label: "Strong Positive",
      shortLabel: "Positive",
      bgClass: "bg-emerald-500",
      textClass: "text-white",
    };
  }

  if (value >= 0.2) {
    return {
      label: "Weak Positive",
      shortLabel: "Weak +",
      bgClass: "bg-emerald-200",
      textClass: "text-emerald-900",
    };
  }

  if (value <= -0.8) {
    return {
      label: "Very Strong Negative",
      shortLabel: "Strong -",
      bgClass: "bg-red-700",
      textClass: "text-white",
    };
  }

  if (value <= -0.5) {
    return {
      label: "Strong Negative",
      shortLabel: "Negative",
      bgClass: "bg-red-500",
      textClass: "text-white",
    };
  }

  if (value <= -0.2) {
    return {
      label: "Weak Negative",
      shortLabel: "Weak -",
      bgClass: "bg-red-200",
      textClass: "text-red-900",
    };
  }

  return {
    label: "Little or No Correlation",
    shortLabel: "Weak",
    bgClass: "bg-slate-100",
    textClass: "text-slate-700",
  };
}

export function isStrongCorrelation(
  value: number,
  diagonal = false,
): boolean {
  return !diagonal && Math.abs(value) >= 0.8;
}

export function getTooltipText(
  row: string,
  column: string,
  value: number,
  diagonal = false,
): string {
  const strength = getCorrelationStrength(value, diagonal);

  return [
    `${row} ↔ ${column}`,
    "",
    `Correlation: ${value.toFixed(2)}`,
    `Strength: ${strength.label}`,
  ].join("\n");
}

export function getHighestCorrelation(
  matrix: CorrelationMatrix,
): number {
  let highest = 0;

  Object.entries(matrix).forEach(([row, values]) => {
    Object.entries(values).forEach(([column, value]) => {
      if (row !== column) {
        highest = Math.max(highest, Math.abs(value));
      }
    });
  });

  return highest;
}

export function countStrongCorrelations(
  matrix: CorrelationMatrix,
): number {
  let count = 0;

  Object.entries(matrix).forEach(([row, values]) => {
    Object.entries(values).forEach(([column, value]) => {
      if (
        row !== column &&
        Math.abs(value) >= 0.8
      ) {
        count++;
      }
    });
  });

  return Math.floor(count / 2);
}