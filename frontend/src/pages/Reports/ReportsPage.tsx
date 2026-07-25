import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Download,
  Send,
  Bot,
  User,
  Zap,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { useDatasetStore } from "../../store/datasetStore";
import {
  generateReport,
  getAIInsights,
  getReportDownloadUrl,
  listReports,
  promptAI,
} from "../../services/reportService";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function ReportsPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportList, setReportList] = useState<any[]>([]);

  // Chat State
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Hello! I am your AI Data Analyst. Ask me anything about your active dataset "${metadata?.filename || "CSV"}".`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    if (metadata) {
      fetchInsights();
      fetchReportsList();
    }
  }, [metadata]);

  function loadDemoDataset() {
    const mockDemo = {
      filename: "HR_Analytics_Demo.csv",
      filepath: "uploads/HR_Analytics_Demo.csv",
      extension: ".csv",
      rows: 1500,
      columns: 5,
      missing_values: 12,
      duplicate_rows: 3,
      memory_usage_mb: 0.12,
      file_size_bytes: 125000,
      column_names: ["employee_id", "age", "salary", "department", "churned"],
      columns_detail: [
        { name: "employee_id", type: "string" },
        { name: "age", type: "number" },
        { name: "salary", type: "number" },
        { name: "department", type: "string" },
        { name: "churned", type: "number" },
      ],
      head: [
        { employee_id: "EMP_001", age: 34, salary: 75000, department: "IT", churned: 0 },
        { employee_id: "EMP_002", age: 42, salary: 92000, department: "Sales", churned: 1 },
      ],
    };
    setDataset({ metadata: mockDemo, success: true, message: "Loaded demo" });
    toast.success("Loaded HR Analytics Demo dataset!");
  }

  async function fetchInsights() {
    try {
      setLoadingInsights(true);
      const res = await getAIInsights();
      setInsights(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  }

  async function fetchReportsList() {
    try {
      const res = await listReports();
      if (res && Array.isArray(res)) {
        setReportList(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerateReport() {
    try {
      setGeneratingReport(true);
      const res = await generateReport();
      toast.success(res.message || "PDF Report generated successfully!");
      fetchReportsList();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Report generation failed");
    } finally {
      setGeneratingReport(false);
    }
  }

  async function handleSendChat() {
    if (!chatPrompt.trim() || chatLoading) return;
    const userMsg = chatPrompt.trim();
    setChatPrompt("");

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      {
        sender: "user",
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setChatHistory(newHistory);

    try {
      setChatLoading(true);
      const res = await promptAI(userMsg);
      const reply = res.response || res.result || res.message || JSON.stringify(res);
      setChatHistory([
        ...newHistory,
        {
          sender: "ai",
          text: typeof reply === "string" ? reply : JSON.stringify(reply, null, 2),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      toast.error("AI Assistant request failed");
      setChatHistory([
        ...newHistory,
        {
          sender: "ai",
          text: "Apologies, I encountered an issue analyzing your query. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Reports & AI Assistant"
          subtitle="Generate PDF reports, explore AI-generated dataset insights, and chat with your data."
        />
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-500 mb-4 border border-indigo-500/20">
            <FileText size={42} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Active Dataset</h3>
          <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-md">
            Please upload a CSV or Excel dataset to compile executive PDF reports and chat with AI insights.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/upload">
              <Button variant="primary">Upload Dataset</Button>
            </Link>
            <Button variant="secondary" onClick={loadDemoDataset} className="flex items-center gap-2">
              <PlayCircle size={16} /> Load Demo Dataset
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Reports & AI Insights"
          subtitle={`Analytical executive summary for: ${metadata.filename}`}
        />
        <Button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
        >
          {generatingReport ? (
            <Spinner size={18} label="Generating..." />
          ) : (
            <>
              <Zap size={18} className="mr-2" />
              Generate PDF Report
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: AI Insights & Report Downloads (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Insights Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
                Executive AI Insights
              </h3>
              <Button size="sm" variant="secondary" onClick={fetchInsights} disabled={loadingInsights}>
                Refresh
              </Button>
            </div>

            {loadingInsights ? (
              <div className="py-12 flex justify-center">
                <Spinner size={28} label="Synthesizing AI dataset insights..." />
              </div>
            ) : insights ? (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <p className="whitespace-pre-line">
                    {typeof insights === "string"
                      ? insights
                      : insights.summary || insights.insights || JSON.stringify(insights, null, 2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                Click "Refresh" to synthesize automated AI insights for this dataset.
              </p>
            )}
          </Card>

          {/* Generated Reports Registry */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
              Generated Report Files
            </h3>

            {reportList.length > 0 ? (
              <div className="space-y-3">
                {reportList.map((rpt: any, idx: number) => {
                  const fname = typeof rpt === "string" ? rpt : rpt.filename || `report_${idx}.pdf`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-red-500" size={22} />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{fname}</p>
                          <p className="text-[10px] text-slate-400">PDF Analytical Report</p>
                        </div>
                      </div>
                      <a
                        href={getReportDownloadUrl(fname)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-slate-700 hover:bg-blue-100 transition"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No PDF reports generated yet. Click "Generate PDF Report" above to create one.
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Chat with Data Assistant (5 Cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col h-[650px]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Data Assistant</h3>
              <p className="text-[10px] text-slate-400">Ask natural language queries</p>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold ${
                    msg.sender === "user" ? "bg-slate-800 dark:bg-slate-700" : "bg-blue-600"
                  }`}
                >
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
                    msg.sender === "user"
                      ? "bg-slate-900 dark:bg-slate-800 text-white rounded-tr-none border border-slate-800 dark:border-slate-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">{msg.time}</span>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
                <Spinner size={16} /> Thinking...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about your dataset..."
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <Button onClick={handleSendChat} disabled={chatLoading || !chatPrompt.trim()}>
              <Send size={15} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
