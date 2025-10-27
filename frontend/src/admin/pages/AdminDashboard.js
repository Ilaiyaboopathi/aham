import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { UsersIcon, DocumentTextIcon, PhotoIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    banners: 0,
    products: 0,
    testimonials: 0,
    articles: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [banners, products, testimonials, articles, logs] = await Promise.all([
        apiRequest('/api/admin/banners'),
        apiRequest('/api/admin/products'),
        apiRequest('/api/admin/testimonials'),
        apiRequest('/api/admin/articles'),
        apiRequest('/api/admin/audit-logs?limit=10')
      ]);

      setStats({
        banners: banners.length,
        products: products.length,
        testimonials: testimonials.length,
        articles: articles.length
      });
      setRecentLogs(logs);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Hero Banners', value: stats.banners, icon: PhotoIcon, color: 'bg-blue-500' },
    { label: 'Loan Products', value: stats.products, icon: DocumentTextIcon, color: 'bg-green-500' },
    { label: 'Testimonials', value: stats.testimonials, icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500' },
    { label: 'Articles', value: stats.articles, icon: UsersIcon, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="admin-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600">Here's what's happening with your CMS today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="admin-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="capitalize">{log.action}</span> in <span className="font-semibold">{log.section}</span>
                  </p>
                  <p className="text-xs text-gray-500">by {log.user_email}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;