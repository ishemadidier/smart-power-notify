import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Toast from './components/common/Toast';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import UserDashboard from './pages/user/Dashboard';
import Notifications from './pages/user/Notifications';
import ReportIssue from './pages/user/ReportIssue';
import MyReports from './pages/user/MyReports';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import CreateNotification from './pages/admin/CreateNotification';
import ManageNotifications from './pages/admin/ManageNotifications';
import ManageUsers from './pages/admin/ManageUsers';
import ManageReports from './pages/admin/ManageReports';
import Analytics from './pages/admin/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute allowedRoles={['user']}>
              <ReportIssue />
            </ProtectedRoute>
          } />
          <Route path="/my-reports" element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyReports />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/create-notification" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CreateNotification />
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <ManageNotifications />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <ManageReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <Analytics />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
