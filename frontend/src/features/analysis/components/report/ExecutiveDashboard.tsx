import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";

interface ExecutiveDashboardProps {
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

interface SectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor:
    | "green"
    | "blue"
    | "amber"
    | "red"
    | "purple";
  items: string[];
}

function Section({
  title,
  subtitle,
  icon,
  badge,
  badgeColor,
  items,
}: SectionProps) {
  return (
    <Card className="h-full p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3">
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <Badge color={badgeColor}>
          {badge}
        </Badge>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="
              flex
              items-start
              gap-3
              rounded-xl
              bg-slate-50
              p-3
            "
          >
            <Sparkles
              size={16}
              className="mt-1 text-blue-600"
            />

            <span className="leading-6 text-slate-700">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function ExecutiveDashboard({
  strengths,
  risks,
  recommendations,
}: ExecutiveDashboardProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Executive Decision Center
        </h2>

        <p className="mt-1 text-slate-500">
          AI-generated strengths, risks, and recommended
          actions based on the complete dataset analysis.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Strengths"
          subtitle="Positive characteristics"
          badge="Healthy"
          badgeColor="green"
          icon={
            <CheckCircle2
              className="text-emerald-600"
              size={22}
            />
          }
          items={strengths}
        />

        <Section
          title="Risks"
          subtitle="Potential concerns"
          badge="Review"
          badgeColor="amber"
          icon={
            <AlertTriangle
              className="text-amber-600"
              size={22}
            />
          }
          items={risks}
        />

        <Section
          title="Recommendations"
          subtitle="Suggested next steps"
          badge="Priority"
          badgeColor="blue"
          icon={
            <Lightbulb
              className="text-blue-600"
              size={22}
            />
          }
          items={recommendations}
        />
      </div>
    </section>
  );
}