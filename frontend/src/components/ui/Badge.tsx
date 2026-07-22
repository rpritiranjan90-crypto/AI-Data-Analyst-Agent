import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
}

const badgeColors = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  color = "gray",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeColors[color]}`}
    >
      {children}
    </span>
  );
}