import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CookieBanner from "../components/common/CookieBanner";
import BugReportModal from "../components/feedback/BugReportModal";
import { Bug } from "lucide-react";

const pageVariants = {
  initial:  { opacity: 0, y: 16, scale: 0.995 },
  animate:  { opacity: 1, y: 0,  scale: 1,     transition: { duration: 0.38, ease: "easeOut" as const } },
  exit:     { opacity: 0, y: -8, scale: 0.997,  transition: { duration: 0.22, ease: "easeIn"  as const } },
};

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans">
      {/* Toast */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          },
        }}
      />

      {/* Cookie Consent */}
      <CookieBanner />

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugModalOpen} onClose={() => setBugModalOpen(false)} />

      {/* Mobile Backdrop */}
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

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="relative flex-1 overflow-y-auto">
          {/* Subtle content area background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100/30 dark:to-slate-900/20 pointer-events-none" />

          <div className="relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col min-h-full">
            <div className="mx-auto max-w-7xl w-full flex-1">
              {/* Page Transition Wrapper */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="mx-auto max-w-7xl w-full mt-12 pt-5 pb-2">
              <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 shadow-md shadow-slate-300/50 dark:shadow-none">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-glow" />
                  <p className="font-bold text-black dark:text-white">
                    © {new Date().getFullYear()} AI Data Analyst Agent · All rights reserved
                  </p>
                </div>

                <div className="flex items-center gap-5 font-bold">
                  <Link to="/privacy-policy" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150">
                    Privacy Policy
                  </Link>
                  <Link to="/terms-of-service" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150">
                    Terms of Service
                  </Link>
                  <button
                    onClick={() => setBugModalOpen(true)}
                    className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-extrabold transition-colors duration-150"
                  >
                    <Bug size={13} /> Report Bug
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}