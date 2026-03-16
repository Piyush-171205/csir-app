import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaUserCheck, FaCheckCircle, FaHourglassHalf, FaExclamationTriangle, FaClock, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { getAllComplaints, assignComplaint, updateComplaintStatus } from '../../services/adminService';
import { getOfficers } from '../../services/adminService';

const DEPARTMENTS = ['road','water','electricity','garbage','infrastructure','education'];

const AdminComplaintsPage = ({ t }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints]     = useState([]);
  const [officers, setOfficers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pageError, setPageError]       = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter]     = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal]       = useState(false);
  const [actionError, setActionError]               = useState('');
  const [submitting, setSubmitting]                 = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, o] = await Promise.all([
        getAllComplaints({ status: statusFilter, department: deptFilter, priority: priorityFilter, search: searchTerm }),
        getOfficers(),
      ]);
      setComplaints(c); setOfficers(o);
    } catch (err) {
      setPageError(err.response?.data?.message || 'Failed to load complaints.');
    } finally { setLoading(false); }
  }, [statusFilter, deptFilter, priorityFilter, searchTerm]);

  useEffect(() => { fetchAll(); }, [statusFilter, deptFilter, priorityFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchAll(); };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const updated = await updateComplaintStatus(complaintId, newStatus);
      setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch (err) { alert(err.response?.data?.message || 'Failed to update status.'); }
  };

  const handleAssignOfficer = async (officerId) => {
    setSubmitting(true); setActionError('');
    try {
      const updated = await assignComplaint(selectedComplaint._id, officerId);
      setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));
      setShowAssignModal(false); setSelectedComplaint(null);
    } catch (err) { setActionError(err.response?.data?.message || 'Failed to assign.'); }
    finally { setSubmitting(false); }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c=>['reported','pending'].includes(c.status)).length,
    inProgress: complaints.filter(c=>['in-progress','acknowledged','almost-resolved'].includes(c.status)).length,
    resolved: complaints.filter(c=>['resolved','completed'].includes(c.status)).length,
    urgent: complaints.filter(c=>c.priority==='urgent').length,
  };

  const getStatusBadge = (s) => ({
    pending:    <span className="status-badge pending"><FaHourglassHalf /> Pending</span>,
    reported:   <span className="status-badge pending"><FaHourglassHalf /> Reported</span>,
    'in-progress': <span className="status-badge in-progress"><FaClock /> In Progress</span>,
    acknowledged: <span className="status-badge in-progress"><FaClock /> Acknowledged</span>,
    resolved:   <span className="status-badge resolved"><FaCheckCircle /> Resolved</span>,
    completed:  <span className="status-badge resolved"><FaCheckCircle /> Completed</span>,
  }[s] || <span className="status-badge">{s}</span>);

  const getPriorityBadge = (p) => ({
    urgent: <span className="priority-badge urgent"><FaExclamationTriangle /> Urgent</span>,
    high:   <span className="priority-badge high">High</span>,
    medium: <span className="priority-badge medium">Medium</span>,
    low:    <span className="priority-badge low">Low</span>,
  }[p] || <span className="priority-badge">{p}</span>);

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Complaints</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
      </div>

      {pageError && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{pageError}</div>}

      <div className="stats-grid-small">
        {[['Total',stats.total,''],['Pending',stats.pending,'pending'],['In Progress',stats.inProgress,'in-progress'],['Resolved',stats.resolved,'resolved'],['Urgent',stats.urgent,'urgent']].map(([l,v,c])=>(
          <div key={l} className={`stat-card mini glass-card ${c}`}><span className="stat-label">{l}</span><span className="stat-value">{v}</span></div>
        ))}
      </div>

      <div className="filters-section glass-card">
        <form className="search-box" onSubmit={handleSearch}>
          <FaSearch className="search-icon"/>
          <input type="text" placeholder="Search by ID or title…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          <button type="submit" className="map-btn" style={{marginLeft:8}}>Search</button>
        </form>
        <div className="filter-group">
          <FaFilter className="filter-icon"/>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="reported">Reported</option><option value="acknowledged">Acknowledged</option>
            <option value="in-progress">In Progress</option><option value="almost-resolved">Almost Resolved</option>
            <option value="resolved">Resolved</option><option value="completed">Completed</option>
          </select>
          <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d=><option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
          </select>
          <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option><option value="high">High</option>
            <option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="data-table-container glass-card">
        {loading ? (
          <div style={{textAlign:'center',padding:40}}><FaSpinner className="spin" style={{fontSize:28}}/></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Citizen</th><th>Department</th><th>Date</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.length === 0 ? <tr><td colSpan="9" className="no-data">No complaints found</td></tr> :
                complaints.map(c => (
                  <tr key={c._id}>
                    <td className="id-cell">{c.complaintId || c._id.slice(-6).toUpperCase()}</td>
                    <td>{c.title}</td>
                    <td>{c.reportedBy ? `${c.reportedBy.firstName} ${c.reportedBy.lastName}` : '—'}</td>
                    <td><span className="department-tag">{c.department}</span></td>
                    <td><FaCalendarAlt /> {new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>{getPriorityBadge(c.priority)}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td>
                      {c.assignedTo
                        ? <span className="assigned"><FaUserCheck /> {c.assignedTo.firstName} {c.assignedTo.lastName}</span>
                        : <span className="unassigned">Unassigned</span>}
                    </td>
                    <td className="actions-cell">
                      {!c.assignedTo && (
                        <button className="action-btn assign" onClick={() => { setSelectedComplaint(c); setActionError(''); setShowAssignModal(true); }}>Assign</button>
                      )}
                      <select className="status-select" value={c.status} onChange={e=>handleStatusChange(c._id, e.target.value)}>
                        <option value="reported">Reported</option><option value="acknowledged">Acknowledged</option>
                        <option value="in-progress">In Progress</option><option value="almost-resolved">Almost Resolved</option>
                        <option value="resolved">Resolved</option><option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>

      {showAssignModal && selectedComplaint && (
        <div className="modal-overlay" onClick={()=>setShowAssignModal(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>Assign Complaint to Officer</h3>
            <p>Complaint: <strong>{selectedComplaint.title}</strong></p>
            <p>Department: {selectedComplaint.department}</p>
            {actionError && <div className="error-message">{actionError}</div>}
            <div className="officer-list">
              <h4>Available Officers — {selectedComplaint.department}</h4>
              {officers.filter(o=>o.department===selectedComplaint.department&&o.status==='active').length === 0
                ? <p>No active officers in this department.</p>
                : officers.filter(o=>o.department===selectedComplaint.department&&o.status==='active').map(o=>(
                  <div key={o._id} className="officer-item">
                    <div className="officer-info">
                      <strong>{o.firstName} {o.lastName}</strong>
                      <small>{o.employeeId}</small>
                      <small>{o.email}</small>
                    </div>
                    <button className="assign-btn" onClick={()=>handleAssignOfficer(o._id)} disabled={submitting}>
                      {submitting?<FaSpinner className="spin"/>:'Assign'}
                    </button>
                  </div>
                ))
              }
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={()=>setShowAssignModal(false)} disabled={submitting}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminComplaintsPage;