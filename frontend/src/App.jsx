
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CommunityPage from "./pages/CommunityPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";
import BuilderPage from "./pages/BuilderPage";
import SettingsPage from "./pages/SettingsPage";
import PreviewPage from "./pages/PreviewPage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop, { ScrollToTopButton } from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />

      {/* Application Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/forgot"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/community"
          element={<CommunityPage />}
        />

        <Route path="/pricing" element={<PricingPage />} />

        {/* Project Preview */}
        <Route
          path="/preview/:id"
          element={<PreviewPage />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Project Builder */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
      <ScrollToTopButton/>
    </>
  );
};

export default App;
