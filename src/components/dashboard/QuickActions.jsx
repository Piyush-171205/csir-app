import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ t }) => {
  const navigate = useNavigate();

  const actions = [
    { icon: '📝', label: t.reportIssue, path: '/report-issue' },
    { icon: '📋', label: t.myIssues, path: '/my-issues' },
    { icon: '🔍', label: t.trackIssues, path: '/track-issue/R001' },
    { icon: '👤', label: t.userProfile, path: '/profile' }
  ];

  return (
    <div className="quick-actions">
      <h3>{t.quickActions}</h3>
      <div className="quick-buttons">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="quick-btn glass-card"
            onClick={() => navigate(action.path)}
          >
            <span className="quick-icon">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;