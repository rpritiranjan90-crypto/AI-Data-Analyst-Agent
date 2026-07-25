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
    <Card className="border border-slate-200 dark:border-slate-800 hover:border-violet-300 transition-all duration-200">
      <div className="space-y-5">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {suggestion.title}
            </h3>

            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-6 font-medium">
              {suggestion.description}
            </p>

          </div>

          <PriorityBadge
            priority={suggestion.priority}
          />

        </div>

        <div className="rounded-xl bg-violet-50 dark:bg-violet-950/50 p-4 border border-violet-100 dark:border-violet-900/50">

          <div className="flex items-center gap-2">

            <Sparkles
              size={18}
              className="text-violet-600 dark:text-violet-400"
            />

            <span className="font-bold text-slate-900 dark:text-slate-100">
              Recommendation
            </span>

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200 font-medium">
            {suggestion.recommendation}
          </p>

        </div>

        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-100 dark:border-emerald-900/50">

          <div className="flex items-center gap-2">

            <Lightbulb
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
            />

            <span className="font-bold text-slate-900 dark:text-slate-100">
              Expected Impact
            </span>

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200 font-medium">
            {suggestion.impact}
          </p>

        </div>

        {suggestion.affectedColumns.length > 0 && (

          <div>

            <p className="mb-3 font-semibold text-slate-800 dark:text-slate-200">
              Affected Columns
            </p>

            <div className="flex flex-wrap gap-2">

              {suggestion.affectedColumns.map(
                (column) => (
                  <span
                    key={column}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
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