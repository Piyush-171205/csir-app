import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
  FaHourglassHalf, FaCheckCircle, FaExclamationTriangle,
  FaClock, FaSpinner,
} from 'react-icons/fa';
import { getComplaintById } from '../services/complaintService';

const TrackIssuePage = ({ t }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getComplaintById(id);
        setIssue(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  // ── Status helpers ────────────────────────────────────────────────────────────
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported':
      case 'pending':        return <FaHourglassHalf color="#ffc107" />;
      case 'acknowledged':   return <FaCheckCircle color="#17a2b8" />;
      case 'in-progress':    return <FaExclamationTriangle color="#007bff" />;
      case 'almost-resolved':return <FaClock color="#6f42c1" />;
      case 'completed':
      case 'resolved':       return <FaCheckCircle color="#28a745" />;
      default:               return <FaHourglassHalf color="#ffc107" />;
    }
  };

  const getProgressColor = (status, progress) => {
    const effective = progress >= 100 ? 'resolved' : status;
    switch (effective) {
      case 'acknowledged':    return '#17a2b8';
      case 'in-progress':     return '#007bff';
      case 'almost-resolved': return '#6f42c1';
      case 'resolved':
      case 'completed':       return '#28a745';
      default:                return '#ffc107';
    }
  };

  const getEffectiveStatus = (status, progress) =>
    progress >= 100 ? 'resolved' : status;

  const statusOrder = ['reported', 'acknowledged', 'in-progress', 'almost-resolved', 'completed'];

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="track-issue-container">
        <div className="page-header">
          <h2>{t.trackIssues}</h2>
          <button className="back-btn" onClick={() => navigate('/my-issues')}>← Back</button>
        </div>
        <div className="loading glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <FaSpinner className="spin" style={{ fontSize: 28, marginBottom: 12 }} />
          <p>Loading complaint details…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error || !issue) {
    return (
      <div className="track-issue-container">
        <div className="page-header">
          <h2>{t.trackIssues}</h2>
          <button className="back-btn" onClick={() => navigate('/my-issues')}>← Back</button>
        </div>
        <div className="error-message glass-card" style={{ padding: '24px' }}>
          {error || 'Complaint not found.'}
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(
    getEffectiveStatus(issue.status, issue.progress)
  );
  const displayProgress = issue.progress >= 100 ? 100 : (issue.progress || 0);
  const displayId = issue.complaintId || issue._id;

  return (
    <div className="track-issue-container">
      <div className="page-header">
        <h2>{t.trackIssues}</h2>
        <button className="back-btn" onClick={() => navigate('/my-issues')}>← Back</button>
      </div>

      <div className="issue-details glass-card">
        <h3>{issue.title}</h3>
        <p className="issue-location">{issue.location?.address}</p>
        <p className="issue-id">ID: {displayId}</p>

        {/* ── Status Timeline ── */}
        <div className="timeline-container">
          <h4>{t.statusTimeline}</h4>
          <div className="timeline-enhanced">
            {statusOrder.map((status, index) => {
              // Match history entry for this status step
              const historyEntry = issue.statusHistory?.find((h) => h.status === status);
              const isActive  = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div
                  key={status}
                  className={`timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="timeline-marker">
                    {getStatusIcon(status)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">
                      {t[status.replace('-', '')] || status}
                    </div>
                    {historyEntry && (
                      <div className="timeline-date">
                        {/* statusHistory entries use either 'date' or 'updatedAt' */}
                        {new Date(historyEntry.date || historyEntry.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                    {historyEntry?.note && (
                      <div className="timeline-note">{historyEntry.note}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="progress-details">
          <h4>{t.workProgress}</h4>
          <div className="progress-info">
            <div className="progress-circle">
              <CircularProgressbar
                value={displayProgress}
                text={`${displayProgress}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor:  getProgressColor(issue.status, issue.progress),
                  textColor: '#333',
                })}
              />
            </div>
            <div className="progress-text">
              <p>
                <strong>{t.status}:</strong>{' '}
                {t[getEffectiveStatus(issue.status, issue.progress)?.replace('-', '')] || getEffectiveStatus(issue.status, issue.progress)}
              </p>
              <p>
                <strong>{t.department}:</strong>{' '}
                {t.departments?.[issue.department] || issue.department}
              </p>
              <p>
                <strong>{t.expectedResolution}:</strong>{' '}
                {issue.expectedResolutionDate
                  ? new Date(issue.expectedResolutionDate).toLocaleDateString()
                  : '—'}
              </p>
              {issue.actualResolutionDate && (
                <p>
                  <strong>{t.resolvedOn}:</strong>{' '}
                  {new Date(issue.actualResolutionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Images (if any) ── */}
        {issue.images?.length > 0 && (
          <div className="issue-images" style={{ marginTop: '20px' }}>
            <h4>Attached Photos</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
              {issue.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`issue-${i}`}
                  style={{
                    width: 120, height: 90, objectFit: 'cover',
                    borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer',
                  }}
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackIssuePage;