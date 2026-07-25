import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Terms & Conditions (Terms of Service)"
        subtitle="Last updated: January 2026. Terms governing the use of AI Data Analyst Agent."
      />

      <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AI Data Analyst Agent platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Acceptable Use</h2>
          <p>
            You agree not to upload datasets that contain unlawful material, malware, or malicious code designed to disrupt system infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Machine Learning & Analytical Disclaimer</h2>
          <p>
            Insights, predictive models, and cleaning suggestions are generated algorithmically. Users are responsible for verifying critical statistical results before making financial or business decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
          <p>
            AI Data Analyst Agent and its developers shall not be liable for any indirect, incidental, or consequential damages resulting from data loss or analytical inaccuracies.
          </p>
        </section>
      </Card>
    </div>
  );
}
