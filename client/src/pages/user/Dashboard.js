import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI, reportsAPI } from '../../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifRes, reportsRes] = await Promise.all([
        notificationsAPI.getMy(),
        reportsAPI.getMy()
      ]);
      setNotifications(notifRes.data.notifications || []);
      setMyReports(reportsRes.data.reports || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'outage': return '⚡';
      case 'low_voltage': return '📉';
      case 'damaged_line': return '🔧';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-secondary-900">Smart Power</h1>
                <p className="text-xs text-secondary-500">Rwanda Energy Group</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                <p className="text-xs text-secondary-500">{user?.district}, {user?.province}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/notifications"
            className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{notifications.filter(n => n.status === 'active').length}</p>
                <p className="text-sm text-secondary-500">Active Alerts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/report"
            className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">Report</p>
                <p className="text-sm text-secondary-500">Power Issue</p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-reports"
            className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{myReports.length}</p>
                <p className="text-sm text-secondary-500">My Reports</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{myReports.filter(r => r.status === 'resolved').length}</p>
                <p className="text-sm text-secondary-500">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">Recent Notifications</h2>
              <Link to="/notifications" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-secondary-100 rounded-lg"></div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map(notification => (
                    <div key={notification._id} className="p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              notification.type === 'emergency' ? 'bg-red-100 text-red-700' :
                              notification.type === 'planned' ? 'bg-blue-100 text-blue-700' :
                              notification.type === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                          <h3 className="font-medium text-secondary-900">{notification.title}</h3>
                          <p className="text-sm text-secondary-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-secondary-400 mt-2">
                            {new Date(notification.startTime).toLocaleDateString()} - {new Date(notification.endTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-secondary-500 py-8">No notifications yet</p>
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">My Recent Reports</h2>
              <Link to="/my-reports" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-secondary-100 rounded-lg"></div>
                  ))}
                </div>
              ) : myReports.length > 0 ? (
                <div className="space-y-4">
                  {myReports.slice(0, 5).map(report => (
                    <div key={report._id} className="p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTypeIcon(report.type)}</span>
                          <div>
                            <h3 className="font-medium text-secondary-900 capitalize">{report.type.replace('_', ' ')}</h3>
                            <p className="text-sm text-secondary-600 mt-1">{report.description}</p>
                            <p className="text-xs text-secondary-400 mt-2">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary-500 mb-4">No reports submitted yet</p>
                  <Link to="/report" className="btn-primary inline-block">
                    Report an Issue
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
