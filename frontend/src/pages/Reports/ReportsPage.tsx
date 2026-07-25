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
  const { dataset } = useDatasetStore();
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
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <FileText size={48} className="mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No Active Dataset</h3>
          <p className="mt-1 text-sm text-slate-500">
            Please upload a dataset first to generate reports and AI insights.
          </p>
          <Link to="/upload" className="mt-6">
            <Button variant="primary">Upload Dataset</Button>
          </Link>
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} />
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
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-800">
                  <p className="whitespace-pre-line">
                    {typeof insights === "string"
                      ? insights
                      : insights.summary || insights.insights || JSON.stringify(insights, null, 2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                Click "Refresh" to synthesize automated AI insights for this dataset.
              </p>
            )}
          </Card>

          {/* Generated Reports Registry */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="text-blue-600" size={20} />
              Generated Report Files
            </h3>

            {reportList.length > 0 ? (
              <div className="space-y-3">
                {reportList.map((rpt: any, idx: number) => {
                  const fname = typeof rpt === "string" ? rpt : rpt.filename || `report_${idx}.pdf`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-red-500" size={22} />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{fname}</p>
                          <p className="text-[10px] text-slate-400">PDF Analytical Report</p>
                        </div>
                      </div>
                      <a
                        href={getReportDownloadUrl(fname)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No PDF reports generated yet. Click "Generate PDF Report" above to create one.
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Chat with Data Assistant (5 Cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col h-[650px]">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AI Data Assistant</h3>
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
                    msg.sender === "user" ? "bg-slate-800" : "bg-blue-600"
                  }`}
                >
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">{msg.time}</span>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <Spinner size={16} /> Thinking...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="mt-4 border-t border-slate-100 pt-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about your dataset..."
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none"
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
