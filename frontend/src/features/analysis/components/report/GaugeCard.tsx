import { useEffect, useState } from "react";

import Card from "../../../../components/ui/Card";

interface GaugeCardProps {
  title: string;
  value: number;
}

function getStatus(value: number) {
  if (value >= 90) {
    return {
      label: "Excellent",
      color: "#16A34A",
    };
  }

  if (value >= 75) {
    return {
      label: "Good",
      color: "#2563EB",
    };
  }

  if (value >= 50) {
    return {
      label: "Fair",
      color: "#F59E0B",
    };
  }

  return {
    label: "Poor",
    color: "#DC2626",
  };
}

export default function GaugeCard({
  title,
  value,
}: GaugeCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;

    const target = Math.min(Math.max(value, 0), 100);

    const timer = setInterval(() => {
      current += 2;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      setDisplayValue(current);
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const radius = 52;
  const stroke = 10;

  const circumference = 2 * Math.PI * radius;

  const safeValue = Math.min(displayValue, 100);

  const offset =
    circumference -
    (safeValue / 100) * circumference;

  const status = getStatus(safeValue);

  return (
    <Card className="flex flex-col items-center justify-center p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <div className="relative h-36 w-36">
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
        >
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth={stroke}
            fill="none"
          />

          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={status.color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 72 72)"
            style={{
              transition: "stroke-dashoffset 0.1s linear",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            {safeValue}%
          </span>

          <span
            className="mt-1 text-sm font-bold"
            style={{
              color: status.color,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>
    </Card>
  );
}