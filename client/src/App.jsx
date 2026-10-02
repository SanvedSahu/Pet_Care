import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Public & Auth Pages
import LoginPage from './pages/auth/LoginPage';
import MarketplacePage from './pages/public/MarketplacePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderApprovalPage from './pages/admin/ProviderApprovalPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AllAppointmentsPage from './pages/admin/AllAppointmentsPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MarketplacePage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/login" element={<LoginPage />} />

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
      <Route path="*" element={<Navigate to="/marketplace" replace />} />
    </Routes>
  );
}

export default App;
