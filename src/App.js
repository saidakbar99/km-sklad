import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./components/LoginPage";
import ProtectedRoute, { DefaultRedirect } from "./components/ProtectedRoute";
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
          <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
            <SerialGenerationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generated"
        element={
          <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
            <GeneratedSerialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recieve"
        element={
          <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
            <RecieveFurniturePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/release"
        element={
          <ProtectedRoute allowedRoles={['security', 'admin']}>
            <RealeseFurniturePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance"
        element={
          <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
            <StorageBalancePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
    <ToastContainer />
  </Router>
);
export default App;