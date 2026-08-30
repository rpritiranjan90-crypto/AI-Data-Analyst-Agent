import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { confirmCheckout } from "../../api/billing";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

export default function BillingSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Missing checkout session id.");
      return;
    }

    (async () => {
      try {
        const result = await confirmCheckout(sessionId);
        if (user) {
          setAuth({ ...user }, useAuthStore.getState().token || "", useAuthStore.getState().workspaces);
        }
        toast.success(`Workspace upgraded to ${result.plan}!`);
        setStatus("success");
        setTimeout(() => navigate("/settings/workspace"), 2500);
      } catch (err) {
        const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
          || (err as Error).message
          || "Failed to verify checkout";
        setErrorMsg(msg);
        setStatus("error");
      }
    })();
  }, [params, navigate, setAuth, user]);

  return (
    <div className="flex h-[70vh] items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
            <h1 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Verifying your payment…
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              This takes a couple of seconds.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Payment received 🎉
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your workspace is now upgraded. Redirecting you back to the dashboard…
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 text-2xl font-black">
              ✕
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-500">{errorMsg}</p>
            <button
              onClick={() => navigate("/settings/workspace")}
              className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5"
            >
              Back to workspace settings
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
