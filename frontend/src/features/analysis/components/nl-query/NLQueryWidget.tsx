import { useState, useRef } from "react";
import { MessageSquare, Sparkles, Send, Code, Table, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Spinner from "../../../../components/ui/Spinner";
import { runNaturalLanguageQuery } from "../../../../services/analysisService";

export default function NLQueryWidget() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  const sampleChips = [
    "Show top 10 records",
    "List missing values per column",
    "Show highest records by first numeric column",
  ];

  function toggleVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... Speak your CSV question now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        toast.success(`Voice captured: "${transcript}"`);
        handleSearch(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Voice input error. Please try again.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      toast.error("Failed to start voice recognition.");
      setIsListening(false);
    }
  }

  async function handleSearch(qToRun?: string) {
    const q = qToRun || query;
    if (!q.trim()) return;

    try {
      setLoading(true);
      const res = await runNaturalLanguageQuery(q.trim());
      setQueryResult(res);
      toast.success("Query executed!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to execute query");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-indigo-900/50 shadow-xl">
      <div className="flex items-center justify-between border-b border-indigo-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400 border border-indigo-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Talk to your CSV (Natural Language Query)</h3>
            <p className="text-xs text-slate-400">Ask any question in plain English or voice & convert to DuckDB SQL</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          DuckDB Engine Active
        </span>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold text-[11px]">Suggested:</span>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(chip);
              handleSearch(chip);
            }}
            className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Bar with Mic Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MessageSquare size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. Show top 10 records sorted by column..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? "Stop Voice Input" : "Speak Query"}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition ${
              isListening
                ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
        </div>
        <Button onClick={() => handleSearch()} disabled={loading || !query.trim()} variant="primary">
          {loading ? <Spinner size={16} /> : <Send size={15} />}
        </Button>
      </div>

      {/* Results Box */}
      {queryResult && (
        <div className="mt-4 space-y-4 rounded-xl border border-indigo-900/60 bg-slate-900/90 p-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-indigo-300">{queryResult.summary}</span>
            {queryResult.code && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                <Code size={12} /> {queryResult.code}
              </span>
            )}
          </div>

          {Array.isArray(queryResult.data) && queryResult.data.length > 0 ? (
            <div className="overflow-x-auto max-h-60 rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-300 uppercase text-[10px] font-bold sticky top-0">
                  <tr>
                    {Object.keys(queryResult.data[0]).map((col) => (
                      <th key={col} className="px-3 py-2 border-b border-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {queryResult.data.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-800/50">
                      {Object.values(row).map((val: any, cIdx: number) => (
                        <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                          {String(val ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 py-2">
              <Table size={16} /> No tabular records returned for this query.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
