/**
 * ==========================================================
 * AI Analysis Rules
 * ==========================================================
 * Central configuration for AI engine calculations.
 * ==========================================================
 */

export interface AIRules {
  datasetScore: {
    maxScore: number;
    minScore: number;
    grade: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
  };

  missingValues: {
    lowThreshold: number;
    mediumThreshold: number;
    highThreshold: number;

    lowPenalty: number;
    mediumPenalty: number;
    highPenalty: number;
  };

  outliers: {
    mediumThreshold: number;
    highThreshold: number;

    mediumPenalty: number;
    highPenalty: number;
  };

  correlation: {
    strongThreshold: number;
    penalty: number;
  };

  distribution: {
    normalRatioThreshold: number;
    penalty: number;
  };

  mlReadiness: {
    missingPenalty: number;
    correlationPenalty: number;
    outlierPenalty: number;
  };

  confidence: {
    minimum: number;
    maximum: number;
  };
}

export const AI_RULES: AIRules = {
  datasetScore: {
    maxScore: 100,
    minScore: 0,

    grade: {
      A: 90,
      B: 80,
      C: 70,
      D: 60,
    },
  },

  missingValues: {
    lowThreshold: 5,
    mediumThreshold: 10,
    highThreshold: 20,

    lowPenalty: 8,
    mediumPenalty: 15,
    highPenalty: 25,
  },

  outliers: {
    mediumThreshold: 25,
    highThreshold: 100,

    mediumPenalty: 8,
    highPenalty: 15,
  },

  correlation: {
    strongThreshold: 10,
    penalty: 10,
  },

  distribution: {
    normalRatioThreshold: 0.30,
    penalty: 5,
  },

  mlReadiness: {
    missingPenalty: 5,
    correlationPenalty: 5,
    outlierPenalty: 5,
  },

  confidence: {
    minimum: 60,
    maximum: 99,
  },
};