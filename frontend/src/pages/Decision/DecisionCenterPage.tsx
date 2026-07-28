import PageHeader from "../../components/ui/PageHeader";

export default function DecisionCenterPage() {
  const recommendations = [
    {
      id: "1",
      title: "Optimize High-Margin Product Pricing Structure",
      category: "Revenue Growth",
      roi: "+$340,000 / year",
      risk: "Low Risk",
      confidence: "96%",
      timeline: "Q3 2026",
      desc: "Data analysis reveals 18% pricing inelasticity in premium tier products. Adjusting tier 2 pricing yields immediate margin expansion.",
    },
    {
      id: "2",
      title: "Automate Churn Mitigation for Tier 1 Enterprise Accounts",
      category: "Customer Retention",
      roi: "+$210,000 preserved",
      risk: "Medium Risk",
      confidence: "92%",
      timeline: "Immediate (30 Days)",
      desc: "ML Anomaly Radar flagged 14 key accounts with declining query volume. Trigger proactive customer success outreach.",
    },
    {
      id: "3",
      title: "Consolidate Low-Volume Database Instance Allocation",
      category: "Cost Reduction",
      roi: "-$48,000 / year expenses",
      risk: "Low Risk",
      confidence: "98%",
      timeline: "Q4 2026",
      desc: "Query telemetry shows 3 database instances running at under 5% CPU utilization. Consolidate into single multi-tenant cluster.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Decision Center"
        title="Business Decision Center & Strategic AI Advisor"
        subtitle="Prioritized AI-recommended business decisions, expected financial ROI ($), risk assessments, and action timelines."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {recommendations.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {item.confidence} Confidence
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Expected ROI:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{item.roi}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Risk Level:</span>
                <span className="text-slate-800 dark:text-slate-200">{item.risk}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Timeline:</span>
                <span className="text-slate-800 dark:text-slate-200">{item.timeline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
