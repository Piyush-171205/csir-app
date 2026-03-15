import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaBell, FaClipboardList, FaUserTie, FaBuilding } from 'react-icons/fa';
import { departmentComplaints, departmentNames } from '../../data/authorityData.js';
import { useAuthorityNotifications } from '../../hooks/useAuthorityNotifications';

const AuthorityDashboardPage = ({ 
  currentUser, 
  t, 
  handleLogout,
  authorityNotifications,
  setAuthorityNotifications,
  setAuthorityUnreadCount,
  authorityUnreadCount
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const department = currentUser?.department;
  
  const complaints = departmentComplaints[department] || [];
  
  const stats = {
    total: complaints.length,
    reported: complaints.filter(c => c.status === 'Reported').length,
    acknowledged: complaints.filter(c => c.status === 'Acknowledged').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  const recentComplaints = complaints.slice(0, 5);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return '#6b7280';
      case 'Acknowledged': return '#3b82f6';
      case 'In Progress': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Reported': return '📋';
      case 'Acknowledged': return '👁️';
      case 'In Progress': return '🚧';
      case 'Resolved': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="dashboard glass-card">
      {/* Header with Notifications */}
      <div className="dashboard-header">
        <div className="welcome-message">
          <h2>{t.welcome} {currentUser?.name}!</h2>
          <p className="welcome-subtitle">
            <FaBuilding /> {departmentNames[department]} - {department}
          </p>
        </div>
        
        <div className="header-actions">
          <div className="notifications-wrapper">
            <button 
              className="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {authorityUnreadCount > 0 && (
                <span className="notification-badge">{authorityUnreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button onClick={() => {
                    const updated = authorityNotifications.map(n => ({ ...n, read: true }));
                    setAuthorityNotifications(updated);
                    setAuthorityUnreadCount(0);
                  }}>Mark all read</button>
                </div>
                <div className="notifications-list">
                  {authorityNotifications.slice(0, 5).map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => {
                        navigate(`/authority/complaint/${notif.complaintId}`);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notification-icon">
                        {notif.type === 'new_complaint' && <span>📋</span>}
                        {notif.type === 'priority_update' && <span>⚠️</span>}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notif.title}</p>
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">
                          {new Date(notif.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button onClick={() => {
                    navigate('/authority/notifications');
                    setShowNotifications(false);
                  }}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button className="logout-btn-dashboard" onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
      </div>

      {/* Stats Cards with Circular Progress */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-circle">
            <CircularProgressbar 
              value={100} 
              text={`${stats.total}`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#000080',
                textColor: '#000080',
              })}
            />
          </div>
          <h3>Total Complaints</h3>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-circle">
            <CircularProgressbar 
              value={stats.total > 0 ? (stats.reported / stats.total) * 100 : 0} 
              text={`${stats.reported}`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#6b7280',
                textColor: '#6b7280',
              })}
            />
          </div>
          <h3>Reported</h3>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-circle">
            <CircularProgressbar 
              value={stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0} 
              text={`${stats.inProgress}`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#f59e0b',
                textColor: '#f59e0b',
              })}
            />
          </div>
          <h3>In Progress</h3>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-circle">
            <CircularProgressbar 
              value={stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0} 
              text={`${stats.resolved}`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#10b981',
                textColor: '#10b981',
              })}
            />
          </div>
          <h3>Resolved</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          <button 
            className="quick-btn glass-card"
            onClick={() => navigate('/authority/complaints')}
          >
            <FaClipboardList className="quick-icon" />
            View All Complaints
          </button>
          <button 
            className="quick-btn glass-card"
            onClick={() => navigate('/authority/profile')}
          >
            <FaUserTie className="quick-icon" />
            My Profile
          </button>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="recent-activity">
        <h3>Recent Complaints</h3>
        <div className="activity-list">
          {recentComplaints.map(complaint => (
            <div 
              key={complaint.id} 
              className="activity-item"
              onClick={() => navigate(`/authority/complaint/${complaint.id}`)}
            >
              <div className="activity-icon">
                {getStatusIcon(complaint.status)}
              </div>
              <div className="activity-details">
                <h4>{complaint.issueLocation}</h4>
                <p>
                  <span className="complaint-id">#{complaint.id}</span>
                  <span 
                    className="complaint-status"
                    style={{ color: getStatusColor(complaint.status) }}
                  >
                    {complaint.status}
                  </span>
                </p>
                <p className="complaint-user">{complaint.userName}</p>
              </div>
              <div className="activity-time">
                {complaint.issueDate}
              </div>
            </div>
          ))}
        </div>
        {stats.total > 5 && (
          <button 
            className="view-all-btn"
            onClick={() => navigate('/authority/complaints')}
          >
            View All ({stats.total})
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboardPage;