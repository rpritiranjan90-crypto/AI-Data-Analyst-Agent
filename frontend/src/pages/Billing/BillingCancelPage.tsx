import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function BillingCancelPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-[70vh] items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <XCircle className="mx-auto h-16 w-16 text-slate-400" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Checkout cancelled
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          No charge was made. You can try again anytime.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5"
          >
            Back to pricing
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold px-5 py-2.5"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
