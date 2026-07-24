import type { AIReport } from "../report/types";
import type { ExportFormat } from "./types";

export const markdownExporter: ExportFormat = {
  name: "Markdown",

  extension: "md",

  mimeType: "text/markdown",

  generate(report: AIReport) {
    return `# ${report.title}

Generated: ${report.generatedAt}

---

## Executive Summary

${report.executiveSummary}

---

## Dataset Health

${report.datasetHealth}

---

## Feature Engineering

${report.featureEngineering}

---

## Model Recommendations

${report.modelRecommendations}

---

## Conclusion

${report.conclusion}
`;
  },
};