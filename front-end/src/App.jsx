import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Models from "./pages/Models";
import Analytics from "./pages/Analytics";
import AIPrediction from "./pages/AIPrediction";
import CameraView from "./pages/CameraView";
import AutomationLogs from "./pages/AutomationLogs";

function Layout() {
  const location = useLocation();

  // Pages where Navbar & Footer should NOT show
  const hideLayout =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {/* ✅ Show Navbar only after login pages */}
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/models"
          element={
            <ProtectedRoute>
              <Models />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <AIPrediction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cameraview"
          element={
            <ProtectedRoute>
              <CameraView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <AutomationLogs />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Footer also hidden on Home & Login */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
