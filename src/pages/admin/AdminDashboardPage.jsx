import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserTie, FaClipboardList, FaCheckCircle,
  FaHourglassHalf, FaExclamationTriangle, FaChartBar,
  FaBell, FaSpinner,
} from 'react-icons/fa';
import { getAdminStats } from '../../services/adminService';

const AdminDashboardPage = ({ currentUser, t, handleLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="admin-dashboard" style={{ textAlign: 'center', padding: 60 }}>
      <FaSpinner className="spin" style={{ fontSize: 32 }} /><p style={{ marginTop: 12 }}>Loading dashboard…</p>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header glass-card">
        <div className="welcome-message">
          <h2>Welcome, {currentUser?.firstName || 'Administrator'}!</h2>
          <p className="welcome-subtitle">Admin Dashboard — System Overview</p>
        </div>
        <div className="header-actions">
          <button className="logout-btn-dashboard" onClick={handleLogout}>{t.logout}</button>
        </div>
      </div>

      {error && <div className="error-message glass-card" style={{ padding: 16, marginBottom: 16 }}>{error}</div>}

      <div className="stats-grid">
        {[
          { label: 'Total Citizens',   value: stats?.totalCitizens,       sub: `${stats?.activeCitizens} active · ${stats?.blockedCitizens} blocked`, icon: <FaUsers />,                route: '/admin/citizens' },
          { label: 'Officers',         value: stats?.totalOfficers,       sub: `${stats?.activeOfficers} active`,                                      icon: <FaUserTie />,              route: '/admin/officers' },
          { label: 'Total Complaints', value: stats?.totalComplaints,     sub: 'All time',                                                             icon: <FaClipboardList />,        route: '/admin/complaints' },
          { label: 'Pending',          value: stats?.pendingComplaints,   sub: 'Awaiting action',                                                      icon: <FaHourglassHalf />,        route: '/admin/complaints' },
          { label: 'In Progress',      value: stats?.inProgressComplaints,sub: 'Being worked on',                                                      icon: <FaExclamationTriangle />,  route: '/admin/complaints' },
          { label: 'Resolved',         value: stats?.resolvedComplaints,  sub: 'Successfully closed',                                                  icon: <FaCheckCircle />,          route: '/admin/complaints' },
          { label: 'Urgent',           value: stats?.urgentComplaints,    sub: 'High priority',                                                        icon: <FaExclamationTriangle />,  route: '/admin/complaints', urgent: true },
        ].map(({ label, value, sub, icon, route, urgent }) => (
          <div key={label} className={`stat-card glass-card${urgent ? ' urgent' : ''}`} onClick={() => navigate(route)} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
              <h3>{label}</h3>
              <p className="stat-value">{value ?? '—'}</p>
              <p className="stat-subtext">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {[
            ['/admin/citizens',      <FaUsers />,       'Manage Citizens'],
            ['/admin/officers',      <FaUserTie />,     'Manage Officers'],
            ['/admin/complaints',    <FaClipboardList />,'View Complaints'],
            ['/admin/categories',    <FaChartBar />,    'Manage Categories'],
            ['/admin/reports',       <FaChartBar />,    'View Reports'],
            ['/admin/notifications', <FaBell />,        'Announcements'],
          ].map(([route, icon, label]) => (
            <button key={route} className="quick-action-card glass-card" onClick={() => navigate(route)}>
              {icon}<span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {stats?.monthlyTrend?.length > 0 && (
        <div className="chart-section glass-card">
          <h3>Recent Monthly Trend</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {stats.monthlyTrend.map((m, i) => {
                const monthName = new Date(0, m._id.month - 1).toLocaleString('default', { month: 'short' });
                return (
                  <div key={i} className="chart-bar-group">
                    <div className="bar-labels"><span>{monthName}</span></div>
                    <div className="bars">
                      <div className="bar complaints" style={{ height: `${m.total * 2}px` }} title={`Total: ${m.total}`} />
                      <div className="bar resolved"   style={{ height: `${m.resolved * 2}px` }} title={`Resolved: ${m.resolved}`} />
                      <div className="bar pending"    style={{ height: `${m.pending * 2}px` }} title={`Pending: ${m.pending}`} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span className="legend-item complaints">Total</span>
              <span className="legend-item resolved">Resolved</span>
              <span className="legend-item pending">Pending</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;