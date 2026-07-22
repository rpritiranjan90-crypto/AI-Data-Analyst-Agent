interface LoadingCardProps {
  rows?: number;
}

export default function LoadingCard({
  rows = 4,
}: LoadingCardProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 h-4 w-1/3 rounded bg-slate-200" />

          <div className="mb-4 h-8 w-1/2 rounded bg-slate-200" />

          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}