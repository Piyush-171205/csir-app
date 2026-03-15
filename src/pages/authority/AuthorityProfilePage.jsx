import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaKey, FaSave } from 'react-icons/fa';
import { departmentNames, departmentComplaints } from '../../data/authorityData.js';

const AuthorityProfilePage = ({ currentUser, t, usersDB, handleLogout }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ ...currentUser });
  const [showSuccess, setShowSuccess] = useState(false);

  const department = currentUser?.department;
  const complaints = departmentComplaints[department] || [];
  
  const stats = {
    total: complaints.length,
    reported: complaints.filter(c => c.status === 'Reported').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

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
    <div className="authority-profile-container">
      <div className="page-header">
        <h2>Officer Profile</h2>
        <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>
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
              <FaUserTie size={80} color="#000080" />
            </div>
            <h3>{profileData.name}</h3>
            <p className="department-badge">
              <FaBuilding /> {departmentNames[department]}
            </p>
          </div>

          {!isEditing ? (
            <>
              <div className="profile-details">
                <div className="detail-row">
                  <FaUserTie className="detail-icon" />
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
                    <span>{profileData.phone || 'Not provided'}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <FaBuilding className="detail-icon" />
                  <div className="detail-content">
                    <label>Department</label>
                    <span>{departmentNames[department]}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
                <button 
                  className="password-btn" 
                  onClick={() => navigate('/authority/change-password')}
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
                    value={profileData.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone || ''}
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
          <h3>Department Overview</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Department:</span>
              <span className="stat-value">{departmentNames[department]}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Complaints:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reported:</span>
              <span className="stat-value" style={{ color: '#6b7280' }}>{stats.reported}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Progress:</span>
              <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.inProgress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Resolved:</span>
              <span className="stat-value" style={{ color: '#10b981' }}>{stats.resolved}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Resolution Rate:</span>
              <span className="stat-value">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityProfilePage;