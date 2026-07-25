import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated: January 2026. Learn how we handle and protect your dataset privacy."
      />

      <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you use the AI Data Analyst Agent platform, we collect information you provide directly, such as uploaded datasets, metadata, report options, and account registration data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Data</h2>
          <p>
            Your uploaded CSV, XLS, and XLSX datasets are processed strictly in-memory or in isolated temporary storage for the sole purpose of generating statistical profiling, data cleaning, interactive charts, and machine learning models.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do NOT sell or share your raw dataset contents with third parties.</li>
            <li>In-memory datasets can be purged at any time using the "Clear Dataset" button.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Data Security</h2>
          <p>
            We implement industry-standard encryption protocols (TLS/HTTPS), role-based access control, and tokenized authorization to prevent unauthorized access to your analytics workspace.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or dataset privacy, please contact our support team at <a href="mailto:support@aianalyst.com" className="text-blue-600 font-semibold underline">support@aianalyst.com</a>.
          </p>
        </section>
      </Card>
    </div>
  );
}
