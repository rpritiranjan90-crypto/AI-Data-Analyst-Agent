interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

const variants = {
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  danger: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  neutral: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

export default function StatusBadge({
  label,
  variant = "neutral",
}: StatusBadgeProps) {
  const style = variants[variant];

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${style.bg}
        ${style.text}
        ${style.border}
      `}
    >
      {label}
    </span>
  );
}