export type Priority = "High" | "Medium" | "Low";

export type Impact = "High" | "Medium" | "Low";

export interface FeatureCard {
  title: string;
  description: string;
  priority: Priority;
  impact: Impact;
  recommended: boolean;
}