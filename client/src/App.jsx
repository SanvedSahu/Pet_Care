import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & Auth Pages
import HomePage from './pages/public/HomePage';
import MarketplacePage from './pages/public/MarketplacePage';
import ProviderProfilePage from './pages/public/ProviderProfilePage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyPetsPage from './pages/owner/MyPetsPage';
import MyAppointmentsPage from './pages/owner/MyAppointmentsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderApprovalPage from './pages/admin/ProviderApprovalPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AllAppointmentsPage from './pages/admin/AllAppointmentsPage';

function App() {
  return (
    <Routes>
      {/* Public Pages with MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Standalone Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Pet Owner Protected Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['PET_OWNER', 'ADMIN']}>
              <OwnerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="pets" element={<MyPetsPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="providers" element={<ProviderApprovalPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="appointments" element={<AllAppointmentsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
