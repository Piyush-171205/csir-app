import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaBuilding } from 'react-icons/fa';
import { departmentComplaints, departmentNames, progressMessages, statusOptions, notificationTypes } from '../../data/authorityData.js';

const AuthorityComplaintDetailPage = ({ 
  currentUser, 
  t, 
  complaintsDB,
  setAuthorityNotifications 
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const department = currentUser?.department;
  
  const [complaint, setComplaint] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newProgress, setNewProgress] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Find complaint from department data
    const found = departmentComplaints[department]?.find(c => c.id === id);
    if (found) {
      setComplaint(found);
      setNewStatus(found.status);
      setNewProgress(found.progress);
    }
  }, [department, id]);

  if (!complaint) {
    return <div className="loading">Loading complaint details...</div>;
  }

  const handleStatusUpdate = () => {
    
    // Create notification
    const notification = {
      id: `notif_${Date.now()}`,
      type: notificationTypes.STATUS_UPDATE,
      title: 'Complaint Status Updated',
      message: `Complaint #${complaint.id} status changed to ${newStatus}`,
      complaintId: complaint.id,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setAuthorityNotifications(prev => [notification, ...prev]);
    
    alert(`Status updated to ${newStatus} with ${newProgress}% progress`);
    setShowUpdateForm(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return '#6b7280';
      case 'Acknowledged': return '#3b82f6';
      case 'In Progress': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="authority-complaint-detail-container">
      <div className="page-header">
        <h2>Complaint Details - {complaint.id}</h2>
        <button className="back-btn" onClick={() => navigate('/authority/complaints')}>
          ← Back to Complaints
        </button>
      </div>

      <div className="complaint-detail-grid">
        {/* Left Column - Complaint Info */}
        <div className="complaint-info-card glass-card">
          <div className="complaint-header">
            <h3>{complaint.issueLocation}</h3>
            <span 
              className="status-badge-large"
              style={{ backgroundColor: getStatusColor(complaint.status) }}
            >
              {complaint.status}
            </span>
          </div>

          <div className="complaint-meta">
            <div className="meta-item">
              <FaUser className="meta-icon" />
              <div className="meta-content">
                <label>Citizen Name</label>
                <span>{complaint.userName}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaPhone className="meta-icon" />
              <div className="meta-content">
                <label>Mobile</label>
                <span>{complaint.mobile}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <div className="meta-content">
                <label>Issue Date</label>
                <span>{complaint.issueDate}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaBuilding className="meta-icon" />
              <div className="meta-content">
                <label>Department</label>
                <span>{departmentNames[department]}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <div className="meta-content">
                <label>Location</label>
                <span>{complaint.issueLocation}</span>
                <small>{complaint.areaName}, Ward {complaint.ward}</small>
              </div>
            </div>
          </div>

          <div className="complaint-description">
            <h4>Description</h4>
            <p>{complaint.description}</p>
          </div>

          {/* Images */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="complaint-images">
              <h4>Attached Images</h4>
              <div className="image-grid">
                {complaint.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="image-thumbnail"
                    onClick={() => {
                      setSelectedImage(img);
                      setShowImageModal(true);
                    }}
                  >
                    <img src={img} alt={`complaint-${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Location */}
          <div className="complaint-location">
            <h4>Live Location</h4>
            <div className="location-coordinates">
              <FaMapMarkerAlt /> {complaint.liveLocation}
            </div>
            <div className="location-details">
              <p><strong>Area:</strong> {complaint.areaName}</p>
              <p><strong>Ward:</strong> {complaint.ward}</p>
              <p><strong>Pincode:</strong> {complaint.pincode}</p>
              <p><strong>District:</strong> Navi Mumbai</p>
            </div>
          </div>
        </div>

        {/* Right Column - Status Update */}
        <div className="complaint-actions-card glass-card">
          <h3>Update Complaint Status</h3>
          
          {!showUpdateForm ? (
            <div className="current-status">
              <div className="status-display">
                <label>Current Status:</label>
                <span 
                  className="status-badge-large"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {complaint.status}
                </span>
              </div>
              <div className="progress-display">
                <label>Work Progress:</label>
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${complaint.progress}%`,
                      backgroundColor: getStatusColor(complaint.status)
                    }}
                  />
                  <span className="progress-text">{complaint.progress}%</span>
                </div>
              </div>
              <button 
                className="update-status-btn"
                onClick={() => setShowUpdateForm(true)}
              >
                Update Status
              </button>
            </div>
          ) : (
            <div className="status-update-form">
              <div className="form-group">
                <label>New Status</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Progress ({newProgress}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value))}
                />
                <div className="progress-labels">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="form-group">
                <label>Remarks / Solution Description</label>
                <textarea
                  rows="4"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any remarks or describe the solution..."
                />
              </div>

              <div className="progress-message">
                <p>{progressMessages[newProgress] || `Progress: ${newProgress}%`}</p>
              </div>

              <div className="form-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="quick-stats">
            <h4>Complaint Timeline</h4>
            <div className="stat-items">
              <div className="stat-item">
                <span className="stat-label">Reported:</span>
                <span className="stat-value">{complaint.issueDate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Updated:</span>
                <span className="stat-value">{complaint.issueDate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Response Time:</span>
                <span className="stat-value">2 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowImageModal(false)}>×</button>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityComplaintDetailPage;