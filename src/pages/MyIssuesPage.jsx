import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const MyIssuesPage = ({ currentUser, t, complaintsDB }) => {
  const navigate = useNavigate();
  const userIssues = complaintsDB.filter(issue => issue.reportedBy === currentUser?.username);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: t.pending },
      'reported': { class: 'status-pending', text: t.pending },
      'acknowledged': { class: 'status-acknowledged', text: t.acknowledged },
      'in-progress': { class: 'status-in-progress', text: t.inProgress },
      'almost-resolved': { class: 'status-almost-resolved', text: t.almostResolved },
      'resolved': { class: 'status-resolved', text: t.resolved },
      'completed': { class: 'status-resolved', text: t.completed }
    };
    return statusMap[status] || { class: 'status-pending', text: status };
  };

  const calculateProgress = (issue) => {
    if (issue.status === 'completed' || issue.status === 'resolved') return 100;
    if (issue.status === 'almost-resolved') return 90;
    if (issue.status === 'in-progress') return issue.progress || 50;
    if (issue.status === 'acknowledged') return 25;
    return 0;
  };

  return (
    <div className="my-issues-container">
      <div className="page-header">
        <h2>{t.myComplaints}</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>
      
      {userIssues.length === 0 ? (
        <div className="no-issues glass-card">
          <p>{t.noComplaints}</p>
          <button className="submit-btn" onClick={() => navigate('/report-issue')}>
            {t.reportIssue}
          </button>
        </div>
      ) : (
        <div className="issues-table-container glass-card">
          <table className="issues-table">
            <thead>
              <tr>
                <th>{t.complaintID}</th>
                <th>{t.complaintTitle}</th>
                <th>{t.department}</th>
                <th>{t.reportedOn}</th>
                <th>{t.status}</th>
                <th>{t.progress}</th>
                <th>{t.expectedResolution}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {userIssues.map(issue => {
                const status = getStatusBadge(issue.status);
                const progress = calculateProgress(issue);
                const expectedDate = new Date(issue.expectedResolutionDate);
                const today = new Date();
                const daysRemaining = Math.ceil((expectedDate - today) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={issue._id}>
                    <td className="complaint-id">{issue._id}</td>
                    <td className="complaint-title">{issue.title}</td>
                    <td>{t.departments[issue.department] || issue.department}</td>
                    <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${progress}%`,
                              backgroundColor: issue.status === 'pending' ? '#ffc107' : 
                                             issue.status === 'acknowledged' ? '#17a2b8' :
                                             issue.status === 'in-progress' ? '#007bff' :
                                             issue.status === 'almost-resolved' ? '#6f42c1' : '#28a745'
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="expected-date">
                        {new Date(issue.expectedResolutionDate).toLocaleDateString()}
                        {issue.status !== 'resolved' && issue.status !== 'completed' && daysRemaining > 0 && (
                          <span className="days-remaining">
                            ({daysRemaining} {t.daysRemaining})
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => navigate(`/track-issue/${issue._id}`)}
                      >
                        {t.viewDetails}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyIssuesPage;