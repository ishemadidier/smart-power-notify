import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await notificationsAPI.getAll(params);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'emergency':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' };
      case 'planned':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📅' };
      case 'maintenance':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🔧' };
      case 'restoration':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: '⚡' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📢' };
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="p-2 mr-4 text-secondary-500 hover:text-secondary-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-secondary-900">Notifications</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'emergency', 'planned', 'maintenance', 'restoration'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-secondary-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => {
              const styles = getTypeStyles(notification.type);
              return (
                <div key={notification._id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${styles.bg}`}>
                        <span className="text-2xl">{styles.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.bg} ${styles.text}`}>
                            {notification.type}
                          </span>
                          {notification.status === 'active' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          {notification.title}
                        </h3>
                        <p className="text-secondary-600 mb-4">{notification.message}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{notification.area?.district}, {notification.area?.province}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {new Date(notification.startTime).toLocaleString()} - {new Date(notification.endTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Notifications</h3>
            <p className="text-secondary-500">There are no notifications matching your filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
