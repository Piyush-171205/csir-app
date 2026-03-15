import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaUserTie, FaClipboardList, FaCheckCircle, 
  FaHourglassHalf, FaExclamationTriangle, FaChartBar,
  FaBell, FaUserCircle
} from 'react-icons/fa';
import { useAdminStats } from '../../hooks/useAdminStats';
import { monthlyReportData } from '../../data/adminData';

const AdminDashboardPage = ({ currentUser, t, handleLogout }) => {
  const navigate = useNavigate();
  const stats = useAdminStats();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications for admin
  const notifications = [
    { id: 1, title: 'New Complaint', message: 'High priority complaint from Sector 10', time: '5 min ago', read: false },
    { id: 2, title: 'Officer Added', message: 'New officer joined Road Department', time: '1 hour ago', read: false },
    { id: 3, title: 'System Update', message: 'Scheduled maintenance tonight at 2 AM', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header glass-card">
        <div className="welcome-message">
          <h2>Welcome, {currentUser?.name || 'Administrator'}!</h2>
          <p className="welcome-subtitle">Admin Dashboard - System Overview</p>
        </div>
        
        <div className="header-actions">
          <div className="notifications-wrapper">
            <button 
              className="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button>Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                      <div className="notification-content">
                        <p className="notification-title">{notif.title}</p>
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button onClick={() => navigate('/admin/notifications')}>
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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-card" onClick={() => navigate('/admin/citizens')}>
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Citizens</h3>
            <p className="stat-value">{stats.totalCitizens}</p>
            <p className="stat-subtext">
              <span className="active">{stats.activeCitizens} active</span>
              <span className="blocked">{stats.blockedCitizens} blocked</span>
            </p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => navigate('/admin/officers')}>
          <div className="stat-icon">
            <FaUserTie />
          </div>
          <div className="stat-content">
            <h3>Government Officers</h3>
            <p className="stat-value">{stats.totalOfficers}</p>
            <p className="stat-subtext">
              <span className="active">{stats.activeOfficers} active</span>
            </p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => navigate('/admin/complaints')}>
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>Total Complaints</h3>
            <p className="stat-value">{stats.totalComplaints}</p>
            <p className="stat-subtext">All time</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => navigate('/admin/complaints?status=pending')}>
          <div className="stat-icon">
            <FaHourglassHalf />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingComplaints}</p>
            <p className="stat-subtext">Awaiting action</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => navigate('/admin/complaints?status=in-progress')}>
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgressComplaints}</p>
            <p className="stat-subtext">Being worked on</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => navigate('/admin/complaints?status=resolved')}>
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Resolved</h3>
            <p className="stat-value">{stats.resolvedComplaints}</p>
            <p className="stat-subtext">Successfully closed</p>
          </div>
        </div>

        <div className="stat-card glass-card urgent" onClick={() => navigate('/admin/complaints?priority=urgent')}>
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Urgent</h3>
            <p className="stat-value">{stats.urgentComplaints}</p>
            <p className="stat-subtext">High priority</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/citizens')}>
            <FaUsers />
            <span>Manage Citizens</span>
          </button>
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/officers')}>
            <FaUserTie />
            <span>Manage Officers</span>
          </button>
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/complaints')}>
            <FaClipboardList />
            <span>View Complaints</span>
          </button>
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/categories')}>
            <FaChartBar />
            <span>Manage Categories</span>
          </button>
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/reports')}>
            <FaChartBar />
            <span>View Reports</span>
          </button>
          <button className="quick-action-card glass-card" onClick={() => navigate('/admin/notifications')}>
            <FaBell />
            <span>Announcements</span>
          </button>
        </div>
      </div>

      {/* Monthly Report Chart - Simple Bar Chart Representation */}
      <div className="chart-section glass-card">
        <h3>Monthly Complaint Report</h3>
        <div className="chart-container">
          <div className="chart-bars">
            {monthlyReportData.labels.map((label, index) => (
              <div key={index} className="chart-bar-group">
                <div className="bar-labels">
                  <span>{label}</span>
                </div>
                <div className="bars">
                  <div 
                    className="bar complaints" 
                    style={{ height: `${monthlyReportData.complaints[index] * 2}px` }}
                    title={`Complaints: ${monthlyReportData.complaints[index]}`}
                  />
                  <div 
                    className="bar resolved" 
                    style={{ height: `${monthlyReportData.resolved[index] * 2}px` }}
                    title={`Resolved: ${monthlyReportData.resolved[index]}`}
                  />
                  <div 
                    className="bar pending" 
                    style={{ height: `${monthlyReportData.pending[index] * 2}px` }}
                    title={`Pending: ${monthlyReportData.pending[index]}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item complaints">Total Complaints</span>
            <span className="legend-item resolved">Resolved</span>
            <span className="legend-item pending">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;