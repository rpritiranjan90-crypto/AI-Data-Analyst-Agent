import { useState, useEffect } from "react";
import { Cookie, X, Check } from "lucide-react";
import Button from "../ui/Button";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50 rounded-2xl bg-slate-900/95 text-white p-5 shadow-2xl backdrop-blur-md border border-slate-800 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Cookie size={18} /> Cookie & Data Consent
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        We use essential cookies and session storage to persist your dataset state, authentication, and platform preferences.
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button onClick={handleAccept} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs py-1.5 px-4">
          <Check size={14} className="mr-1" /> Accept & Continue
        </Button>
      </div>
    </div>
  );
}
