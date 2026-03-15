import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, 
  FaClock 
} from 'react-icons/fa';

const RecentActivity = ({ complaints, t }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
      case 'reported':
        return <FaHourglassHalf color="#ffc107" />;
      case 'acknowledged':
        return <FaCheckCircle color="#17a2b8" />;
      case 'in-progress':
        return <FaExclamationTriangle color="#17a2b8" />;
      case 'almost-resolved':
        return <FaClock color="#6f42c1" />;
      case 'resolved':
      case 'completed':
        return <FaCheckCircle color="#28a745" />;
      default:
        return <FaHourglassHalf color="#ffc107" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': t.pending,
      'reported': t.pending,
      'acknowledged': t.acknowledged,
      'in-progress': t.inProgress,
      'almost-resolved': t.almostResolved,
      'resolved': t.resolved,
      'completed': t.completed
    };
    return statusMap[status] || status;
  };

  if (!complaints || complaints.length === 0) {
    return null;
  }

  return (
    <div className="recent-activity">
      <h3>{t.recentActivity}</h3>
      <div className="activity-list">
        {complaints.slice(0, 3).map(complaint => (
          <div 
            key={complaint._id} 
            className="activity-item"
            onClick={() => navigate(`/track-issue/${complaint._id}`)}
          >
            <div className="activity-icon">
              {getStatusIcon(complaint.status)}
            </div>
            <div className="activity-details">
              <h4>{complaint.title}</h4>
              <p>{t.status}: {getStatusText(complaint.status)}</p>
            </div>
            <div className="activity-time">
              {new Date(complaint.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      {complaints.length > 3 && (
        <button 
          className="view-all-btn"
          onClick={() => navigate('/my-issues')}
        >
          {t.viewAll} ({complaints.length})
        </button>
      )}
    </div>
  );
};

export default RecentActivity;