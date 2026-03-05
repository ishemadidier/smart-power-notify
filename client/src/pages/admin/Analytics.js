import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AreaChart from '../../components/common/AreaChart';
import BarChart from '../../components/common/BarChart';
import PieChart from '../../components/common/PieChart';

const Analytics = () => {
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

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-secondary-900">{loading ? '...' : value || 0}</p>
      <p className="text-secondary-500 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      <aside className="w-64 bg-white shadow-lg border-r border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900">Smart Power</h1>
              <p className="text-xs text-secondary-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-secondary-100">
            <span>🏠</span> Dashboard
          </Link>
          <Link to="/admin/create-notification" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-secondary-100">
            <span>🔔</span> Notifications
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-secondary-100">
            <span>👥</span> Users
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-secondary-100">
            <span>📝</span> Reports
          </Link>
          <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700">
            <span>📊</span> Analytics
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="px-8 py-4">
            <h1 className="text-xl font-bold text-secondary-900">Analytics Dashboard</h1>
          </div>
        </header>

        <div className="p-8">
          {/* User Stats */}
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.users.totalUsers} icon="👥" color="bg-primary-100" />
            <StatCard title="Active Users" value={stats.users.activeUsers} icon="✅" color="bg-green-100" />
            <StatCard title="Admin Users" value={stats.users.adminUsers} icon="⚙️" color="bg-blue-100" />
          </div>

          {/* Notification Stats */}
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Notification Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Notifications" value={stats.notifications.totalNotifications} icon="🔔" color="bg-red-100" />
            <StatCard title="Active Notifications" value={stats.notifications.activeNotifications} icon="⚡" color="bg-yellow-100" />
            <StatCard title="Resolved Notifications" value={stats.notifications.resolvedNotifications} icon="✅" color="bg-green-100" />
          </div>

          {/* Report Stats */}
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Report Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Reports" value={stats.reports.totalReports} icon="📝" color="bg-purple-100" />
            <StatCard title="Pending Reports" value={stats.reports.pendingReports} icon="⏳" color="bg-yellow-100" />
            <StatCard title="Resolved Reports" value={stats.reports.resolvedReports} icon="✅" color="bg-green-100" />
          </div>

          {/* Charts Section with Graphical Representation */}
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Analytics Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Notifications by Type - Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Notifications by Type</h3>
              {loading ? (
                <div className="h-64 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <BarChart 
                  data={stats.notifications.notificationsByType} 
                  color="#3B82F6" 
                  height={220}
                />
              )}
            </div>

            {/* Reports by Type - Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Reports by Type</h3>
              {loading ? (
                <div className="h-64 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <BarChart 
                  data={stats.reports.reportsByType} 
                  color="#F59E0B" 
                  height={220}
                />
              )}
            </div>

            {/* Notifications by District - Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Districts (Notifications)</h3>
              {loading ? (
                <div className="h-64 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <PieChart 
                  data={stats.notifications.notificationsByDistrict?.slice(0, 6) || []}
                  size={180}
                />
              )}
            </div>

            {/* Reports by District - Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Districts (Reports)</h3>
              {loading ? (
                <div className="h-64 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <PieChart 
                  data={stats.reports.reportsByDistrict?.slice(0, 6) || []}
                  size={180}
                />
              )}
            </div>
          </div>

          {/* Users by Province - Area Chart */}
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Users Distribution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Users by Province</h3>
              {loading ? (
                <div className="h-48 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <AreaChart 
                  data={stats.users.usersByProvince} 
                  color="#10B981" 
                  height={200}
                />
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Users by District</h3>
              {loading ? (
                <div className="h-48 bg-secondary-100 rounded-lg animate-pulse"></div>
              ) : (
                <BarChart 
                  data={stats.users.usersByDistrict?.slice(0, 8) || []} 
                  color="#8B5CF6" 
                  height={200}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
