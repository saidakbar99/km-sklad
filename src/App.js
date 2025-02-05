import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SerialGenerationPage from "./pages/SerialGenerationPage";
import GeneratedSerialsPage from "./pages/GeneratedSerialsPage";
import RecieveFurniturePage from "./pages/RecieveFurniturePage";
import RealeseFurniturePage from "./pages/RealeseFurniturePage";
import StorageBalancePage from "./pages/StorageBalancePage";

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
        path="/generated"
        element={
          <ProtectedRoute>
            <GeneratedSerialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recieve"
        element={
          <ProtectedRoute>
            <RecieveFurniturePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/release"
        element={
          <ProtectedRoute>
            <RealeseFurniturePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance"
        element={
          <ProtectedRoute>
            <StorageBalancePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/generated" replace />} />
    </Routes>
    <ToastContainer />
  </Router>
);
export default App;