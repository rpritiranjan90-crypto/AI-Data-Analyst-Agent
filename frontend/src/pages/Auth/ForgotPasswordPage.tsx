import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import api from "../../api/axios";

type Stage = "request" | "confirm";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { email });
      toast.success(res.data?.message || "If that email is registered, you'll receive a reset link.");
      // M4: Only auto-fill the reset token in development. In production, the token
      // arrives via email and must be manually pasted. Remove entirely once a real email
      // service is configured.
      if (import.meta.env.DEV) {
        const devToken = res.data?.dev_reset_token as string | undefined;
        if (devToken) {
          setResetToken(devToken);
          setStage("confirm");
        }
      }
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not process reset request.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      toast.error("Please fill in the reset token and new password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password/confirm", {
        token: resetToken,
        new_password: newPassword,
      });
      toast.success("Password updated. You can now sign in.");
      navigate("/login");
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Reset failed. The link may have expired.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <KeyRound size={14} /> Account Recovery
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {stage === "request" ? "Reset Your Password" : "Choose a New Password"}
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            {stage === "request"
              ? "Enter your email and we'll send you a reset link."
              : "Paste the token from the email to set a new password."}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          {stage === "request" ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 px-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Reset Token</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste the token from your email"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 px-4 text-xs font-mono font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Type the password again"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
                {loading ? "Updating..." : "Update Password"} <CheckCircle2 size={16} />
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline"
            >
              <ArrowLeft size={12} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
