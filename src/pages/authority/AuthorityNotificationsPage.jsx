import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckCircle, FaTrash, FaEye } from 'react-icons/fa';

const AuthorityNotificationsPage = ({ 
  currentUser, 
  t, 
  authorityNotifications, 
  setAuthorityNotifications,
  setAuthorityUnreadCount 
}) => {
  const navigate = useNavigate();

  const markAsRead = (notificationId) => {
    const updated = authorityNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setAuthorityNotifications(updated);
    setAuthorityUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = authorityNotifications.map(n => ({ ...n, read: true }));
    setAuthorityNotifications(updated);
    setAuthorityUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    const updated = authorityNotifications.filter(n => n.id !== notificationId);
    setAuthorityNotifications(updated);
    setAuthorityUnreadCount(updated.filter(n => !n.read).length);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_complaint':
        return '📋';
      case 'priority_update':
        return '⚠️';
      case 'status_update':
        return '🔄';
      default:
        return '📢';
    }
  };

  return (
    <div className="authority-notifications-container">
      <div className="page-header">
        <h2>Notifications</h2>
        <div className="header-actions">
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
          <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>
            ← Back
          </button>
        </div>
      </div>

      <div className="notifications-list-container glass-card">
        {authorityNotifications.length === 0 ? (
          <div className="no-notifications">
            <FaBell size={50} />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notifications-list">
            {authorityNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <span className="notif-emoji">{getNotificationIcon(notif.type)}</span>
                </div>
                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="notification-actions">
                  {!notif.read && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notif.id)}
                      title="Mark as read"
                    >
                      <FaCheckCircle />
                    </button>
                  )}
                  {notif.complaintId && (
                    <button 
                      className="view-btn"
                      onClick={() => {
                        markAsRead(notif.id);
                        navigate(`/authority/complaint/${notif.complaintId}`);
                      }}
                      title="View complaint"
                    >
                      <FaEye />
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityNotificationsPage;