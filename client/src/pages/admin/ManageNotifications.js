import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await notificationsAPI.getAll(params);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await notificationsAPI.delete(id);
      window.showToast('Notification deleted', 'success');
      fetchNotifications();
    } catch (error) {
      window.showToast('Failed to delete notification', 'error');
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-700';
      case 'planned': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'restoration': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-secondary-100">
            <span>📊</span> Analytics
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 text-secondary-500 hover:text-secondary-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-secondary-900">Manage Notifications</h1>
            </div>
            <Link to="/admin/create-notification" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Notification
            </Link>
          </div>
        </header>

        <div className="p-8">
          <div className="flex gap-2 mb-6">
            {['all', 'active', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === status ? 'bg-primary-500 text-white' : 'bg-white text-secondary-600 border border-secondary-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification._id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeStyles(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          notification.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {notification.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-secondary-900">{notification.title}</h3>
                      <p className="text-secondary-600 mt-2">{notification.message}</p>
                      <div className="flex gap-4 mt-3 text-sm text-secondary-500">
                        <span>📍 {notification.area?.district}, {notification.area?.province}</span>
                        <span>🕐 {new Date(notification.startTime).toLocaleString()} - {new Date(notification.endTime).toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-secondary-500">No notifications found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageNotifications;
