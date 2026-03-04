import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter !== 'all' ? { isActive: filter } : {};
      const response = await usersAPI.getAll(params);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await usersAPI.update(user._id, { isActive: !user.isActive });
      window.showToast(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchUsers();
    } catch (error) {
      window.showToast('Failed to update user status', 'error');
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setDetailsLoading(true);
    try {
      const response = await usersAPI.getById(user._id);
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      window.showToast('Failed to load user details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700">
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
          <div className="px-8 py-4">
            <h1 className="text-xl font-bold text-secondary-900">Manage Users</h1>
          </div>
        </header>

        <div className="p-8">
          <div className="flex gap-2 mb-6">
            {['all', 'true', 'false'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === status ? 'bg-primary-500 text-white' : 'bg-white text-secondary-600 border border-secondary-200'
                }`}
              >
                {status === 'all' ? 'All' : status === 'true' ? 'Active' : 'Inactive'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 border-b border-secondary-200 animate-pulse">
                  <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Meter #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">{user.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{user.name}</p>
                            <p className="text-sm text-secondary-500">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-600">
                        {user.district}, {user.province}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-600">
                        {user.meterNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="px-3 py-1 text-sm rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              user.isActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-secondary-500">No users found</p>
            </div>
          )}
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary-900">User Details</h2>
                <button
                  onClick={closeModal}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {detailsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : userDetails ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Full Name</p>
                        <p className="font-medium text-secondary-900">{userDetails.name}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Phone Number</p>
                        <p className="font-medium text-secondary-900">{userDetails.phone}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Email</p>
                        <p className="font-medium text-secondary-900">{userDetails.email || 'N/A'}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Meter Number</p>
                        <p className="font-medium text-secondary-900">{userDetails.meterNumber}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Role</p>
                        <p className="font-medium text-secondary-900 capitalize">{userDetails.role}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Status</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          userDetails.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {userDetails.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registration Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Registration Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Province</p>
                        <p className="font-medium text-secondary-900">{userDetails.province}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">District</p>
                        <p className="font-medium text-secondary-900">{userDetails.district}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Sector</p>
                        <p className="font-medium text-secondary-900">{userDetails.sector || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Device Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Current Device Location</h3>
                    {userDetails.currentLocation && userDetails.currentLocation.latitude ? (
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-secondary-500">Latitude</p>
                            <p className="font-medium text-secondary-900">{userDetails.currentLocation.latitude}</p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary-500">Longitude</p>
                            <p className="font-medium text-secondary-900">{userDetails.currentLocation.longitude}</p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary-500">Last Updated</p>
                            <p className="font-medium text-secondary-900">{formatDate(userDetails.currentLocation.timestamp)}</p>
                          </div>
                        </div>
                        <a 
                          href={`https://www.google.com/maps?q=${userDetails.currentLocation.latitude},${userDetails.currentLocation.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          View on Google Maps
                        </a>
                      </div>
                    ) : (
                      <div className="bg-secondary-50 p-4 rounded-lg text-center">
                        <p className="text-secondary-500">No device location available</p>
                        <p className="text-xs text-secondary-400 mt-1">User hasn't logged in with location services enabled</p>
                      </div>
                    )}
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Account Created</p>
                        <p className="font-medium text-secondary-900">{formatDate(userDetails.createdAt)}</p>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        <p className="text-xs text-secondary-500">Last Updated</p>
                        <p className="font-medium text-secondary-900">{formatDate(userDetails.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-secondary-500">Failed to load user details</p>
              )}
            </div>

            <div className="p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

