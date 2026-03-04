
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import LocationPicker from '../../components/common/LocationPicker';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    type: 'outage',
    description: '',
    location: null
  });
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLocationChange = (location) => {
    setFormData({ ...formData, location });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reportsAPI.create(formData);
      window.showToast('Report submitted successfully!', 'success');
      navigate('/my-reports');
    } catch (error) {
      window.showToast(error.response?.data?.message || 'Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: 'outage', label: 'Power Outage', icon: '⚡', description: 'No electricity in your area' },
    { value: 'low_voltage', label: 'Low Voltage', icon: '📉', description: 'Lights are dimming or flickering' },
    { value: 'damaged_line', label: 'Damaged Line', icon: '🔧', description: 'Damaged power lines or poles' },
    { value: 'billing', label: 'Billing Issue', icon: '💰', description: 'Incorrect or disputed bill' },
    { value: 'other', label: 'Other', icon: '📋', description: 'Any other power-related issue' }
  ];

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
            <h1 className="text-xl font-semibold text-secondary-900">Report Power Issue</h1>
          </div>
          </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Select Issue Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issueTypes.map(type => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium text-secondary-900">{type.label}</span>
                    </div>
                    <p className="text-sm text-secondary-500 mt-1">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Describe the Issue</h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              placeholder="Please describe the issue in detail. Include any relevant information such as:
- When did the issue start?
- Is it affecting only your property or the whole area?
- Any visible damage or hazards?"
              required
            />
            <p className="text-sm text-secondary-500 mt-2">
              Please provide as much detail as possible to help us resolve the issue faster.
            </p>
          </div>

          {/* Location Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Report Location</h2>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                {showMap ? 'Hide Map' : '📍 Select on Map'}
              </button>
            </div>
            
            {showMap ? (
              <LocationPicker
                position={formData.location ? [formData.location.lat, formData.location.lng] : null}
                onLocationChange={handleLocationChange}
                height="350px"
              />
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Click "Select on Map" to pin your exact location on the map. 
                  This helps our technicians find the problem location easily.
                </p>
              </div>
            )}
            
            {formData.location && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                ✅ Location captured: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Report
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ReportIssue;
