import {
  CheckCircle2,
  Lightbulb,
  PieChart,
  ShieldCheck,
} from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function AIInsights() {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">
          🤖 AI Insights
        </h3>

        <Badge color="green">Healthy</Badge>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-600" size={22} />

          <div>
            <p className="font-medium text-slate-900">
              Dataset Health
            </p>

            <p className="text-sm text-slate-500">
              Score: 92%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-blue-600" size={22} />

          <div>
            <p className="font-medium text-slate-900">
              Missing Values
            </p>

            <p className="text-sm text-slate-500">
              No missing values detected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PieChart className="text-purple-600" size={22} />

          <div>
            <p className="font-medium text-slate-900">
              Suggested Charts
            </p>

            <p className="text-sm text-slate-500">
              Bar Chart, Pie Chart, Heatmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Lightbulb className="text-amber-500" size={22} />

          <div>
            <p className="font-medium text-slate-900">
              AI Recommendation
            </p>

            <p className="text-sm text-slate-500">
              Dataset is clean and ready for visualization.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}