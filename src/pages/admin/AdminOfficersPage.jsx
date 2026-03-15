import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaEdit, FaTrash, FaUserPlus, FaCheckCircle,
  FaUserTie, FaEnvelope, FaPhone, FaBuilding, FaKey
} from 'react-icons/fa';
import { officersData, departmentNames } from '../../data/adminData';

const AdminOfficersPage = ({ t }) => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState(officersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Department options for dropdown
  const departmentOptions = [
    { value: 'road', label: 'Road Department' },
    { value: 'water', label: 'Water Department' },
    { value: 'electricity', label: 'Electricity Department' },
    { value: 'garbage', label: 'Garbage Department' },
    { value: 'infrastructure', label: 'Infrastructure Department' },
    { value: 'education', label: 'Education Department' }
  ];

  // New officer form state
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    mobile: '',
    department: 'road',
    password: 'Welcome@123',
    status: 'active'
  });

  // Filter officers based on search and status filter
  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = 
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.mobile.includes(searchTerm) ||
      officer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && officer.status === 'active';
    if (filter === 'inactive') return matchesSearch && officer.status === 'inactive';
    
    return matchesSearch;
  });

  const handleEdit = (officer) => {
    setSelectedOfficer({ ...officer });
    setShowEditModal(true);
  };

  const handleDelete = (officer) => {
    setSelectedOfficer(officer);
    setShowDeleteModal(true);
  };

  const handleAddOfficer = () => {
    const newId = `O${String(officers.length + 1001).slice(1)}`;
    const officerToAdd = {
      id: newId,
      ...newOfficer,
      joinedOn: new Date().toISOString().split('T')[0],
      complaintsAssigned: 0
    };
    setOfficers([...officers, officerToAdd]);
    setShowAddModal(false);
    setNewOfficer({
      name: '',
      email: '',
      mobile: '',
      department: 'road',
      password: 'Welcome@123',
      status: 'active'
    });
  };

  const handleSaveEdit = () => {
    setOfficers(officers.map(o => 
      o.id === selectedOfficer.id ? selectedOfficer : o
    ));
    setShowEditModal(false);
    setSelectedOfficer(null);
  };

  const handleConfirmDelete = () => {
    setOfficers(officers.filter(o => o.id !== selectedOfficer.id));
    setShowDeleteModal(false);
    setSelectedOfficer(null);
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="status-badge active"><FaCheckCircle /> Active</span>
      : <span className="status-badge inactive">Inactive</span>;
  };

  const getDepartmentName = (dept) => {
    return departmentOptions.find(d => d.value === dept)?.label || dept;
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Government Officers</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaUserPlus /> Add New Officer
          </button>
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary glass-card">
        <div className="stat-item">
          <span className="stat-label">Total Officers:</span>
          <span className="stat-value">{officers.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value active">{officers.filter(o => o.status === 'active').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value inactive">{officers.filter(o => o.status === 'inactive').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Assigned:</span>
          <span className="stat-value">{officers.reduce((sum, o) => sum + o.complaintsAssigned, 0)}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar glass-card">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, department or ID..."
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

      {/* Officers Table */}
      <div className="data-table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Complaints</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No officers found</td>
              </tr>
            ) : (
              filteredOfficers.map(officer => (
                <tr key={officer.id}>
                  <td className="id-cell">{officer.id}</td>
                  <td className="name-cell">{officer.name}</td>
                  <td>{officer.email}</td>
                  <td>{officer.mobile}</td>
                  <td>
                    <span className="department-badge">
                      <FaBuilding /> {getDepartmentName(officer.department)}
                    </span>
                  </td>
                  <td>{officer.joinedOn}</td>
                  <td>{getStatusBadge(officer.status)}</td>
                  <td className="complaints-count">{officer.complaintsAssigned}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => handleEdit(officer)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(officer)} title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Officer</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOfficer(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newOfficer.name}
                    onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
                    required
                    placeholder="Enter officer name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})}
                    required
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    value={newOfficer.mobile}
                    onChange={(e) => setNewOfficer({...newOfficer, mobile: e.target.value})}
                    required
                    placeholder="10 digit mobile number"
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={newOfficer.department}
                    onChange={(e) => setNewOfficer({...newOfficer, department: e.target.value})}
                    required
                  >
                    {departmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    value={newOfficer.password}
                    onChange={(e) => setNewOfficer({...newOfficer, password: e.target.value})}
                    placeholder="Default: Welcome@123"
                  />
                  <small>Default password: Welcome@123</small>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newOfficer.status}
                    onChange={(e) => setNewOfficer({...newOfficer, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Add Officer</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Officer Modal */}
      {showEditModal && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Officer</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedOfficer.name}
                  onChange={(e) => setSelectedOfficer({...selectedOfficer, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedOfficer.email}
                  onChange={(e) => setSelectedOfficer({...selectedOfficer, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={selectedOfficer.mobile}
                  onChange={(e) => setSelectedOfficer({...selectedOfficer, mobile: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={selectedOfficer.department}
                  onChange={(e) => setSelectedOfficer({...selectedOfficer, department: e.target.value})}
                >
                  {departmentOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedOfficer.status}
                  onChange={(e) => setSelectedOfficer({...selectedOfficer, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete officer <strong>{selectedOfficer.name}</strong>?</p>
            <p className="warning">This action cannot be undone!</p>
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleConfirmDelete}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOfficersPage;