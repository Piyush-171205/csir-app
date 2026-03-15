import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, 
  FaClock 
} from 'react-icons/fa';

const TrackIssuePage = ({ t, complaintsDB }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  
  useEffect(() => {
    const foundIssue = complaintsDB.find(c => c._id === id);
    setIssue(foundIssue || complaintsDB[0]);
  }, [id, complaintsDB]);

  if (!issue) return <div className="loading">Loading...</div>;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'reported':
      case 'pending':
        return <FaHourglassHalf color="#ffc107" />;
      case 'acknowledged':
        return <FaCheckCircle color="#17a2b8" />;
      case 'in-progress':
        return <FaExclamationTriangle color="#007bff" />;
      case 'almost-resolved':
        return <FaClock color="#6f42c1" />;
      case 'completed':
      case 'resolved':
        return <FaCheckCircle color="#28a745" />;
      default:
        return <FaHourglassHalf color="#ffc107" />;
    }
  };

  const statusOrder = ['reported', 'acknowledged', 'in-progress', 'almost-resolved', 'completed'];
  
  const getStatusIndex = (status) => {
    return statusOrder.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(issue.status);

  return (
    <div className="track-issue-container">
      <div className="page-header">
        <h2>{t.trackIssues}</h2>
        <button className="back-btn" onClick={() => navigate('/my-issues')}>← Back</button>
      </div>
      
      <div className="issue-details glass-card">
        <h3>{issue.title}</h3>
        <p className="issue-location">{issue.location.address}</p>
        <p className="issue-id">ID: {issue._id}</p>
        
        {/* Enhanced Timeline */}
        <div className="timeline-container">
          <h4>{t.statusTimeline}</h4>
          <div className="timeline-enhanced">
            {statusOrder.map((status, index) => {
              const statusHistory = issue.statusHistory.find(h => h.status === status);
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status} className={`timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-marker">
                    {getStatusIcon(status)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">
                      {t[status.replace('-', '')] || status}
                    </div>
                    {statusHistory && (
                      <div className="timeline-date">
                        {new Date(statusHistory.date).toLocaleDateString()}
                      </div>
                    )}
                    {statusHistory?.note && (
                      <div className="timeline-note">{statusHistory.note}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Progress */}
        <div className="progress-details">
          <h4>{t.workProgress}</h4>
          <div className="progress-info">
            <div className="progress-circle">
              <CircularProgressbar 
                value={issue.progress || 0} 
                text={`${issue.progress || 0}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: issue.status === 'pending' ? '#ffc107' : 
                             issue.status === 'acknowledged' ? '#17a2b8' :
                             issue.status === 'in-progress' ? '#007bff' :
                             issue.status === 'almost-resolved' ? '#6f42c1' : '#28a745',
                  textColor: '#333',
                })}
              />
            </div>
            <div className="progress-text">
              <p><strong>{t.status}:</strong> {t[issue.status.replace('-', '')] || issue.status}</p>
              <p><strong>{t.department}:</strong> {t.departments[issue.department] || issue.department}</p>
              <p><strong>{t.expectedResolution}:</strong> {new Date(issue.expectedResolutionDate).toLocaleDateString()}</p>
              {issue.actualResolutionDate && (
                <p><strong>{t.resolvedOn}:</strong> {new Date(issue.actualResolutionDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackIssuePage;