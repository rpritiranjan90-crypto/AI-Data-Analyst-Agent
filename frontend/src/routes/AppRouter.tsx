import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AnalysisPage from "../features/analysis/pages/AnalysisPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import UploadPage from "../pages/Upload/UploadPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
    <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/cleaning" element={<div>Data Cleaning (Coming Soon)</div>} />

        <Route path="/visualization" element={<div>Visualization (Coming Soon)</div>} />

        <Route path="/recommendation" element={<div>Recommendations (Coming Soon)</div>} />

        <Route path="/machine-learning" element={<div>Machine Learning (Coming Soon)</div>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}