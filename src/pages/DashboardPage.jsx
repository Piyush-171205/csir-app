import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import { getUserStats } from '../services/userService';
import { getUserComplaints } from '../services/complaintService';

const DashboardPage = ({ currentUser, t, handleLogout }) => {
  // ── Stats state ───────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    completionRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  // ── Recent activity state ─────────────────────────────────────────────────────
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // ── Fetch on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        setStatsError('Could not load stats.');
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const complaints = await getUserComplaints();
        // Show the 5 most recent for the activity feed
        setRecentComplaints(complaints.slice(0, 5));
      } catch {
        // Activity feed failure is non-critical — silently ignore
      } finally {
        setActivityLoading(false);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  const StatsSkeleton = () => (
    <div className="stats-grid">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="stat-card glass-card" style={{ opacity: 0.5, textAlign: 'center', padding: '24px' }}>
          <FaSpinner className="spin" style={{ fontSize: 28, color: '#ccc' }} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard glass-card">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="welcome-message">
          {t.welcome} {currentUser?.firstName || currentUser?.username || 'User'}!!<br />
          <span className="welcome-subtitle">{t.howCanIHelp}</span>
        </div>
        <button className="logout-btn-dashboard" onClick={handleLogout}>
          {t.logout}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : statsError ? (
        <div className="error-message" style={{ marginBottom: '16px' }}>{statsError}</div>
      ) : (
        <div className="stats-grid">
          <StatsCard
            value={stats.total}
            total={stats.total || 1}
            label={t.totalComplaints}
            color="#000080"
          />
          <StatsCard
            value={stats.pending}
            total={stats.total || 1}
            label={t.pendingIssues}
            color="#ffc107"
          />
          <StatsCard
            value={stats.inProgress}
            total={stats.total || 1}
            label={t.inProgressIssues}
            color="#17a2b8"
          />
          <StatsCard
            value={stats.resolved}
            total={stats.total || 1}
            label={t.resolvedIssues}
            color="#28a745"
          />

          {/* Completion Rate — conic-gradient ring (no extra library needed) */}
          <div className="stat-card glass-card">
            <div className="stat-circle">
              <div
                style={{
                  background: `conic-gradient(#ff9933 ${stats.completionRate * 3.6}deg, #f0f0f0 0deg)`,
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#ff9933',
                  }}
                >
                  {stats.completionRate}%
                </div>
              </div>
            </div>
            <h3>{t.completionRate}</h3>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <QuickActions t={t} />

      {/* ── Recent Activity ── */}
      {activityLoading ? (
        <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5 }}>
          <FaSpinner className="spin" style={{ fontSize: 22 }} />
        </div>
      ) : (
        <RecentActivity complaints={recentComplaints} t={t} />
      )}
    </div>
  );
};

export default DashboardPage;