import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CookieBanner from "../components/common/CookieBanner";
import BugReportModal from "../components/feedback/BugReportModal";
import { Bug } from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification Provider */}
      <Toaster position="top-right" richColors closeButton />

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>

          {/* Footer with Legal & Feedback links */}
          <footer className="mx-auto max-w-7xl w-full mt-12 border-t border-slate-200/80 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} AI Data Analyst Agent. All rights reserved.</p>

            <div className="flex items-center gap-6 font-semibold">
              <Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-blue-600">Terms of Service</Link>
              <button
                onClick={() => setBugModalOpen(true)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
              >
                <Bug size={14} /> Report Bug / Feedback
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}