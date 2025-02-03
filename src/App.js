import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SerialGenerationPage from "./pages/SerialGenerationPage";
import GeneratedSerialsPage from "./pages/GeneratedSerialsPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/generation"
        element={
          <ProtectedRoute>
            <SerialGenerationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <GeneratedSerialsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ToastContainer />
  </Router>
);
export default App;