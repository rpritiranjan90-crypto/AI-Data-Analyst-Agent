import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const [email, setEmail] = useState("analyst@enterprise.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setAuth(
        {
          id: `usr_${Math.random().toString(36).substr(2, 6)}`,
          email,
          name: email.split("@")[0].toUpperCase(),
          role: "Owner",
        },
        "jwt_token_sample_key"
      );
      toast.success("Welcome back! Authentication successful.");
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  }

  function handleGuestPreview() {
    setGuestMode(true);
    toast.info("Entering Guest Preview Mode.");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <Sparkles size={14} className="text-amber-300 animate-pulse" /> Enterprise AI SaaS Platform
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">AI Data Analyst Agent</h1>
          <p className="text-xs text-slate-400 font-semibold">Sign in to your enterprise workspace or try Guest Preview</p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-indigo-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
              {loading ? "Authenticating..." : "Sign In to Workspace"} <ArrowRight size={16} />
            </Button>
          </form>

          {/* Social OAuth Buttons */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-800" />
              <span className="absolute bg-slate-900 px-3 text-[10px] font-bold uppercase text-slate-500">
                Or Continue With
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                Google OAuth
              </button>
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                GitHub OAuth
              </button>
            </div>
          </div>

          {/* Guest Preview Button */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleGuestPreview}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-900/60 transition"
            >
              <CheckCircle2 size={15} /> Enter Guest Preview Mode
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 font-semibold">
          Don't have an enterprise account?{" "}
          <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
            Create Workspace
          </Link>
        </p>
      </div>
    </div>
  );
}
