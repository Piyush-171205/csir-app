import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaBell, FaClipboardList, FaUserTie, FaBuilding, FaSpinner } from 'react-icons/fa';
import { getDepartmentStats, getDepartmentComplaints, getNotifications, markAllNotificationsRead } from '../../services/authorityService';

const DEPT_NAMES = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', garbage:'Garbage Department', infrastructure:'Infrastructure Department', education:'Education Department' };
const STATUS_COLORS = { reported:'#6b7280', acknowledged:'#3b82f6', 'in-progress':'#f59e0b', 'almost-resolved':'#9b59b6', resolved:'#10b981', completed:'#10b981' };

const AuthorityDashboardPage = ({ currentUser, t, handleLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats]                   = useState(null);
  const [recentComplaints, setRecent]       = useState([]);
  const [notifications, setNotifications]   = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [showNotifs, setShowNotifs]         = useState(false);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, c, n] = await Promise.all([
          getDepartmentStats(),
          getDepartmentComplaints(),
          getNotifications(),
        ]);
        setStats(s);
        setRecent(c.slice(0, 5));
        setNotifications(n.notifications);
        setUnreadCount(n.unreadCount);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (loading) return (
    <div className="dashboard glass-card" style={{ textAlign:'center', padding:60 }}>
      <FaSpinner className="spin" style={{ fontSize:32 }}/><p style={{marginTop:12}}>Loading dashboard…</p>
    </div>
  );

  const statCards = [
    { label:'Total Complaints', value:stats?.total||0,       pct:100,                                                                   color:'#000080' },
    { label:'Reported',         value:stats?.reported||0,     pct:stats?.total?(stats.reported/stats.total)*100:0,                      color:'#6b7280' },
    { label:'In Progress',      value:stats?.inProgress||0,   pct:stats?.total?(stats.inProgress/stats.total)*100:0,                    color:'#f59e0b' },
    { label:'Resolved',         value:stats?.resolved||0,     pct:stats?.total?(stats.resolved/stats.total)*100:0,                      color:'#10b981' },
  ];

  return (
    <div className="dashboard glass-card">
      <div className="dashboard-header">
        <div className="welcome-message">
          <h2>{t.welcome} {currentUser?.firstName || currentUser?.username}!</h2>
          <p className="welcome-subtitle"><FaBuilding /> {DEPT_NAMES[currentUser?.department] || currentUser?.department}</p>
        </div>
        <div className="header-actions">
          <div className="notifications-wrapper">
            <button className="notifications-btn" onClick={() => setShowNotifs(!showNotifs)}>
              <FaBell />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n._id} className={`notification-item ${!n.read?'unread':''}`}
                      onClick={() => { navigate(`/authority/complaint/${n.complaintId}`); setShowNotifs(false); }}>
                      <div className="notification-content">
                        <p className="notification-title">{n.title}</p>
                        <p className="notification-message">{n.message}</p>
                        <span className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && <p style={{padding:12,color:'#888'}}>No notifications</p>}
                </div>
                <div className="notifications-footer">
                  <button onClick={() => { navigate('/authority/notifications'); setShowNotifs(false); }}>View all</button>
                </div>
              </div>
            )}
          </div>
          <button className="logout-btn-dashboard" onClick={handleLogout}>{t.logout}</button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, pct, color }) => (
          <div key={label} className="stat-card glass-card">
            <div className="stat-circle">
              <CircularProgressbar value={pct} text={`${value}`}
                styles={buildStyles({ textSize:'24px', pathColor:color, textColor:color })}/>
            </div>
            <h3>{label}</h3>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          <button className="quick-btn glass-card" onClick={() => navigate('/authority/complaints')}>
            <FaClipboardList className="quick-icon"/> View All Complaints
          </button>
          <button className="quick-btn glass-card" onClick={() => navigate('/authority/profile')}>
            <FaUserTie className="quick-icon"/> My Profile
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Complaints</h3>
        <div className="activity-list">
          {recentComplaints.length === 0
            ? <p style={{color:'#888',padding:'12px'}}>No complaints assigned yet.</p>
            : recentComplaints.map(c => (
              <div key={c._id} className="activity-item" onClick={() => navigate(`/authority/complaint/${c._id}`)}>
                <div className="activity-icon">
                  {c.status==='resolved'||c.status==='completed'?'✅':c.status==='in-progress'?'🚧':c.status==='acknowledged'?'👁️':'📋'}
                </div>
                <div className="activity-details">
                  <h4>{c.title}</h4>
                  <p>
                    <span className="complaint-id">#{c.complaintId || c._id.slice(-6).toUpperCase()}</span>
                    <span className="complaint-status" style={{ color: STATUS_COLORS[c.status]||'#888', marginLeft:8 }}>{c.status}</span>
                  </p>
                  <p className="complaint-user">
                    {c.reportedBy ? `${c.reportedBy.firstName} ${c.reportedBy.lastName}` : '—'}
                  </p>
                </div>
                <div className="activity-time">{new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          }
        </div>
        {(stats?.total || 0) > 5 && (
          <button className="view-all-btn" onClick={() => navigate('/authority/complaints')}>
            View All ({stats.total})
          </button>
        )}
      </div>
    </div>
  );
};
export default AuthorityDashboardPage;