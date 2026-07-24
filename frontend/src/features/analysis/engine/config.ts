export const SCORING_CONFIG = {
  missing: {
    highThreshold: 20,
    mediumThreshold: 10,
    lowThreshold: 5,

    highPenalty: 25,
    mediumPenalty: 15,
    lowPenalty: 8,
  },

  duplicates: {
    penalty: 10,
  },

  outliers: {
    highThreshold: 100,
    mediumThreshold: 25,

    highPenalty: 15,
    mediumPenalty: 8,
  },

  correlation: {
    threshold: 15,
    penalty: 10,
  },

  distribution: {
    normalThreshold: 0.30,
    penalty: 5,
  },

  confidence: {
    minimum: 60,
    maximum: 99,
  },
} as const;