interface LoadingCardProps {
  rows?: number;
  cards?: number;
  showHeader?: boolean;
  showMetrics?: boolean;
  showChart?: boolean;
}

export default function LoadingCard({
  rows = 5,
  cards = 4,
  showHeader = true,
  showMetrics = true,
  showChart = false,
}: LoadingCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="space-y-3">
          <div className="h-8 w-72 rounded-lg shimmer" />
          <div className="h-4 w-96 rounded-lg shimmer" />
        </div>
      )}

      {/* Metric Cards */}
      {showMetrics && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs"
            >
              <div className="mb-5 h-10 w-10 rounded-xl shimmer" />

              <div className="mb-3 h-4 w-24 rounded shimmer" />

              <div className="mb-2 h-8 w-32 rounded shimmer" />

              <div className="h-3 w-20 rounded shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {showChart && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
          <div className="mb-5 h-5 w-48 rounded shimmer" />

          <div className="h-80 rounded-xl shimmer" />
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
        <div className="mb-5 h-5 w-44 rounded shimmer" />

        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="h-5 w-1/4 rounded shimmer" />

              <div className="h-5 w-1/5 rounded shimmer" />

              <div className="h-5 w-1/6 rounded shimmer" />

              <div className="h-5 w-12 rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}