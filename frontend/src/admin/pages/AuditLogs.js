import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await apiRequest('/api/admin/audit-logs?limit=100');
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.section === filter);

  const sections = [...new Set(logs.map(log => log.section))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
        <p className="text-gray-600 mt-1">Track all changes made to the CMS</p>
      </div>

      <div className="admin-card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Section
          </label>
          <select
            data-testid="filter-section-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="admin-input w-64"
          >
            <option value="all">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Section</th>
                  <th>Action</th>
                  <th>Record ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="text-sm">{log.user_email}</td>
                    <td>
                      <span className="admin-badge admin-badge-success capitalize">
                        {log.section}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${
                          log.action === 'create'
                            ? 'admin-badge-success'
                            : log.action === 'update'
                            ? 'admin-badge-warning'
                            : 'admin-badge-danger'
                        } capitalize`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-gray-500">
                      {log.record_id.slice(-8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;