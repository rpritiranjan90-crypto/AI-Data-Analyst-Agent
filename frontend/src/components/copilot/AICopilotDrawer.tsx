import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, RefreshCw, Volume2, Maximize2, Minimize2, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { runNaturalLanguageQuery } from "../../services/analysisService";
import { useDatasetStore } from "../../store/datasetStore";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  data?: any[];
  code?: string;
}

export default function AICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeDataset = useDatasetStore((state) => state.dataset);

  // Session Memory state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "copilot",
      text: "Hello! I am your AI Data Analyst Copilot. Ask me anything about your loaded dataset, SQL query, correlations, or anomalies!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function toggleVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
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
        toast.info("Listening... Speak your dataset question now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  function speakText(text: string) {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  async function handleSend(textToSend?: string) {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    try {
      setLoading(true);
      const res = await runNaturalLanguageQuery(prompt);
      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: res.summary || "Analysis completed successfully.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        data: Array.isArray(res.data) ? res.data : undefined,
        code: res.code,
      };
      setMessages((prev) => [...prev, copilotMsg]);
      speakText(copilotMsg.text);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: err.response?.data?.detail || "Failed to analyze query. Please try rephrasing.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all duration-200 border border-indigo-400/40"
      >
        <Sparkles size={18} className="animate-pulse text-amber-300" />
        <span>AI Copilot</span>
        {activeDataset && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        )}
      </button>

      {/* Floating Copilot Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-20 right-6 z-50 flex flex-col rounded-2xl border border-indigo-900/60 bg-slate-950 text-white shadow-2xl transition-all duration-300 ${
              isExpanded ? "w-[650px] h-[650px]" : "w-[400px] h-[520px]"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-900/90 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-indigo-600/30 p-2 text-indigo-400 border border-indigo-500/30">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    AI Data Analyst Copilot
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {activeDataset ? `Active: ${activeDataset.metadata.filename}` : "No dataset selected"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Chat Conversation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "copilot" && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 space-y-2 ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {msg.code && (
                      <div className="rounded-lg bg-slate-950 p-2 font-mono text-[10px] text-indigo-300 overflow-x-auto border border-slate-800">
                        {msg.code}
                      </div>
                    )}

                    {msg.data && msg.data.length > 0 && (
                      <div className="overflow-x-auto max-h-40 rounded-lg border border-slate-800 bg-slate-950 p-2">
                        <table className="w-full text-[10px] text-left">
                          <thead className="text-slate-400 uppercase font-bold border-b border-slate-800">
                            <tr>
                              {Object.keys(msg.data[0]).map((col) => (
                                <th key={col} className="px-2 py-1">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {msg.data.slice(0, 5).map((row, rIdx) => (
                              <tr key={rIdx}>
                                {Object.values(row).map((val: any, cIdx) => (
                                  <td key={cIdx} className="px-2 py-1 whitespace-nowrap">{String(val ?? "")}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                      <span>{msg.timestamp}</span>
                      {msg.sender === "copilot" && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-white transition"
                        >
                          <Volume2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="h-7 w-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <RefreshCw size={14} className="animate-spin" /> AI Copilot analyzing dataset...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-800 p-3 bg-slate-900/90 rounded-b-2xl">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask AI Copilot anything..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-3 pr-20 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-1.5 rounded-lg transition ${
                      isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="p-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-500 transition"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
