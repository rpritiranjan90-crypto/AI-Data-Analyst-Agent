import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CookieBanner from "../components/common/CookieBanner";
import BugReportModal from "../components/feedback/BugReportModal";
import AICopilotDrawer from "../components/copilot/AICopilotDrawer";
import CommandPalette from "../components/ui/CommandPalette";
import AIWorkflowProgressModal from "../features/workflow/AIWorkflowProgressModal";
import { Bug, Zap, Search } from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#080C15] text-[#0F172A] dark:text-slate-100 font-sans relative">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
          },
        }}
      />

      {/* Global AI Copilot Drawer (Floating on every page) */}
      <AICopilotDrawer />

      {/* Enterprise Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onRunWorkflow={() => setWorkflowModalOpen(true)}
      />

      {/* Autonomous AI Workflow Execution Agent Modal */}
      <AIWorkflowProgressModal
        isOpen={workflowModalOpen}
        onClose={() => setWorkflowModalOpen(false)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 max-w-screen-2xl mx-auto flex flex-col min-h-full">
            {/* Global Utility Quick Actions Bar */}
            <div className="mb-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-xs">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <Search size={14} className="text-indigo-500" />
                <span>Quick Search / Navigation</span>
                <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  Ctrl + K
                </kbd>
              </button>

              <button
                onClick={() => setWorkflowModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs shadow-sm hover:scale-105 transition"
              >
                <Zap size={14} className="animate-pulse" /> ⚡ Run AI Analysis
              </button>
            </div>

            <div className="flex-1 page-enter" key={location.pathname}>
              <Outlet />
            </div>

            {/* Clean Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  © {new Date().getFullYear()} AI Data Analyst Agent · Enterprise Platform
                </span>
              </div>

              <div className="flex items-center gap-6 font-medium">
                <Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Terms of Service
                </Link>
                <button
                  onClick={() => setBugModalOpen(true)}
                  className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  <Bug size={13} /> Report Bug
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}