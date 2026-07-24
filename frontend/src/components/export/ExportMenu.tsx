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
    <div className="w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center gap-2 px-2 py-2">
        <Download
          size={18}
          className="text-blue-600"
        />

        <h3 className="font-semibold text-slate-900">
          Export
        </h3>
      </div>

      <div className="space-y-1">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              p-3
              text-left
              transition-all
              duration-200
              hover:bg-slate-100
            "
          >
            <div className="rounded-lg bg-slate-100 p-2 text-blue-600">
              {item.icon}
            </div>

            <div>
              <p className="font-medium text-slate-900">
                {item.title}
              </p>

              <p className="text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}