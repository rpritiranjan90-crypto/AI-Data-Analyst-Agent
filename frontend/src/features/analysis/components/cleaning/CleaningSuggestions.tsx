import { Sparkles } from "lucide-react";

import Card from "../../../../components/ui/Card";
import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import type { CleaningReport } from "../../engine/cleaning/types";

import SuggestionCard from "./SuggestionCard";

interface CleaningSuggestionsProps {
  report: CleaningReport;
}

export default function CleaningSuggestions({
  report,
}: CleaningSuggestionsProps) {
  if (report.suggestions.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Sparkles}
          title="No Cleaning Required"
          description="Excellent! No significant data quality issues were detected. Your dataset is ready for advanced analytics and machine learning."
        />
      </Card>
    );
  }

  const critical = report.suggestions.filter(
    (item) => item.priority === "critical"
  ).length;

  const warning = report.suggestions.filter(
    (item) => item.priority === "warning"
  ).length;

  const info = report.suggestions.filter(
    (item) => item.priority === "info"
  ).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sparkles}
        title="AI Cleaning Assistant"
        subtitle="AI-generated recommendations to improve data quality before analytics and machine learning."
      />

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Cleaning Score
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              {report.summary.score}%
            </h2>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 p-5">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Critical
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-red-700 dark:text-red-400">
              {critical}
            </h2>
          </div>

          <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/50 p-5">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Warnings
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-amber-700 dark:text-amber-400">
              {warning}
            </h2>
          </div>

          <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/50 p-5">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Information
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
              {info}
            </h2>
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        {report.suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
          />
        ))}
      </div>
    </div>
  );
}