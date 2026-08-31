import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, Building, ArrowRight, Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";
import {
  evaluatePassword,
  strengthBarColor,
  strengthLabel,
  type PasswordEvaluation,
} from "../../lib/passwordStrength";

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strength: PasswordEvaluation = useMemo(
    () => evaluatePassword(password),
    [password]
  );

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (strength.score < 2) {
      toast.error(
        strength.score === 0
          ? "Password is too weak. Add a mix of characters and symbols."
          : "Password is too weak. Try a longer password with mixed characters."
      );
      return;
    }
    setLoading(true);
    try {
      // Real backend registration. /auth/register returns { token, user, workspaces }.
      const res = await api.post("/auth/register", {
        email,
        password,
        name,
        workspace_name: company || `${name}'s Workspace`,
      });
      const { token, user, workspaces } = res.data || {};
      // Tokens are now stored in cookies (ada_access + ada_refresh httpOnly).
      // Map backend `name` to our `name` field
      const mappedUser = user
        ? {
            id: user.id,
            email: user.email,
            name: user.name || name,
            role: "Owner" as const,
          }
        : null;
      setAuth(mappedUser!, token, workspaces);
      toast.success("Workspace created. Welcome aboard!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed. Please try again.";
      toast.error(typeof detail === "string" ? detail : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <Sparkles size={14} className="text-amber-300 animate-pulse" /> 14-Day Free Enterprise Trial
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Create Workspace</h1>
          <p className="text-xs text-slate-400 font-semibold">Start building AI dashboards & multi-database queries</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Company / Organization</label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corporation"
                  autoComplete="organization"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-describedby="password-strength-label password-strength-checks"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              {password.length > 0 && (
                <div className="mt-2 space-y-2" aria-live="polite">
                  {/* 4-segment strength bar */}
                  <div
                    id="password-strength-label"
                    className="flex items-center gap-2"
                    role="status"
                  >
                    <div className="flex-1 grid grid-cols-4 gap-1" aria-hidden="true">
                      {[0, 1, 2, 3].map((seg) => {
                        const filled = strength.score >= seg + 1;
                        return (
                          <div
                            key={seg}
                            className={`h-1.5 rounded-full transition-colors ${
                              filled ? strengthBarColor(strength.score) : "bg-slate-700/60"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 min-w-[5.5rem] text-right">
                      {strengthLabel(strength.score)}
                    </span>
                  </div>

                  {/* Checklist of missing requirements */}
                  <ul
                    id="password-strength-checks"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px]"
                  >
                    {strength.checks.map((c) => (
                      <li
                        key={c.label}
                        className={`flex items-center gap-1.5 ${
                          c.passed ? "text-emerald-400" : "text-slate-500"
                        }`}
                      >
                        {c.passed ? (
                          <Check size={11} className="shrink-0" />
                        ) : (
                          <X size={11} className="shrink-0" />
                        )}
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
              {loading ? "Creating..." : "Create Enterprise Account"} <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 font-semibold">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
