import { useMemo } from "react";

import { useDatasetStore } from "../../../store/datasetStore";
import { useAnalysisData } from "../context/AnalysisContext";
import CleaningEngine from "../engine/cleaning/CleaningEngine";

export function useCleaningReport() {
  const analysis = useAnalysisData();
  const { dataset } = useDatasetStore();

  return useMemo(() => {
    if (!dataset) {
      return null;
    }

    return CleaningEngine.analyze({
      analysis,
      metadata: {
        rows: dataset.metadata.rows,
        missing_values: dataset.metadata.missing_values,
        duplicate_rows: dataset.metadata.duplicate_rows,
      },
    });
  }, [analysis, dataset]);
}