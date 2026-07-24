import {
  Download,
  FileCode,
  FileText,
  Globe,
} from "lucide-react";

import Button from "../../../../components/ui/Button";

import { exporters } from "../../engine/export";
import { useAIReport } from "../../hooks/useAIReport";
import { downloadReport } from "../../utils/download";

export default function ExportActions() {
  const report = useAIReport();

  return (
    <div className="flex flex-wrap gap-3">
      {/* PDF */}
      <Button
        variant="primary"
        onClick={() =>
          downloadReport(
            report,
            exporters.pdf,
            "ai-analysis-report"
          )
        }
      >
        <Download
          size={16}
          className="mr-2"
        />
        Export PDF
      </Button>

      {/* HTML */}
      <Button
        variant="secondary"
        onClick={() =>
          downloadReport(
            report,
            exporters.html,
            "ai-analysis-report"
          )
        }
      >
        <Globe
          size={16}
          className="mr-2"
        />
        Export HTML
      </Button>

      {/* Markdown */}
      <Button
        variant="secondary"
        onClick={() =>
          downloadReport(
            report,
            exporters.markdown,
            "ai-analysis-report"
          )
        }
      >
        <FileCode
          size={16}
          className="mr-2"
        />
        Export Markdown
      </Button>

      {/* JSON */}
      <Button
        variant="secondary"
        onClick={() =>
          downloadReport(
            report,
            exporters.json,
            "ai-analysis-report"
          )
        }
      >
        <FileText
          size={16}
          className="mr-2"
        />
        Export JSON
      </Button>
    </div>
  );
}