import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export default function Spinner({
  size = 24,
  className = "",
  label,
}: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="animate-spin text-blue-600" size={size} />
      {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
    </div>
  );
}
