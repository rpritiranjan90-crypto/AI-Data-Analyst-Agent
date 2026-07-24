export type ExportFormat =
  | "pdf"
  | "excel"
  | "csv"
  | "markdown"
  | "png";

export interface ExportOption {
  id: ExportFormat;

  label: string;

  description: string;

  icon: string;

  enabled: boolean;
}