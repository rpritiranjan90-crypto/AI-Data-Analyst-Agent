import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-slate-900">404</h1>

      <p className="text-slate-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/dashboard"
        className="rounded-lg bg-slate-900 px-4 py-2 text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}