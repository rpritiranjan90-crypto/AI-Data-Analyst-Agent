export type Suitability =
  | "Excellent"
  | "Good"
  | "Fair";

export interface ModelCard {
  rank: number;

  name: string;

  score: number;

  confidence: number;

  suitability: Suitability;

  bestFor: string;

  reason: string;

  recommended: boolean;
}