import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import AdminPortalPage from "../pages/Admin/AdminPortalPage";
import DataFabricPage from "../pages/Fabric/DataFabricPage";
import DecisionCenterPage from "../pages/Decision/DecisionCenterPage";
import ScenarioSimulatorPage from "../pages/Simulator/ScenarioSimulatorPage";
import RAGKnowledgePage from "../pages/Knowledge/RAGKnowledgePage";
import AIGovernancePage from "../pages/Governance/AIGovernancePage";
import ProductionReadinessPage from "../pages/Readiness/ProductionReadinessPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadPage from "../pages/Upload/UploadPage";
import AnalysisPage from "../features/analysis/pages/AnalysisPage";
import CleaningPage from "../pages/Cleaning/CleaningPage";
import VisualizationPage from "../pages/Visualization/VisualizationPage";
import RecommendationPage from "../pages/Recommendation/RecommendationPage";
import MachineLearningPage from "../pages/MachineLearning/MachineLearningPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import PricingPage from "../pages/Pricing/PricingPage";
import PrivacyPolicyPage from "../pages/Legal/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/Legal/TermsOfServicePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing & Auth Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

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
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin" element={<AdminPortalPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}