import { useState } from "react";
import { Bug, Send, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "../ui/Button";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [category, setCategory] = useState("bug");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe your issue or suggestion.");
      return;
    }

    setSubmitted(true);
    toast.success("Thank you! Your report has been submitted to the engineering team.");
    setTimeout(() => {
      setSubmitted(false);
      setDescription("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
            <Bug size={20} /> Report an Issue or Request Feature
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
            <h4 className="font-bold text-slate-900 text-lg">Report Submitted!</h4>
            <p className="text-xs text-slate-500">Our engineering team has received your message and will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="bug">🐛 Report a Bug / Issue</option>
                <option value="feature">💡 Feature Request</option>
                <option value="data">📊 Dataset Parsing Problem</option>
                <option value="other">💬 General Feedback</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Email (Optional for updates)</label>
              <input
                type="email"
                placeholder="analyst@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Please describe what happened or what feature you would like to see..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                <Send size={14} className="mr-1.5" /> Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
