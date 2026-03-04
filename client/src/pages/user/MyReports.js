import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getMy();
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
      case 'in_progress': return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' };
      case 'resolved': return { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'outage': return '⚡';
      case 'low_voltage': return '📉';
      case 'damaged_line': return '🔧';
      case 'billing': return '💰';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="p-2 mr-4 text-secondary-500 hover:text-secondary-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-secondary-900">My Reports</h1>
            </div>
            <Link
              to="/report"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Report
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-secondary-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map(report => {
              const statusStyle = getStatusColor(report.status);
              return (
                <div key={report._id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{getTypeIcon(report.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 capitalize">
                            {report.type.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-secondary-500">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    
                    <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                      <p className="text-secondary-700">{report.description}</p>
                    </div>

                    {report.adminResponse && (
                      <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-primary-800 mb-1">Admin Response:</p>
                        <p className="text-primary-700">{report.adminResponse}</p>
                      </div>
                    )}

                    {report.status === 'resolved' && report.resolvedAt && (
                      <p className="text-sm text-secondary-500 mt-4 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Resolved on {new Date(report.resolvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Reports Yet</h3>
            <p className="text-secondary-500 mb-6">You haven't submitted any power issue reports yet.</p>
            <Link
              to="/report"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report an Issue
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReports;
