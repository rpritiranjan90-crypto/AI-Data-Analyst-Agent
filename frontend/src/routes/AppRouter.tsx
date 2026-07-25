import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadPage from "../pages/Upload/UploadPage";
import AnalysisPage from "../features/analysis/pages/AnalysisPage";
import CleaningPage from "../pages/Cleaning/CleaningPage";
import VisualizationPage from "../pages/Visualization/VisualizationPage";
import RecommendationPage from "../pages/Recommendation/RecommendationPage";
import MachineLearningPage from "../pages/MachineLearning/MachineLearningPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import PrivacyPolicyPage from "../pages/Legal/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/Legal/TermsOfServicePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/cleaning" element={<CleaningPage />} />
          <Route path="/visualization" element={<VisualizationPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/machine-learning" element={<MachineLearningPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}