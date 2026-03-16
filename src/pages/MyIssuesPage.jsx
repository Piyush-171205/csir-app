import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { getUserComplaints } from '../services/complaintService';

const MyIssuesPage = ({ currentUser, t }) => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getUserComplaints();
        setIssues(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your complaints.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusBadge = (status, progress) => {
    // If progress is 100, always treat as resolved regardless of status field
    const effectiveStatus = progress >= 100 ? 'resolved' : status;
    const statusMap = {
      'pending':         { class: 'status-pending',         text: t.pending },
      'reported':        { class: 'status-pending',         text: t.pending },
      'acknowledged':    { class: 'status-acknowledged',    text: t.acknowledged },
      'in-progress':     { class: 'status-in-progress',     text: t.inProgress },
      'almost-resolved': { class: 'status-almost-resolved', text: t.almostResolved },
      'resolved':        { class: 'status-resolved',        text: t.resolved },
      'completed':       { class: 'status-resolved',        text: t.completed },
    };
    return statusMap[effectiveStatus] || { class: 'status-pending', text: effectiveStatus };
  };

  const calculateProgress = (issue) => {
    // Always trust the actual progress value from DB first
    if (issue.progress >= 100) return 100;
    if (issue.status === 'completed' || issue.status === 'resolved') return 100;
    if (issue.status === 'almost-resolved') return issue.progress || 90;
    if (issue.status === 'in-progress') return issue.progress || 50;
    if (issue.status === 'acknowledged') return issue.progress || 25;
    return issue.progress || 0;
  };

  const getProgressColor = (issue) => {
    const effectiveStatus = issue.progress >= 100 ? 'resolved' : issue.status;
    switch (effectiveStatus) {
      case 'acknowledged':    return '#17a2b8';
      case 'in-progress':     return '#007bff';
      case 'almost-resolved': return '#6f42c1';
      case 'resolved':
      case 'completed':       return '#28a745';
      default:                return '#ffc107';
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="my-issues-container">
        <div className="page-header">
          <h2>{t.myComplaints}</h2>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
        <div className="loading glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <FaSpinner className="spin" style={{ fontSize: 28, marginBottom: 12 }} />
          <p>Loading your complaints…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="my-issues-container">
        <div className="page-header">
          <h2>{t.myComplaints}</h2>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
        <div className="error-message glass-card" style={{ padding: '24px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="my-issues-container">
      <div className="page-header">
        <h2>{t.myComplaints}</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {issues.length === 0 ? (
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
              {issues.map((issue) => {
                const status = getStatusBadge(issue.status, issue.progress);
                const progress = calculateProgress(issue);
                const expectedDate = new Date(issue.expectedResolutionDate);
                const daysRemaining = Math.ceil((expectedDate - new Date()) / (1000 * 60 * 60 * 24));
                // Backend uses complaintId (e.g. CMP-001); fall back to _id for display
                const displayId = issue.complaintId || issue._id;

                return (
                  <tr key={issue._id}>
                    <td className="complaint-id">{displayId}</td>
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
                              backgroundColor: getProgressColor(issue),
                            }}
                          />
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="expected-date">
                        {issue.expectedResolutionDate
                          ? new Date(issue.expectedResolutionDate).toLocaleDateString()
                          : '—'}
                        {issue.status !== 'resolved' &&
                          issue.status !== 'completed' &&
                          daysRemaining > 0 && (
                            <span className="days-remaining">
                              ({daysRemaining} {t.daysRemaining})
                            </span>
                          )}
                      </div>
                    </td>
                    <td>
                      {/* Navigate using MongoDB _id so TrackIssuePage can fetch by ID */}
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