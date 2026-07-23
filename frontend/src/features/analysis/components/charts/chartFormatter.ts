export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatDecimal(
  value: number,
  digits = 2
): string {
  return value.toFixed(digits);
}

export function formatPercentage(
  value: number,
  digits = 2
): string {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(
  value: number,
  currency = "USD"
): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}