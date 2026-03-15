import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBell, FaPlus, FaEdit, FaTrash, FaPaperPlane,
  FaCalendarAlt, FaUser, FaCheckCircle, FaTimesCircle,
  FaEye, FaEyeSlash
} from 'react-icons/fa';
import { announcementsData } from '../../data/adminData';

const AdminNotificationsPage = ({ t }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState(announcementsData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    priority: 'normal',
    expiresAt: ''
  });

  const [filter, setFilter] = useState('all');

  const filteredAnnouncements = announcements.filter(ann => {
    if (filter === 'active') return ann.status === 'active';
    if (filter === 'archived') return ann.status === 'archived';
    return true;
  });

  const handleAddAnnouncement = () => {
    const newId = `ann${announcements.length + 1}`;
    setAnnouncements([{
      id: newId,
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      status: 'active'
    }, ...announcements]);
    setShowAddModal(false);
    setNewAnnouncement({
      title: '',
      message: '',
      targetAudience: 'all',
      priority: 'normal',
      expiresAt: ''
    });
  };

  const handleEditAnnouncement = () => {
    setAnnouncements(announcements.map(a => 
      a.id === selectedAnnouncement.id ? selectedAnnouncement : a
    ));
    setShowEditModal(false);
    setSelectedAnnouncement(null);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleToggleStatus = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'archived' : 'active' } : a
    ));
  };

  const handleSendNow = (announcement) => {
    alert(`Announcement "${announcement.title}" sent to all citizens!`);
    // In real app, this would trigger push notifications/emails
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Notifications & Announcements</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> New Announcement
          </button>
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs glass-card">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-tab ${filter === 'archived' ? 'active' : ''}`}
          onClick={() => setFilter('archived')}
        >
          Archived
        </button>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <div className="no-data glass-card">
            <FaBell size={50} />
            <p>No announcements found</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className={`announcement-card glass-card ${announcement.status}`}>
              <div className="announcement-header">
                <div className="title-section">
                  <h3>{announcement.title}</h3>
                  <span className={`priority-badge ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                </div>
                <div className="status-badge">
                  {announcement.status === 'active' ? (
                    <span className="active"><FaCheckCircle /> Active</span>
                  ) : (
                    <span className="archived"><FaTimesCircle /> Archived</span>
                  )}
                </div>
              </div>

              <div className="announcement-content">
                <p>{announcement.message}</p>
              </div>

              <div className="announcement-meta">
                <span className="meta-item">
                  <FaCalendarAlt /> {announcement.date}
                </span>
                <span className="meta-item">
                  <FaUser /> Target: {announcement.targetAudience === 'all' ? 'All Citizens' : announcement.targetAudience}
                </span>
                {announcement.expiresAt && (
                  <span className="meta-item">
                    Expires: {announcement.expiresAt}
                  </span>
                )}
              </div>

              <div className="announcement-actions">
                <button 
                  className="action-btn send" 
                  onClick={() => handleSendNow(announcement)}
                  title="Send Now"
                >
                  <FaPaperPlane />
                </button>
                <button 
                  className="action-btn edit" 
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setShowEditModal(true);
                  }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button 
                  className="action-btn toggle" 
                  onClick={() => handleToggleStatus(announcement.id)}
                  title={announcement.status === 'active' ? 'Archive' : 'Activate'}
                >
                  {announcement.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
            <h3>Create New Announcement</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddAnnouncement(); }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  required
                  placeholder="Enter announcement title"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                  required
                  placeholder="Enter announcement message"
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    value={newAnnouncement.targetAudience}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, targetAudience: e.target.value})}
                  >
                    <option value="all">All Citizens</option>
                    <option value="road">Road Department</option>
                    <option value="water">Water Department</option>
                    <option value="electricity">Electricity Department</option>
                    <option value="garbage">Garbage Department</option>
                    <option value="infrastructure">Infrastructure Department</option>
                    <option value="education">Education Department</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, expiresAt: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Create Announcement</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Announcement</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleEditAnnouncement(); }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={selectedAnnouncement.title}
                  onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={selectedAnnouncement.message}
                  onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, message: e.target.value})}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    value={selectedAnnouncement.targetAudience}
                    onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, targetAudience: e.target.value})}
                  >
                    <option value="all">All Citizens</option>
                    <option value="road">Road Department</option>
                    <option value="water">Water Department</option>
                    <option value="electricity">Electricity Department</option>
                    <option value="garbage">Garbage Department</option>
                    <option value="infrastructure">Infrastructure Department</option>
                    <option value="education">Education Department</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={selectedAnnouncement.priority}
                    onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;