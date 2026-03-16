import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaEdit, FaTrash, FaUserPlus, FaCheckCircle,
  FaBuilding, FaSpinner
} from 'react-icons/fa';
import {
  getOfficers,
  createOfficer,
  updateOfficer,
  deleteOfficer
} from '../../services/adminService';

const departmentOptions = [
  { value: 'road',           label: 'Road Department' },
  { value: 'water',          label: 'Water Department' },
  { value: 'electricity',    label: 'Electricity Department' },
  { value: 'garbage',        label: 'Garbage Department' },
  { value: 'infrastructure', label: 'Infrastructure Department' },
  { value: 'education',      label: 'Education Department' },
];

const getDepartmentName = (dept) =>
  departmentOptions.find((d) => d.value === dept)?.label || dept;

const EMPTY_NEW = {
  firstName:  '',
  lastName:   '',
  email:      '',
  mobile:     '',
  username:   '',
  password:   'Welcome@123',
  department: 'road',
  employeeId: '',
  status:     'active',
};

const AdminOfficersPage = ({ t }) => {
  const navigate = useNavigate();

  // ── Data ──────────────────────────────────────────────────────────────────────
  const [officers, setOfficers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pageError, setPageError]       = useState('');

  // ── Search / filter ───────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]     = useState('');
  const [filter, setFilter]             = useState('all');

  // ── Modals ────────────────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // ── Form state ────────────────────────────────────────────────────────────────
  const [newOfficer, setNewOfficer]     = useState(EMPTY_NEW);
  const [formError, setFormError]       = useState('');
  const [submitting, setSubmitting]     = useState(false);

  // ── Fetch officers on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const data = await getOfficers();
        setOfficers(data);
      } catch (err) {
        setPageError(err.response?.data?.message || 'Failed to load officers.');
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filteredOfficers = officers.filter((o) => {
    const fullName = `${o.firstName} ${o.lastName}`.toLowerCase();
    const matches =
      fullName.includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mobile.includes(searchTerm) ||
      (o.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'active')   return matches && o.status === 'active';
    if (filter === 'inactive') return matches && o.status === 'inactive';
    return matches;
  });

  // ── Add officer ───────────────────────────────────────────────────────────────
  const handleAddOfficer = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const created = await createOfficer(newOfficer);
      setOfficers((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewOfficer(EMPTY_NEW);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create officer.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit officer ──────────────────────────────────────────────────────────────
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const updated = await updateOfficer(selectedOfficer._id, selectedOfficer);
      setOfficers((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setShowEditModal(false);
      setSelectedOfficer(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update officer.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete officer ────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await deleteOfficer(selectedOfficer._id);
      setOfficers((prev) => prev.filter((o) => o._id !== selectedOfficer._id));
      setShowDeleteModal(false);
      setSelectedOfficer(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete officer.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) =>
    status === 'active'
      ? <span className="status-badge active"><FaCheckCircle /> Active</span>
      : <span className="status-badge inactive">Inactive</span>;

  // ── Loading / error page states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: 60 }}>
        <FaSpinner className="spin" style={{ fontSize: 32 }} />
        <p style={{ marginTop: 12 }}>Loading officers…</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="admin-page-container">
        <div className="error-message glass-card" style={{ padding: 24 }}>{pageError}</div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">

      {/* ── Header ── */}
      <div className="page-header">
        <h2>Manage Government Officers</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => { setFormError(''); setShowAddModal(true); }}>
            <FaUserPlus /> Add New Officer
          </button>
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* ── Stats summary ── */}
      <div className="stats-summary glass-card">
        <div className="stat-item">
          <span className="stat-label">Total Officers:</span>
          <span className="stat-value">{officers.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value active">{officers.filter((o) => o.status === 'active').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value inactive">{officers.filter((o) => o.status === 'inactive').length}</span>
        </div>
      </div>

      {/* ── Search + filter ── */}
      <div className="search-filter-bar glass-card">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, department, employee ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Officers</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* ── Officers table ── */}
      <div className="data-table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.length === 0 ? (
              <tr><td colSpan="9" className="no-data">No officers found</td></tr>
            ) : (
              filteredOfficers.map((officer) => (
                <tr key={officer._id}>
                  <td className="id-cell">{officer.employeeId || '—'}</td>
                  <td className="name-cell">{officer.firstName} {officer.lastName}</td>
                  <td>{officer.username}</td>
                  <td>{officer.email}</td>
                  <td>{officer.mobile}</td>
                  <td>
                    <span className="department-badge">
                      <FaBuilding /> {getDepartmentName(officer.department)}
                    </span>
                  </td>
                  <td>{new Date(officer.createdAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(officer.status)}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => { setSelectedOfficer({ ...officer }); setFormError(''); setShowEditModal(true); }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => { setSelectedOfficer(officer); setShowDeleteModal(true); }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ADD OFFICER MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Officer</h3>
            {formError && <div className="error-message" style={{ marginBottom: 12 }}>{formError}</div>}
            <form onSubmit={handleAddOfficer}>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newOfficer.firstName}
                    onChange={(e) => setNewOfficer({ ...newOfficer, firstName: e.target.value })}
                    required disabled={submitting}
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newOfficer.lastName}
                    onChange={(e) => setNewOfficer({ ...newOfficer, lastName: e.target.value })}
                    required disabled={submitting}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                    required disabled={submitting}
                    placeholder="officer@dept.gov.in"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile *</label>
                  <input
                    type="tel"
                    value={newOfficer.mobile}
                    onChange={(e) => setNewOfficer({ ...newOfficer, mobile: e.target.value })}
                    required disabled={submitting}
                    placeholder="10 digit mobile"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={newOfficer.username}
                    onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
                    required disabled={submitting}
                    placeholder="Login username"
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    value={newOfficer.employeeId}
                    onChange={(e) => setNewOfficer({ ...newOfficer, employeeId: e.target.value })}
                    required disabled={submitting}
                    placeholder="e.g. EMP-1042"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={newOfficer.department}
                    onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                    required disabled={submitting}
                  >
                    {departmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newOfficer.status}
                    onChange={(e) => setNewOfficer({ ...newOfficer, status: e.target.value })}
                    disabled={submitting}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  value={newOfficer.password}
                  onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                  disabled={submitting}
                  placeholder="Default: Welcome@123"
                />
                <small>Officer should change this after first login.</small>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? <><FaSpinner className="spin" /> Creating…</> : 'Add Officer'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          EDIT OFFICER MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showEditModal && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Officer</h3>
            {formError && <div className="error-message" style={{ marginBottom: 12 }}>{formError}</div>}
            <form onSubmit={handleSaveEdit}>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={selectedOfficer.firstName}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, firstName: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={selectedOfficer.lastName}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, lastName: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedOfficer.email}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, email: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    value={selectedOfficer.mobile}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, mobile: e.target.value })}
                    disabled={submitting}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    value={selectedOfficer.employeeId || ''}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, employeeId: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={selectedOfficer.department}
                    onChange={(e) => setSelectedOfficer({ ...selectedOfficer, department: e.target.value })}
                    disabled={submitting}
                  >
                    {departmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedOfficer.status}
                  onChange={(e) => setSelectedOfficer({ ...selectedOfficer, status: e.target.value })}
                  disabled={submitting}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? <><FaSpinner className="spin" /> Saving…</> : 'Save Changes'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showDeleteModal && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete officer{' '}
              <strong>{selectedOfficer.firstName} {selectedOfficer.lastName}</strong>?
            </p>
            <p className="warning">This action cannot be undone!</p>
            {formError && <div className="error-message">{formError}</div>}
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleConfirmDelete} disabled={submitting}>
                {submitting ? <><FaSpinner className="spin" /> Deleting…</> : 'Delete'}
              </button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOfficersPage;