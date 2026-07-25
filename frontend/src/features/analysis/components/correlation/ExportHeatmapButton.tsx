import { Download } from "lucide-react";

interface ExportHeatmapButtonProps {
  targetId: string;
}

export default function ExportHeatmapButton({
  targetId,
}: ExportHeatmapButtonProps) {
  const handleExport = async () => {
    const element = document.getElementById(targetId);

    if (!element) {
      return;
    }

    alert(
      "PNG export will be connected after we integrate html-to-image in the next sprint."
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
    >
      <Download size={18} />
      Export PNG
    </button>
  );
}