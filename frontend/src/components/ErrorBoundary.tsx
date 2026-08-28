import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary. Prevents a single uncaught render error from
 * blanking the whole app. Shows a recovery UI with a reload button and a
 * "Reset session" button that clears persisted state (auth + dataset).
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem("ai_analyst_jwt_token");
      localStorage.removeItem("ada-auth-storage");
      localStorage.removeItem("ada-dataset-storage");
    } catch {
      // ignore storage errors (Safari private mode, etc.)
    }
    window.location.href = "/login";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-red-500/30 bg-slate-900/90 p-8 shadow-2xl space-y-5 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mx-auto">
            <AlertTriangle size={28} />
          </div>
          <h1 className="text-2xl font-black">Something went wrong</h1>
          <p className="text-sm text-slate-400">
            An unexpected error broke the page. Your data is safe — reload to try again, or
            reset your session if the problem persists.
          </p>
          {this.state.error?.message ? (
            <pre className="text-left text-[11px] font-mono text-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl p-3 max-h-32 overflow-auto">
              {this.state.error.message}
            </pre>
          ) : null}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="primary" onClick={this.handleReload}>
              <RefreshCw size={14} /> Reload
            </Button>
            <Button variant="secondary" onClick={this.handleReset}>
              Reset session
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
