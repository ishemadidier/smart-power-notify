import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: {},
    notifications: {},
    reports: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { usersAPI, notificationsAPI, reportsAPI } = await import('../../services/api');
      const [usersRes, notifRes, reportsRes] = await Promise.all([
        usersAPI.getStats(),
        notificationsAPI.getStats(),
        reportsAPI.getStats()
      ]);
      setStats({
        users: usersRes.data,
        notifications: notifRes.data,
        reports: reportsRes.data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Notifications',
      description: 'Create & manage outage notifications',
      icon: '🔔',
      link: '/admin/create-notification',
      color: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
    },
    {
      title: 'Manage Notifications',
      description: 'View all notifications',
      icon: '📋',
      link: '/admin/notifications',
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
    },
    {
      title: 'Users',
      description: 'Manage registered users',
      icon: '👥',
      link: '/admin/users',
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
    },
    {
      title: 'Reports',
      description: 'Handle user reports',
      icon: '📝',
      link: '/admin/reports',
      color: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30'
    },
    {
      title: 'Analytics',
      description: 'View statistics & insights',
      icon: '📊',
      link: '/admin/analytics',
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-card shadow-lg border-r border-secondary-200 dark:border-dark-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-secondary-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900 dark:text-white">Smart Power</h1>
              <p className="text-xs text-secondary-500 dark:text-dark-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.link}
              to={item.link}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 dark:text-dark-300 hover:bg-secondary-100 dark:hover:bg-dark-200 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-secondary-200 dark:border-dark-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-secondary-500 dark:text-dark-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-secondary-600 dark:text-dark-300 hover:bg-secondary-100 dark:hover:bg-dark-200 rounded-lg transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-dark-card shadow-sm border-b border-secondary-200 dark:border-dark-border">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-secondary-500 dark:text-dark-400">Welcome back! Here's what's happening today.</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">{loading ? '...' : stats.users.totalUsers || 0}</p>
              <p className="text-secondary-500 dark:text-dark-400 text-sm">Total Users</p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">{loading ? '...' : stats.notifications.activeNotifications || 0}</p>
              <p className="text-secondary-500 dark:text-dark-400 text-sm">Active Notifications</p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">{loading ? '...' : stats.reports.pendingReports || 0}</p>
              <p className="text-secondary-500 dark:text-dark-400 text-sm">Pending Reports</p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">{loading ? '...' : stats.reports.resolvedReports || 0}</p>
              <p className="text-secondary-500 dark:text-dark-400 text-sm">Resolved Reports</p>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map(item => (
              <Link
                key={item.link}
                to={item.link}
                className={`${item.color} rounded-xl p-6 transition-all hover:shadow-md`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-secondary-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-dark-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

