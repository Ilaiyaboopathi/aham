import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import BannersManager from './pages/BannersManager';
import ProductsManager from './pages/ProductsManager';
import TestimonialsManager from './pages/TestimonialsManager';
import ArticlesManager from './pages/ArticlesManager';
import MediaLibrary from './pages/MediaLibrary';
import UsersManager from './pages/UsersManager';
import AuditLogs from './pages/AuditLogs';
import { getToken, removeToken } from './utils/auth';
import './admin.css';

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          removeToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        removeToken();
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />
      } />
      
      <Route path="/*" element={
        isAuthenticated ? (
          <AdminLayout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard user={user} />} />
              <Route path="/banners" element={<BannersManager />} />
              <Route path="/products" element={<ProductsManager />} />
              <Route path="/testimonials" element={<TestimonialsManager />} />
              <Route path="/articles" element={<ArticlesManager />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/users" element={<UsersManager user={user} />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </AdminLayout>
        ) : (
          <Navigate to="/admin/login" />
        )
      } />
    </Routes>
  );
}

export default AdminApp;