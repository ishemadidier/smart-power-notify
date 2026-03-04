import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(function() {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      var response = await api.get('/reports');
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(reportId) {
    try {
      await api.put('/reports/' + reportId, { status: 'resolved' });
      fetchReports();
      setSelectedReport(null);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (loading) {
    return React.createElement('div', { className: 'p-6' }, 'Loading...');
  }

  function renderList() {
    return reports.map(function(report) {
      return React.createElement('div', { key: report._id, className: 'bg-white p-4 mb-4 rounded shadow' },
        React.createElement('h3', { className: 'font-bold' }, report.type),
        React.createElement('p', null, report.description),
        React.createElement('button', {
          onClick: function() { setSelectedReport(report); },
          className: 'mt-2 px-3 py-1 bg-blue-500 text-white rounded'
        }, 'Resolve')
      );
    });
  }

  function renderModal() {
    if (!selectedReport) return null;
    return React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center' },
      React.createElement('div', { className: 'bg-white p-6 rounded' },
        React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Resolve Report'),
        React.createElement('button', {
          onClick: function() { handleResolve(selectedReport._id); },
          className: 'px-4 py-2 bg-green-500 text-white rounded mr-2'
        }, 'Mark Resolved'),
        React.createElement('button', {
          onClick: function() { setSelectedReport(null); },
          className: 'px-4 py-2 bg-gray-300 rounded'
        }, 'Close')
      )
    );
  }

  var content = React.createElement('div', { className: 'p-6' },
    React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Manage Reports'),
    reports.length === 0 ? React.createElement('p', null, 'No reports') : renderList(),
    renderModal()
  );

  return content;
};

export default ManageReports;

