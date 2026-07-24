import {
  ChevronDown,
  Download,
} from "lucide-react";

interface ExportButtonProps {
  onClick?: () => void;

  disabled?: boolean;

  loading?: boolean;
}

export default function ExportButton({
  onClick,
  disabled = false,
  loading = false,
}: ExportButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-blue-600
        px-5
        py-3
        font-semibold
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:bg-blue-700
        hover:shadow-lg
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <Download size={18} />

      {loading ? "Exporting..." : "Export"}

      <ChevronDown size={16} />
    </button>
  );
}