import {
  Lightbulb,
  Sparkles,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type {
  CleaningSuggestion,
} from "../../engine/cleaning/types";

import PriorityBadge from "./PriorityBadge";

interface SuggestionCardProps {
  suggestion: CleaningSuggestion;
}

export default function SuggestionCard({
  suggestion,
}: SuggestionCardProps) {
  return (
    <Card className="border border-slate-200 hover:border-violet-200 transition-all duration-200">
      <div className="space-y-5">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-lg font-bold text-slate-900">
              {suggestion.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600 leading-6">
              {suggestion.description}
            </p>

          </div>

          <PriorityBadge
            priority={suggestion.priority}
          />

        </div>

        <div className="rounded-xl bg-violet-50 p-4">

          <div className="flex items-center gap-2">

            <Sparkles
              size={18}
              className="text-violet-600"
            />

            <span className="font-semibold text-slate-900">
              Recommendation
            </span>

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {suggestion.recommendation}
          </p>

        </div>

        <div className="rounded-xl bg-emerald-50 p-4">

          <div className="flex items-center gap-2">

            <Lightbulb
              size={18}
              className="text-emerald-600"
            />

            <span className="font-semibold text-slate-900">
              Expected Impact
            </span>

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {suggestion.impact}
          </p>

        </div>

        {suggestion.affectedColumns.length > 0 && (

          <div>

            <p className="mb-3 font-semibold text-slate-800">
              Affected Columns
            </p>

            <div className="flex flex-wrap gap-2">

              {suggestion.affectedColumns.map(
                (column) => (
                  <span
                    key={column}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {column}
                  </span>
                ),
              )}

            </div>

          </div>

        )}

      </div>
    </Card>
  );
}