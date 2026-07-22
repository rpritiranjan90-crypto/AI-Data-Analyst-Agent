import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <h1 className="text-xl font-bold text-slate-900">
            AI Data Analyst
          </h1>
        </div>

        <nav className="p-4">
          <p className="text-sm text-slate-500">
            Sidebar will be added here.
          </p>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Dashboard
          </h2>

          <span className="text-sm text-slate-500">
            Welcome 👋
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}