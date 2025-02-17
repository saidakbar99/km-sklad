import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./pages/LoginPage";
import ProtectedRoute, { DefaultRedirect } from "./components/ProtectedRoute";
import SerialGenerationPage from "./pages/SerialGenerationPage";
import GeneratedSerialsPage from "./pages/GeneratedSerialsPage";
import RecieveInvoiceDetailsPage from "./pages/RecieveInvoiceDetailsPage";
import RealeseFurniturePage from "./pages/RealeseFurniturePage";
import StorageBalancePage from "./pages/StorageBalancePage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceCreationPage from "./pages/InvoiceCreationPage";
import RecieveInvoicePage from "./pages/RecieveInvoicePage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/generation"
        element={
          <ProtectedRoute allowedRoles={['sklad_rahbari', 'admin', 'seh_brigadir']}>
            <SerialGenerationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generated"
        element={
          <ProtectedRoute allowedRoles={['sklad_rahbari', 'admin', 'seh_brigadir']}>
            <GeneratedSerialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice/:id"
        element={
          <ProtectedRoute allowedRoles={['sklad_rahbari', 'admin']}>
            <RecieveInvoiceDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/release"
        element={
          <ProtectedRoute allowedRoles={['sklad_rahbari', 'security', 'admin']}>
            <RealeseFurniturePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance"
        element={
          <ProtectedRoute allowedRoles={['sklad_rahbari', 'admin']}>
            <StorageBalancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice"
        element={
          <ProtectedRoute allowedRoles={['admin', 'seh_brigadir']}>
            <InvoicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-creation"
        element={
          <ProtectedRoute allowedRoles={['admin', 'seh_brigadir']}>
            <InvoiceCreationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recieve"
        element={
          <ProtectedRoute allowedRoles={['admin', 'sklad_rahbari']}>
            <RecieveInvoicePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
    <ToastContainer />
  </Router>
);
export default App;