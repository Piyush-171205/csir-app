import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckCircle, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../services/authorityService';

const NOTIF_ICONS = { new_complaint:'📋', complaint_assigned:'📌', status_update:'🔄', priority_update:'⚠️', default:'📢' };

const AuthorityNotificationsPage = ({ currentUser, t, setAuthorityNotifications, setAuthorityUnreadCount }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { notifications: n, unreadCount } = await getNotifications();
        setNotifications(n);
        if (setAuthorityUnreadCount) setAuthorityUnreadCount(unreadCount);
      } catch (err) { setError(err.response?.data?.message || 'Failed to load notifications.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      const updated = notifications.map(n => n._id===id ? {...n,read:true} : n);
      setNotifications(updated);
      if (setAuthorityUnreadCount) setAuthorityUnreadCount(updated.filter(n=>!n.read).length);
      if (setAuthorityNotifications) setAuthorityNotifications(updated);
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      const updated = notifications.map(n => ({...n,read:true}));
      setNotifications(updated);
      if (setAuthorityUnreadCount) setAuthorityUnreadCount(0);
      if (setAuthorityNotifications) setAuthorityNotifications(updated);
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      const updated = notifications.filter(n => n._id !== id);
      setNotifications(updated);
      if (setAuthorityUnreadCount) setAuthorityUnreadCount(updated.filter(n=>!n.read).length);
    } catch {}
  };

  if (loading) return <div className="authority-notifications-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="authority-notifications-container">
      <div className="page-header">
        <h2>Notifications</h2>
        <div className="header-actions">
          <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all as read</button>
          <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>← Back</button>
        </div>
      </div>

      {error && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{error}</div>}

      <div className="notifications-list-container glass-card">
        {notifications.length === 0
          ? <div className="no-notifications"><FaBell size={50}/><p>No notifications yet</p></div>
          : <div className="notifications-list">
              {notifications.map(n => (
                <div key={n._id} className={`notification-item ${!n.read?'unread':''}`}>
                  <div className="notification-icon">
                    <span className="notif-emoji">{NOTIF_ICONS[n.type]||NOTIF_ICONS.default}</span>
                  </div>
                  <div className="notification-content">
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                    <div className="notification-meta">
                      <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!n.read && (
                      <button className="mark-read-btn" onClick={()=>handleMarkRead(n._id)} title="Mark as read"><FaCheckCircle/></button>
                    )}
                    {n.complaintId && (
                      <button className="view-btn" title="View complaint" onClick={()=>{ handleMarkRead(n._id); navigate(`/authority/complaint/${n.complaintId}`); }}>
                        <FaEye/>
                      </button>
                    )}
                    <button className="delete-btn" onClick={()=>handleDelete(n._id)} title="Delete"><FaTrash/></button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};
export default AuthorityNotificationsPage;