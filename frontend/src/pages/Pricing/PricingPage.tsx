import { useState } from "react";
import { Check, Sparkles, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { toast } from "sonner";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free Analyst",
      tagline: "Perfect for individuals & small dataset exploration",
      priceMonthly: "$0",
      priceYearly: "$0",
      badge: "Free Forever",
      icon: Zap,
      accentColor: "blue",
      features: [
        "Up to 10MB CSV & Excel Uploads",
        "19+ Interactive Chart Visualizations",
        "Basic Data Cleaning (Imputation & Outliers)",
        "Summary Statistical Profiling",
        "Web PDF Report Preview",
      ],
      buttonText: "Current Plan",
      buttonVariant: "secondary" as const,
      highlight: false,
    },
    {
      name: "Pro Analyst",
      tagline: "For professional data analysts & data scientists",
      priceMonthly: "$29",
      priceYearly: "$24",
      badge: "Most Popular",
      icon: Sparkles,
      accentColor: "indigo",
      features: [
        "Up to 100MB CSV & Excel Uploads",
        "Talk to CSV with Speech Recognition Voice Input 🎙️",
        "AutoML Classification & Regression Models",
        "Isolation Forest Anomaly & Fraud Radar 🛡️",
        "Server-Compiled Executive PDF Reports",
        "Priority DuckDB Query Processing",
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "primary" as const,
      highlight: true,
    },
    {
      name: "Enterprise SaaS",
      tagline: "For analytics teams, board presentations & enterprises",
      priceMonthly: "$299",
      priceYearly: "$249",
      badge: "Enterprise",
      icon: Crown,
      accentColor: "purple",
      features: [
        "Unlimited File Uploads & Datasets",
        "1-Click PowerPoint (.pptx) Slide Deck Exporter 📊",
        "Multi-File Dataset Joining & Merging 🔗",
        "Multi-Agent AI Swarm Audits 🤖",
        "Slack & Email Webhook Anomaly Alert Rules 📢",
        "WebSocket Real-Time Collaboration Workspace ⚡",
        "OWASP 5-Pillar Dedicated Security Compliance",
      ],
      buttonText: "Contact Enterprise Sales",
      buttonVariant: "secondary" as const,
      highlight: false,
    },
  ];

  function handleSelectPlan(planName: string) {
    if (planName === "Free Analyst") {
      toast.info("You are currently on the Free Analyst plan.");
    } else {
      toast.success(`Redirecting to ${planName} checkout portal...`);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20">
          <Shield size={14} /> SaaS Subscription Plans
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Flexible Pricing for Analysts & Enterprise Teams
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Scale your automated analytics pipeline from free dataset profiling to multi-agent AI swarms and PowerPoint board decks.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative h-6 w-12 rounded-full bg-slate-300 dark:bg-slate-700 p-0.5 transition-colors"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-indigo-600 shadow-md transition-transform ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
            Yearly Billing <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-extrabold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <Card
              key={plan.name}
              className={`relative flex flex-col justify-between p-6 transition-all duration-300 ${
                plan.highlight
                  ? "border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 dark:bg-slate-900/90 scale-[1.02]"
                  : "border border-slate-200 dark:border-slate-800"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-500 border border-indigo-500/20">
                    <Icon size={22} />
                  </div>
                  {!plan.highlight && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>

                <hr className="border-slate-100 dark:border-slate-800 my-4" />

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant={plan.buttonVariant}
                  onClick={() => handleSelectPlan(plan.name)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
