import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaFilter, FaEye, FaUserCheck, 
  FaCheckCircle, FaHourglassHalf, FaExclamationTriangle,
  FaClock, FaCalendarAlt
} from 'react-icons/fa';
import { adminComplaintsData, officersData } from '../../data/adminData';

const AdminComplaintsPage = ({ t }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState(adminComplaintsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Get unique departments for filter
  const departments = ['all', ...new Set(complaints.map(c => c.department))];

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesDept = deptFilter === 'all' || complaint.department === deptFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesDept && matchesPriority;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="status-badge pending"><FaHourglassHalf /> Pending</span>;
      case 'in-progress':
        return <span className="status-badge in-progress"><FaClock /> In Progress</span>;
      case 'resolved':
        return <span className="status-badge resolved"><FaCheckCircle /> Resolved</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent':
        return <span className="priority-badge urgent"><FaExclamationTriangle /> Urgent</span>;
      case 'high':
        return <span className="priority-badge high">High</span>;
      case 'medium':
        return <span className="priority-badge medium">Medium</span>;
      case 'low':
        return <span className="priority-badge low">Low</span>;
      default:
        return <span className="priority-badge">{priority}</span>;
    }
  };

  const handleAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
  };

  const handleAssignOfficer = (officerId) => {
    const officer = officersData.find(o => o.id === officerId);
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id 
        ? { ...c, assignedTo: officer?.name || 'Unassigned', status: 'in-progress' } 
        : c
    ));
    setShowAssignModal(false);
    setSelectedComplaint(null);
  };

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints(complaints.map(c => 
      c.id === complaintId ? { ...c, status: newStatus } : c
    ));
  };

  // Statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    urgent: complaints.filter(c => c.priority === 'urgent').length
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Complaints</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-small">
        <div className="stat-card mini glass-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card mini glass-card pending">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat-card mini glass-card in-progress">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="stat-card mini glass-card resolved">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{stats.resolved}</span>
        </div>
        <div className="stat-card mini glass-card urgent">
          <span className="stat-label">Urgent</span>
          <span className="stat-value">{stats.urgent}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section glass-card">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, citizen or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.filter(d => d !== 'all').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="data-table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Citizen</th>
              <th>Category</th>
              <th>Department</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No complaints found</td>
              </tr>
            ) : (
              filteredComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td className="id-cell">{complaint.id}</td>
                  <td>{complaint.citizen}</td>
                  <td>{complaint.category}</td>
                  <td>
                    <span className="department-tag">{complaint.department}</span>
                  </td>
                  <td>
                    <FaCalendarAlt /> {complaint.date}
                  </td>
                  <td>{getPriorityBadge(complaint.priority)}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>
                    {complaint.assignedTo === 'Unassigned' ? (
                      <span className="unassigned">Unassigned</span>
                    ) : (
                      <span className="assigned">
                        <FaUserCheck /> {complaint.assignedTo}
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn view" title="View Details">
                      <FaEye />
                    </button>
                    {complaint.assignedTo === 'Unassigned' && (
                      <button 
                        className="action-btn assign"
                        onClick={() => handleAssign(complaint)}
                        title="Assign to Officer"
                      >
                        Assign
                      </button>
                    )}
                    <select 
                      className="status-select"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Assign Complaint to Officer</h3>
            <p>Complaint ID: <strong>{selectedComplaint.id}</strong></p>
            <p>Category: {selectedComplaint.category}</p>
            
            <div className="officer-list">
              <h4>Available Officers</h4>
              {officersData.filter(o => o.department === selectedComplaint.department && o.status === 'active').map(officer => (
                <div key={officer.id} className="officer-item">
                  <div className="officer-info">
                    <strong>{officer.name}</strong>
                    <small>{officer.email}</small>
                    <small>Complaints: {officer.complaintsAssigned}</small>
                  </div>
                  <button 
                    className="assign-btn"
                    onClick={() => handleAssignOfficer(officer.id)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAssignModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;