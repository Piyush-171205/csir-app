import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, FaEnvelope, FaPhone, FaBuilding,
  FaEdit, FaKey, FaSave, FaUserShield, FaCalendarAlt
} from 'react-icons/fa';
import { useAdminStats } from '../../hooks/useAdminStats';

const AdminProfilePage = ({ currentUser, t, usersDB, handleLogout }) => {
  const navigate = useNavigate();
  const stats = useAdminStats();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ 
    name: currentUser?.name || 'Administrator',
    email: currentUser?.email || 'admin@csir.gov',
    phone: currentUser?.phone || '9876543210',
    department: 'Administration',
    joinedOn: '2024-01-01'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In real app, would call API to update user
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsEditing(false);
  };

  return (
    <div className="admin-profile-container">
      <div className="page-header">
        <h2>Admin Profile</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {showSuccess && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card-main glass-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              <FaUserShield size={80} color="#000080" />
            </div>
            <h3>{profileData.name}</h3>
            <p className="role-badge">System Administrator</p>
          </div>

          {!isEditing ? (
            <>
              <div className="profile-details">
                <div className="detail-row">
                  <FaUserCircle className="detail-icon" />
                  <div className="detail-content">
                    <label>Full Name</label>
                    <span>{profileData.name}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <FaEnvelope className="detail-icon" />
                  <div className="detail-content">
                    <label>Email</label>
                    <span>{profileData.email}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <FaPhone className="detail-icon" />
                  <div className="detail-content">
                    <label>Phone</label>
                    <span>{profileData.phone}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <FaBuilding className="detail-icon" />
                  <div className="detail-content">
                    <label>Department</label>
                    <span>{profileData.department}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <FaCalendarAlt className="detail-icon" />
                  <div className="detail-content">
                    <label>Joined On</label>
                    <span>{profileData.joinedOn}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
                <button 
                  className="password-btn" 
                  onClick={() => navigate('/admin/change-password')}
                >
                  <FaKey /> Change Password
                </button>
                <button className="logout-btn-profile" onClick={handleLogout}>
                  {t.logout}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  <FaSave /> Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats Card */}
        <div className="stats-card glass-card">
          <h3>System Overview</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Total Citizens:</span>
              <span className="stat-value">{stats.totalCitizens}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Citizens:</span>
              <span className="stat-value" style={{ color: '#28a745' }}>{stats.activeCitizens}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Officers:</span>
              <span className="stat-value">{stats.totalOfficers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Officers:</span>
              <span className="stat-value" style={{ color: '#28a745' }}>{stats.activeOfficers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Complaints:</span>
              <span className="stat-value">{stats.totalComplaints}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Resolved:</span>
              <span className="stat-value" style={{ color: '#28a745' }}>{stats.resolvedComplaints}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value" style={{ color: '#ffc107' }}>{stats.pendingComplaints}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="quick-actions-card glass-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-list">
            <button onClick={() => navigate('/admin/citizens')}>Manage Citizens</button>
            <button onClick={() => navigate('/admin/officers')}>Manage Officers</button>
            <button onClick={() => navigate('/admin/complaints')}>View Complaints</button>
            <button onClick={() => navigate('/admin/categories')}>Manage Categories</button>
            <button onClick={() => navigate('/admin/reports')}>View Reports</button>
            <button onClick={() => navigate('/admin/notifications')}>Send Announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
