import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit, FaTrash, FaBan, FaCheckCircle, FaEye, FaSpinner } from 'react-icons/fa';
import { getCitizens, updateCitizenStatus, deleteCitizen } from '../../services/adminService';

const AdminCitizensPage = ({ t }) => {
  const navigate = useNavigate();
  const [citizens, setCitizens]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pageError, setPageError]   = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]         = useState('all');
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showEditModal, setShowEditModal]       = useState(false);
  const [showDeleteModal, setShowDeleteModal]   = useState(false);
  const [actionError, setActionError]           = useState('');
  const [submitting, setSubmitting]             = useState(false);

  useEffect(() => {
    (async () => {
      try { setCitizens(await getCitizens()); }
      catch (err) { setPageError(err.response?.data?.message || 'Failed to load citizens.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = citizens.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const match = name.includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm);
    if (filter === 'active')   return match && c.status === 'active';
    if (filter === 'blocked')  return match && c.status === 'blocked';
    if (filter === 'inactive') return match && c.status === 'inactive';
    return match;
  });

  const handleToggleBlock = async (citizen) => {
    const newStatus = citizen.status === 'blocked' ? 'active' : 'blocked';
    try {
      const updated = await updateCitizenStatus(citizen._id, newStatus);
      setCitizens(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setActionError('');
    try {
      const updated = await updateCitizenStatus(selectedCitizen._id, selectedCitizen.status);
      setCitizens(prev => prev.map(c => c._id === updated._id ? { ...c, status: updated.status } : c));
      setShowEditModal(false); setSelectedCitizen(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to save.');
    } finally { setSubmitting(false); }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true); setActionError('');
    try {
      await deleteCitizen(selectedCitizen._id);
      setCitizens(prev => prev.filter(c => c._id !== selectedCitizen._id));
      setShowDeleteModal(false); setSelectedCitizen(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete.');
    } finally { setSubmitting(false); }
  };

  const getStatusBadge = (status) => ({
    active:   <span className="status-badge active"><FaCheckCircle /> Active</span>,
    blocked:  <span className="status-badge blocked"><FaBan /> Blocked</span>,
    inactive: <span className="status-badge inactive">Inactive</span>,
  }[status] || <span className="status-badge">{status}</span>);

  if (loading) return <div className="admin-page-container" style={{ textAlign:'center', padding:60 }}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Citizens</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
      </div>

      {pageError && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{pageError}</div>}

      <div className="stats-summary glass-card">
        {[['Total', citizens.length, ''], ['Active', citizens.filter(c=>c.status==='active').length, 'active'], ['Blocked', citizens.filter(c=>c.status==='blocked').length, 'blocked'], ['Inactive', citizens.filter(c=>c.status==='inactive').length, 'inactive']].map(([label, val, cls]) => (
          <div key={label} className="stat-item"><span className="stat-label">{label}:</span><span className={`stat-value ${cls}`}>{val}</span></div>
        ))}
      </div>

      <div className="search-filter-bar glass-card">
        <div className="search-box"><FaSearch className="search-icon"/>
          <input type="text" placeholder="Search by name, email or mobile…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
        </div>
        <div className="filter-box">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Citizens</option><option value="active">Active</option>
            <option value="blocked">Blocked</option><option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="data-table-container glass-card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>City</th><th>Registered</th><th>Complaints</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="8" className="no-data">No citizens found</td></tr> :
              filtered.map(c => (
                <tr key={c._id}>
                  <td className="name-cell">{c.firstName} {c.lastName}</td>
                  <td>{c.email}</td><td>{c.mobile}</td>
                  <td>{c.city}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="complaints-count">{c.totalComplaints || 0}</td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" title="Edit" onClick={() => { setSelectedCitizen({...c}); setActionError(''); setShowEditModal(true); }}><FaEdit /></button>
                    <button className={`action-btn ${c.status==='blocked'?'unblock':'block'}`} title={c.status==='blocked'?'Unblock':'Block'} onClick={() => handleToggleBlock(c)}>
                      {c.status==='blocked' ? <FaCheckCircle /> : <FaBan />}
                    </button>
                    <button className="action-btn delete" title="Delete" onClick={() => { setSelectedCitizen(c); setActionError(''); setShowDeleteModal(true); }}><FaTrash /></button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {showEditModal && selectedCitizen && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>Edit Citizen Status</h3>
            {actionError && <div className="error-message">{actionError}</div>}
            <form onSubmit={handleSaveEdit}>
              <div className="form-group"><label>Name</label><input type="text" value={`${selectedCitizen.firstName} ${selectedCitizen.lastName}`} readOnly className="readonly-input"/></div>
              <div className="form-group"><label>Status</label>
                <select value={selectedCitizen.status} onChange={e=>setSelectedCitizen({...selectedCitizen,status:e.target.value})} disabled={submitting}>
                  <option value="active">Active</option><option value="blocked">Blocked</option><option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>{submitting?<FaSpinner className="spin"/>:'Save'}</button>
                <button type="button" className="cancel-btn" onClick={()=>setShowEditModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCitizen && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e=>e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Delete citizen <strong>{selectedCitizen.firstName} {selectedCitizen.lastName}</strong>?</p>
            <p className="warning">This cannot be undone!</p>
            {actionError && <div className="error-message">{actionError}</div>}
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleConfirmDelete} disabled={submitting}>{submitting?<FaSpinner className="spin"/>:'Delete'}</button>
              <button className="cancel-btn" onClick={()=>setShowDeleteModal(false)} disabled={submitting}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCitizensPage;