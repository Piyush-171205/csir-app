import React from 'react';
import { complaintsDB } from '../data/mockData';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';

const DashboardPage = ({ currentUser, t, handleLogout }) => {
  const userComplaints = complaintsDB.filter(c => c.reportedBy === currentUser?.username);
  const totalComplaints = userComplaints.length;
  const pendingComplaints = userComplaints.filter(c => c.status === 'pending' || c.status === 'reported').length;
  const inProgressComplaints = userComplaints.filter(c => c.status === 'in-progress' || c.status === 'acknowledged' || c.status === 'almost-resolved').length;
  const resolvedComplaints = userComplaints.filter(c => c.status === 'resolved' || c.status === 'completed').length;
  const completionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  
  return (
    <div className="dashboard glass-card">
      <div className="dashboard-header">
        <div className="welcome-message">
          {t.welcome} {currentUser?.firstName || currentUser?.username || 'User'}!!<br />
          <span className="welcome-subtitle">{t.howCanIHelp}</span>
        </div>
        <button className="logout-btn-dashboard" onClick={handleLogout}>
          {t.logout}
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard 
          value={totalComplaints} 
          total={totalComplaints || 1} 
          label={t.totalComplaints} 
          color="#000080" 
        />
        <StatsCard 
          value={pendingComplaints} 
          total={totalComplaints || 1} 
          label={t.pendingIssues} 
          color="#ffc107" 
        />
        <StatsCard 
          value={inProgressComplaints} 
          total={totalComplaints || 1} 
          label={t.inProgressIssues} 
          color="#17a2b8" 
        />
        <StatsCard 
          value={resolvedComplaints} 
          total={totalComplaints || 1} 
          label={t.resolvedIssues} 
          color="#28a745" 
        />
        <div className="stat-card glass-card">
          <div className="stat-circle">
            <div className="circular-progress" style={{ 
              background: `conic-gradient(#ff9933 ${completionRate * 3.6}deg, #f0f0f0 0deg)`,
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '50%', 
                width: '80px', 
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#ff9933'
              }}>
                {completionRate}%
              </div>
            </div>
          </div>
          <h3>{t.completionRate}</h3>
        </div>
      </div>
      
      <QuickActions t={t} />
      <RecentActivity complaints={userComplaints} t={t} />
    </div>
  );
};

export default DashboardPage;