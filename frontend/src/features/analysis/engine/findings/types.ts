export type FindingType =
  | "success"
  | "warning"
  | "info"
  | "error";

export interface AIFinding {
  type: FindingType;

  title: string;

  description: string;
}