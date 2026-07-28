import { useState } from "react";
import { HelpCircle, BookOpen, Code, Terminal, Zap, Sparkles, ExternalLink } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");

  const categories = ["Getting Started", "Keyboard Shortcuts", "API Reference", "Security & Privacy", "Troubleshooting FAQ"];

  const shortcuts = [
    { key: "Ctrl + K / Cmd + K", desc: "Open Enterprise Command Palette" },
    { key: "Ctrl + / / Cmd + /", desc: "Toggle Floating AI Copilot Drawer" },
    { key: "⚡ Button", desc: "Trigger 12-Step Autonomous AI Workflow" },
    { key: "Esc", desc: "Close Active Modals or Drawers" },
  ];

  const faqs = [
    { q: "What dataset file formats are supported?", a: "CSV, XLSX, XLS, and direct database queries via PostgreSQL, MySQL, DuckDB, and Snowflake connections." },
    { q: "How is my dataset data kept secure?", a: "Datasets are processed in-memory with DuckDB. We enforce magic byte validation, DDE formula escaping, and OWASP security headers." },
    { q: "Can I export reports to PowerPoint?", a: "Yes, click 'Export PowerPoint (.pptx)' in Reports or Analysis Studio to generate editable multi-slide executive board decks." },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Support"
        title="Help Center, API Docs & Developer Resources"
        subtitle="Comprehensive product documentation, keyboard shortcuts reference, OpenAPI developer guides, and troubleshooting support."
      />

      {/* Categories Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Getting Started Section */}
      {activeCategory === "Getting Started" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2.5 text-indigo-600 dark:text-indigo-400 w-fit">
              <Zap size={22} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">1. Import Your Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Upload a CSV/XLSX file or connect your SQL database. Magic byte validation ensures instant clean ingestion.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2.5 text-indigo-600 dark:text-indigo-400 w-fit">
              <Sparkles size={22} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">2. Run AI Workflow</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Click "⚡ Run AI Analysis" in the top header to launch our 12-Step Multi-Agent AI Swarm analysis pipeline.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2.5 text-indigo-600 dark:text-indigo-400 w-fit">
              <BookOpen size={22} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">3. Export Board Decks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Generate editable PowerPoint (.pptx) slide decks or server-compiled PDF reports with 1 click.
            </p>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Section */}
      {activeCategory === "Keyboard Shortcuts" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal size={18} className="text-indigo-600 dark:text-indigo-400" /> Platform Keyboard Shortcuts
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {shortcuts.map((sc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{sc.desc}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-900 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                  {sc.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Reference & Troubleshooting */}
      {(activeCategory === "API Reference" || activeCategory === "Troubleshooting FAQ" || activeCategory === "Security & Privacy") && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Code size={18} className="text-indigo-600 dark:text-indigo-400" /> Developer OpenAPI Docs & Troubleshooting FAQ
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle size={14} className="text-indigo-600 dark:text-indigo-400" /> {faq.q}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-5">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <a
              href="https://ai-data-analyst-agent-xs7p.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open Interactive Swagger API Reference (/docs) <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
