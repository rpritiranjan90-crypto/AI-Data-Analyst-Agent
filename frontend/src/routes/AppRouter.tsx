import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import OnboardingTour from "../components/onboarding/OnboardingTour";

// Lazy-loaded routes for bundle optimization
const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("../pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("../pages/Auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const DataFabricPage = lazy(() => import("../pages/Fabric/DataFabricPage"));
const DecisionCenterPage = lazy(() => import("../pages/Decision/DecisionCenterPage"));
const UploadPage = lazy(() => import("../pages/Upload/UploadPage"));
const AnalysisPage = lazy(() => import("../features/analysis/pages/AnalysisPage"));
const CleaningPage = lazy(() => import("../pages/Cleaning/CleaningPage"));
const VisualizationPage = lazy(() => import("../pages/Visualization/VisualizationPage"));
const RecommendationPage = lazy(() => import("../pages/Recommendation/RecommendationPage"));
const MachineLearningPage = lazy(() => import("../pages/MachineLearning/MachineLearningPage"));
const ScenarioSimulatorPage = lazy(() => import("../pages/Simulator/ScenarioSimulatorPage"));
const RAGKnowledgePage = lazy(() => import("../pages/Knowledge/RAGKnowledgePage"));
const AIGovernancePage = lazy(() => import("../pages/Governance/AIGovernancePage"));
const ProductionReadinessPage = lazy(() => import("../pages/Readiness/ProductionReadinessPage"));
const HelpCenterPage = lazy(() => import("../pages/Help/HelpCenterPage"));
const ReportsPage = lazy(() => import("../pages/Reports/ReportsPage"));
const AdminPortalPage = lazy(() => import("../pages/Admin/AdminPortalPage"));
const PricingPage = lazy(() => import("../pages/Pricing/PricingPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/Legal/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("../pages/Legal/TermsOfServicePage"));
const NotFoundPage = lazy(() => import("../pages/NotFound/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading module...</span>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* First-time user onboarding walkthrough */}
      <OnboardingTour />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Application Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/data-fabric" element={<DataFabricPage />} />
            <Route path="/decision-center" element={<DecisionCenterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/cleaning" element={<CleaningPage />} />
            <Route path="/visualization" element={<VisualizationPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/machine-learning" element={<MachineLearningPage />} />
            <Route path="/simulator" element={<ScenarioSimulatorPage />} />
            <Route path="/knowledge" element={<RAGKnowledgePage />} />
            <Route path="/governance" element={<AIGovernancePage />} />
            <Route path="/readiness" element={<ProductionReadinessPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPortalPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}