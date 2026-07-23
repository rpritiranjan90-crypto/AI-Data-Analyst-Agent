export const CHART_CONFIG = {
  height: 320,

  margin: {
    top: 10,
    right: 20,
    bottom: 10,
    left: 10,
  },

  xAxis: {
    tick: {
      fontSize: 12,
    },
  },

  yAxis: {
    tick: {
      fontSize: 12,
    },
  },

  grid: {
    strokeDasharray: "3 3",
    vertical: false,
  },

  bar: {
    radius: [6, 6, 0, 0] as [number, number, number, number],
  },

  line: {
    strokeWidth: 3,
    dot: {
      r: 4,
    },
    activeDot: {
      r: 6,
    },
  },

  pie: {
    outerRadius: "80%",
  },
} as const;