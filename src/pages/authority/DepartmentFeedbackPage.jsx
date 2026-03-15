import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { departmentNames, feedbackData } from '../../data/authorityData.js';

const DepartmentFeedbackPage = ({ t }) => {
  const navigate = useNavigate();
  const { department } = useParams();
  
  const [filter, setFilter] = useState('all');
  
  const departmentFeedbacks = feedbackData[department] || [];
  
  // Calculate average rating
  const avgRating = departmentFeedbacks.length > 0 
    ? (departmentFeedbacks.reduce((sum, f) => sum + f.rating, 0) / departmentFeedbacks.length).toFixed(1)
    : 0;

  // Rating distribution
  const ratingDistribution = {
    5: departmentFeedbacks.filter(f => f.rating === 5).length,
    4: departmentFeedbacks.filter(f => f.rating === 4).length,
    3: departmentFeedbacks.filter(f => f.rating === 3).length,
    2: departmentFeedbacks.filter(f => f.rating === 2).length,
    1: departmentFeedbacks.filter(f => f.rating === 1).length
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ffc107" />);
      }
    }
    return stars;
  };

  // Filter feedback by rating
  const filteredFeedbacks = filter === 'all' 
    ? departmentFeedbacks 
    : departmentFeedbacks.filter(f => f.rating === parseInt(filter));

  return (
    <div className="department-feedback-container">
      <div className="page-header">
        <h2>Department Feedback - {departmentNames[department]}</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Summary Cards */}
      <div className="feedback-summary-grid">
        <div className="summary-card glass-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <h3>Average Rating</h3>
            <p className="rating-value">{avgRating} / 5</p>
            <div className="stars">
              {renderStars(parseFloat(avgRating))}
            </div>
          </div>
        </div>

        <div className="summary-card glass-card">
          <div className="summary-icon">📝</div>
          <div className="summary-content">
            <h3>Total Feedback</h3>
            <p className="stat-value">{departmentFeedbacks.length}</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rating-distribution glass-card">
        <h3>Rating Distribution</h3>
        {[5,4,3,2,1].map(rating => (
          <div key={rating} className="distribution-row">
            <span className="rating-label">{rating} ⭐</span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${(ratingDistribution[rating] / departmentFeedbacks.length) * 100}%`,
                  backgroundColor: rating >= 4 ? '#28a745' : rating >= 3 ? '#ffc107' : '#dc3545'
                }}
              />
            </div>
            <span className="rating-count">{ratingDistribution[rating]}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="feedback-filter glass-card">
        <label>Filter by rating:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Ratings</option>
          <option value="5">5 Star</option>
          <option value="4">4 Star</option>
          <option value="3">3 Star</option>
          <option value="2">2 Star</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="feedback-list-container glass-card">
        <h3>Citizen Feedback</h3>
        
        {filteredFeedbacks.length === 0 ? (
          <div className="no-feedback">
            <p>No feedback found for this rating.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {filteredFeedbacks.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <div className="feedback-header">
                  <div className="feedback-user">
                    <FaUserCircle size={30} />
                    <span>{feedback.user}</span>
                  </div>
                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                    <span className="rating-number">({feedback.rating}/5)</span>
                  </div>
                </div>
                <div className="feedback-content">
                  <p>"{feedback.review}"</p>
                </div>
                <div className="feedback-footer">
                  <span className="feedback-date">
                    <FaCalendarAlt /> {feedback.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentFeedbackPage;