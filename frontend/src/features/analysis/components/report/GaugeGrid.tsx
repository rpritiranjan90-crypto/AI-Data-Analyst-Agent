import GaugeCard from "./GaugeCard";

interface GaugeGridProps {
  datasetScore: number;
  mlReadiness: number;
  confidence: number;
  datasetHealth: number;
}

export default function GaugeGrid({
  datasetScore,
  mlReadiness,
  confidence,
  datasetHealth,
}: GaugeGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <GaugeCard
        title="Dataset Score"
        value={datasetScore}
      />

      <GaugeCard
        title="ML Readiness"
        value={mlReadiness}
      />

      <GaugeCard
        title="Confidence"
        value={confidence}
      />

      <GaugeCard
        title="Dataset Health"
        value={datasetHealth}
      />
    </div>
  );
}