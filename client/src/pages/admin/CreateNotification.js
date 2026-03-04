import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';

const rwandaData = {
  provinces: [
    'Kigali City',
    'Northern Province',
    'Southern Province',
    'Eastern Province',
    'Western Province',
    'All'
  ],
  districts: {
    'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
    'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
    'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
    'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
    'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
    'All': ['All']
  }
};

const CreateNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    province: '',
    district: '',
    type: 'planned',
    startTime: '',
    endTime: '',
    sendSMS: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'province') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await notificationsAPI.create({
        title: formData.title,
        message: formData.message,
        area: {
          province: formData.province,
          district: formData.district
        },
        type: formData.type,
        startTime: formData.startTime,
        endTime: formData.endTime,
        sendSMS: formData.sendSMS
      });
      window.showToast('Notification created successfully!', 'success');
      navigate('/admin/notifications');
    } catch (error) {
      window.showToast(error.response?.data?.message || 'Failed to create notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-secondary-200 flex flex-col">
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
          <Link to="/admin/create-notification" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700">
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="px-8 py-4 flex items-center gap-4">
            <Link to="/admin" className="p-2 text-secondary-500 hover:text-secondary-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-secondary-900">Create Notification</h1>
          </div>
        </header>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Planned Power Outage in Kigali"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Enter detailed notification message..."
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['planned', 'emergency', 'maintenance', 'restoration', 'announcement'].map(type => (
                    <label
                      key={type}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                        formData.type === type ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={handleChange}
                      />
                      <span className="capitalize text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Province</option>
                    {rwandaData.provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!formData.province}
                    className="input-field disabled:opacity-50"
                    required
                  >
                    <option value="">Select District</option>
                    {formData.province && rwandaData.districts[formData.province]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* SMS Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="sendSMS"
                  id="sendSMS"
                  checked={formData.sendSMS}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <label htmlFor="sendSMS" className="text-sm text-secondary-700">
                  Send SMS notification to affected users
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Create Notification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateNotification;
