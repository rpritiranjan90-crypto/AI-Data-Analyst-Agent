import Card from "../../../../components/ui/Card";

interface ExecutiveDashboardProps {
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-sm text-slate-700"
          >
            • {item}
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
    <div className="grid gap-6 lg:grid-cols-3">
      <Section
        title="✅ Strengths"
        items={strengths}
      />

      <Section
        title="⚠ Risks"
        items={risks}
      />

      <Section
        title="💡 Recommendations"
        items={recommendations}
      />
    </div>
  );
}