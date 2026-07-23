interface AnalysisSkeletonProps {
  rows?: number;
  cards?: number;
  showHeader?: boolean;
  showCards?: boolean;
  showChart?: boolean;
}

export default function AnalysisSkeleton({
  rows = 6,
  cards = 4,
  showHeader = true,
  showCards = true,
  showChart = true,
}: AnalysisSkeletonProps) {
  return (
    <div className="animate-pulse space-y-6">
      {showHeader && (
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded-lg bg-slate-200" />
        </div>
      )}

      {showCards && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 h-10 w-10 rounded-xl bg-slate-200" />
              <div className="mb-3 h-4 w-24 rounded bg-slate-200" />
              <div className="mb-2 h-8 w-32 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {showChart && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 h-5 w-48 rounded bg-slate-200" />
          <div className="h-80 rounded-xl bg-slate-200" />
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 h-5 w-40 rounded bg-slate-200" />

        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <div className="h-5 w-1/4 rounded bg-slate-200" />
              <div className="h-5 w-1/5 rounded bg-slate-200" />
              <div className="h-5 w-1/6 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}