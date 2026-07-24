import {
  Download,
  FileCode,
  FileText,
  Globe,
} from "lucide-react";

import Button from "../../../../components/ui/Button";

import { useAIReport } from "../../hooks/useAIReport";
import { downloadJSON } from "../../utils/download";

export default function ExportActions() {
  const report = useAIReport();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        onClick={() =>
          downloadJSON(
            "ai-analysis-report.json",
            report
          )
        }
      >
        <Download
          size={16}
          className="mr-2"
        />
        Export PDF
      </Button>

      <Button variant="secondary">
        <Globe
          size={16}
          className="mr-2"
        />
        Export HTML
      </Button>

      <Button variant="secondary">
        <FileCode
          size={16}
          className="mr-2"
        />
        Export Markdown
      </Button>

      <Button
        variant="secondary"
        onClick={() =>
          downloadJSON(
            "ai-analysis-report.json",
            report
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