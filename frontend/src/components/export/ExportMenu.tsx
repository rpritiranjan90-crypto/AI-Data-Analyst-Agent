import {
  Download,
  FileSpreadsheet,
  FileText,
  FileImage,
  FileCode2,
} from "lucide-react";

import type { ExportFormat } from "../../types/export";

interface ExportMenuProps {
  onSelect: (format: ExportFormat) => void;
}

const options: {
  id: ExportFormat;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "pdf",
    title: "PDF Report",
    description: "Executive printable report",
    icon: <FileText size={20} />,
  },
  {
    id: "excel",
    title: "Excel Workbook",
    description: "Export tables to Excel",
    icon: <FileSpreadsheet size={20} />,
  },
  {
    id: "csv",
    title: "CSV Dataset",
    description: "Raw tabular data",
    icon: <FileSpreadsheet size={20} />,
  },
  {
    id: "png",
    title: "PNG Image",
    description: "Charts & dashboard snapshot",
    icon: <FileImage size={20} />,
  },
  {
    id: "markdown",
    title: "Markdown",
    description: "AI report in Markdown",
    icon: <FileCode2 size={20} />,
  },
];

export default function ExportMenu({
  onSelect,
}: ExportMenuProps) {
  return (
    <div className="w-80 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-2xl shadow-slate-900/20">
      <div className="mb-2 flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800">
        <Download
          size={18}
          className="text-blue-600 dark:text-blue-400"
        />

        <h3 className="font-black text-black dark:text-white text-sm">
          Export Options
        </h3>
      </div>

      <div className="space-y-1 mt-2">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              console.log("Export option selected:", item.id);
              onSelect(item.id);
            }}
            className="
              flex
              w-full
              items-center
              gap-3.5
              rounded-xl
              p-2.5
              text-left
              transition-all
              duration-200
              hover:bg-blue-50 dark:hover:bg-slate-800
              hover:border-blue-200
              border border-transparent
            "
          >
            <div className="rounded-xl bg-blue-50 dark:bg-slate-800 p-2.5 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 shrink-0">
              {item.icon}
            </div>

            <div>
              <p className="font-extrabold text-black dark:text-white text-xs">
                {item.title}
              </p>

              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}