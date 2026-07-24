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
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              Cleaning Score
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {report.summary.score}%
            </h2>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-600">
              Critical
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-700">
              {critical}
            </h2>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-600">
              Warnings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-amber-700">
              {warning}
            </h2>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-600">
              Information
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-700">
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