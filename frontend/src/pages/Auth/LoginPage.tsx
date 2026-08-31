import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";
import { readAccessCookie } from "../../lib/cookie";
import { isJwtExpired } from "../../lib/jwt";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // C1: synchronous auth check — redirect authenticated users away from /login
  // immediately without waiting for Zustand persist rehydration.
  const cookieToken = readAccessCookie();
  const isCookieAuth = cookieToken && !isJwtExpired(cookieToken);
  if (isCookieAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    try {
      // Real backend auth call. The server sets ada_access + ada_refresh
      // cookies and returns the access token in the body (kept for backwards
      // compat with the localStorage-era frontend).
      const res = await api.post("/auth/login", { email, password });
      const { token, user, workspaces } = res.data;
      // Map backend response to our store shape
      const mappedUser = user
        ? {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: (user.role || "Analyst") as "Owner" | "Admin" | "Data Scientist" | "Analyst" | "Viewer",
          }
        : null;
      setAuth(mappedUser!, token, workspaces);
      toast.success("Welcome back! Authentication successful.");
      navigate("/dashboard");
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid email or password.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
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
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
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
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
              {loading ? "Authenticating..." : "Sign In to Workspace"} <ArrowRight size={16} />
            </Button>
          </form>

          {/* Social OAuth Buttons (placeholder; backend SSO endpoints are TBD) */}
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
                disabled
                title="SSO coming soon"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-500 cursor-not-allowed"
              >
                Google SSO
              </button>
              <button
                type="button"
                disabled
                title="SSO coming soon"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-500 cursor-not-allowed"
              >
                GitHub SSO
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
