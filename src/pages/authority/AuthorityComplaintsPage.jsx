import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye } from 'react-icons/fa';
import { departmentComplaints, departmentNames } from '../../data/authorityData.js';

const AuthorityComplaintsPage = ({ currentUser, t }) => {
  const navigate = useNavigate();
  const department = currentUser?.department;
  const complaints = departmentComplaints[department] || [];
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === filter.toLowerCase());
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.id.toLowerCase().includes(term) ||
        c.userName.toLowerCase().includes(term) ||
        c.issueLocation.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.issueDate) - new Date(a.issueDate);
      } else if (sortBy === 'oldest') {
        return new Date(a.issueDate) - new Date(b.issueDate);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      return 0;
    });

    return filtered;
  }, [complaints, filter, searchTerm, sortBy]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return '#6b7280';
      case 'Acknowledged': return '#3b82f6';
      case 'In Progress': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const stats = {
    total: complaints.length,
    reported: complaints.filter(c => c.status === 'Reported').length,
    acknowledged: complaints.filter(c => c.status === 'Acknowledged').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  return (
    <div className="authority-complaints-container">
      <div className="page-header">
        <h2>{departmentNames[department]} - All Complaints</h2>
        <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats Summary */}
      <div className="complaints-summary glass-card">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Reported:</span>
            <span className="stat-value" style={{ color: '#6b7280' }}>{stats.reported}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Acknowledged:</span>
            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.acknowledged}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">In Progress:</span>
            <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.inProgress}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Resolved:</span>
            <span className="stat-value" style={{ color: '#10b981' }}>{stats.resolved}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="complaints-filters glass-card">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="reported">Reported</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="progress">Progress</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search by ID, name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Complaints Table */}
      <div className="complaints-table-container glass-card">
        {filteredComplaints.length === 0 ? (
          <div className="no-complaints">
            <p>No complaints found matching your criteria.</p>
          </div>
        ) : (
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen Name</th>
                <th>Location</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td className="complaint-id">{complaint.id}</td>
                  <td>{complaint.userName}</td>
                  <td>{complaint.issueLocation}</td>
                  <td>{complaint.issueDate}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(complaint.status),
                        color: 'white'
                      }}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${complaint.progress}%`,
                            backgroundColor: getStatusColor(complaint.status)
                          }}
                        />
                      </div>
                      <span className="progress-text">{complaint.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/authority/complaint/${complaint.id}`)}
                    >
                      <FaEye /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuthorityComplaintsPage;