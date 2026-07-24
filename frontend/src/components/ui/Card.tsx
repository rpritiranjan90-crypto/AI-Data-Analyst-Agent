import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_2px_10px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}