import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { getDepartmentFeedback } from '../../services/authorityService';

const DEPT_NAMES = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', garbage:'Garbage Department', infrastructure:'Infrastructure Department', education:'Education Department' };

const Stars = ({ rating }) => [1,2,3,4,5].map(i => {
  const full = Math.floor(rating), half = rating - full >= 0.5;
  if (i <= full)                return <FaStar key={i} color="#ffc107"/>;
  if (i === full + 1 && half)   return <FaStarHalfAlt key={i} color="#ffc107"/>;
  return <FaRegStar key={i} color="#ffc107"/>;
});

const DepartmentFeedbackPage = ({ t }) => {
  const navigate = useNavigate();
  const { department } = useParams();
  const [feedback, setFeedback]       = useState([]);
  const [avgRating, setAvgRating]     = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [filter, setFilter]           = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const { feedback: f, averageRating } = await getDepartmentFeedback();
        setFeedback(f); setAvgRating(averageRating);
      } catch (err) { setError(err.response?.data?.message || 'Failed to load feedback.'); }
      finally { setLoading(false); }
    })();
  }, [department]);

  const distribution = [5,4,3,2,1].reduce((acc, r) => {
    acc[r] = feedback.filter(f => f.rating === r).length;
    return acc;
  }, {});

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.rating === parseInt(filter));

  if (loading) return <div className="department-feedback-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="department-feedback-container">
      <div className="page-header">
        <h2>Feedback — {DEPT_NAMES[department]||department}</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      {error && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{error}</div>}

      <div className="feedback-summary-grid">
        <div className="summary-card glass-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <h3>Average Rating</h3>
            <p className="rating-value">{avgRating} / 5</p>
            <div className="stars"><Stars rating={parseFloat(avgRating)}/></div>
          </div>
        </div>
        <div className="summary-card glass-card">
          <div className="summary-icon">📝</div>
          <div className="summary-content">
            <h3>Total Feedback</h3>
            <p className="stat-value">{feedback.length}</p>
          </div>
        </div>
      </div>

      <div className="rating-distribution glass-card">
        <h3>Rating Distribution</h3>
        {[5,4,3,2,1].map(r => (
          <div key={r} className="distribution-row">
            <span className="rating-label">{r} ⭐</span>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{
                width: feedback.length ? `${(distribution[r]/feedback.length)*100}%` : '0%',
                backgroundColor: r>=4?'#28a745':r>=3?'#ffc107':'#dc3545',
              }}/>
            </div>
            <span className="rating-count">{distribution[r]}</span>
          </div>
        ))}
      </div>

      <div className="feedback-filter glass-card">
        <label>Filter by rating:</label>
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All Ratings</option>
          {[5,4,3,2,1].map(r=><option key={r} value={r}>{r} Star</option>)}
        </select>
      </div>

      <div className="feedback-list-container glass-card">
        <h3>Citizen Feedback</h3>
        {filtered.length === 0
          ? <div className="no-feedback"><p>No feedback found.</p></div>
          : <div className="feedback-list">
              {filtered.map((f, i) => (
                <div key={f._id||i} className="feedback-item">
                  <div className="feedback-header">
                    <div className="feedback-user">
                      <FaUserCircle size={30}/>
                      <span>{f.user ? `${f.user.firstName} ${f.user.lastName}` : 'Anonymous'}</span>
                    </div>
                    <div className="feedback-rating">
                      <Stars rating={f.rating}/>
                      <span className="rating-number">({f.rating}/5)</span>
                    </div>
                  </div>
                  <div className="feedback-content"><p>"{f.comment||f.review}"</p></div>
                  <div className="feedback-footer">
                    <span className="feedback-date"><FaCalendarAlt /> {new Date(f.createdAt||f.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};
export default DepartmentFeedbackPage;