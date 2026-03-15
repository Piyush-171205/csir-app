import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaEdit, FaTrash, FaBan, FaCheckCircle,
  FaUserCheck, FaUserTimes, FaEye, FaPlus
} from 'react-icons/fa';
import { citizensData } from '../../data/adminData';

const AdminCitizensPage = ({ t }) => {
  const navigate = useNavigate();
  const [citizens, setCitizens] = useState(citizensData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter citizens based on search and status filter
  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = 
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.mobile.includes(searchTerm) ||
      citizen.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && citizen.status === 'active';
    if (filter === 'blocked') return matchesSearch && citizen.status === 'blocked';
    if (filter === 'inactive') return matchesSearch && citizen.status === 'inactive';
    
    return matchesSearch;
  });

  const handleEdit = (citizen) => {
    setSelectedCitizen({ ...citizen });
    setShowEditModal(true);
  };

  const handleDelete = (citizen) => {
    setSelectedCitizen(citizen);
    setShowDeleteModal(true);
  };

  const handleBlock = (citizenId) => {
    setCitizens(citizens.map(c => 
      c.id === citizenId ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' } : c
    ));
  };

  const handleSaveEdit = () => {
    setCitizens(citizens.map(c => 
      c.id === selectedCitizen.id ? selectedCitizen : c
    ));
    setShowEditModal(false);
    setSelectedCitizen(null);
  };

  const handleConfirmDelete = () => {
    setCitizens(citizens.filter(c => c.id !== selectedCitizen.id));
    setShowDeleteModal(false);
    setSelectedCitizen(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="status-badge active"><FaCheckCircle /> Active</span>;
      case 'blocked':
        return <span className="status-badge blocked"><FaBan /> Blocked</span>;
      case 'inactive':
        return <span className="status-badge inactive">Inactive</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Citizens</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary glass-card">
        <div className="stat-item">
          <span className="stat-label">Total Citizens:</span>
          <span className="stat-value">{citizens.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value active">{citizens.filter(c => c.status === 'active').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Blocked:</span>
          <span className="stat-value blocked">{citizens.filter(c => c.status === 'blocked').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value inactive">{citizens.filter(c => c.status === 'inactive').length}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar glass-card">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, mobile or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Citizens</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="data-table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Registered On</th>
              <th>Status</th>
              <th>Complaints</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCitizens.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No citizens found</td>
              </tr>
            ) : (
              filteredCitizens.map(citizen => (
                <tr key={citizen.id}>
                  <td className="id-cell">{citizen.id}</td>
                  <td className="name-cell">{citizen.name}</td>
                  <td>{citizen.email}</td>
                  <td>{citizen.mobile}</td>
                  <td className="address-cell">{citizen.address}</td>
                  <td>{citizen.registeredOn}</td>
                  <td>{getStatusBadge(citizen.status)}</td>
                  <td className="complaints-count">{citizen.complaints}</td>
                  <td className="actions-cell">
                    <button className="action-btn view" title="View Details">
                      <FaEye />
                    </button>
                    <button className="action-btn edit" onClick={() => handleEdit(citizen)} title="Edit">
                      <FaEdit />
                    </button>
                    <button 
                      className={`action-btn ${citizen.status === 'blocked' ? 'unblock' : 'block'}`}
                      onClick={() => handleBlock(citizen.id)}
                      title={citizen.status === 'blocked' ? 'Unblock' : 'Block'}
                    >
                      {citizen.status === 'blocked' ? <FaCheckCircle /> : <FaBan />}
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(citizen)} title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCitizen && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Citizen</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedCitizen.name}
                  onChange={(e) => setSelectedCitizen({...selectedCitizen, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedCitizen.email}
                  onChange={(e) => setSelectedCitizen({...selectedCitizen, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={selectedCitizen.mobile}
                  onChange={(e) => setSelectedCitizen({...selectedCitizen, mobile: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={selectedCitizen.address}
                  onChange={(e) => setSelectedCitizen({...selectedCitizen, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedCitizen.status}
                  onChange={(e) => setSelectedCitizen({...selectedCitizen, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
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
      {showDeleteModal && selectedCitizen && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete citizen <strong>{selectedCitizen.name}</strong>?</p>
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

export default AdminCitizensPage;