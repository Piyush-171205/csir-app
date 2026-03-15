import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AppFeedbackPage = ({ t, appFeedbackDB, ratingLabels }) => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    feedback: '',
    category: ''
  });

  const handleSetRating = (rating) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newFeedback = {
      id: 'FB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...feedbackData,
      ratingLabel: ratingLabels.find(r => r.value === feedbackData.rating)?.label || '',
      reportedBy: 'anonymous',
      reportedAt: new Date().toISOString()
    };
    
    appFeedbackDB.push(newFeedback);
    alert('Thank you for your valuable feedback!');
    navigate('/');
  };

  return (
    <div className="india-flag-page">
      <div className="flag-overlay"></div>
      <div className="flag-stripe top-saffron"></div>
      <div className="flag-stripe middle-white"></div>
      <div className="flag-stripe bottom-green"></div>
      <div className="flag-ashoka-chakra">🔄</div>
      
      <div className="page-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Home
        </button>
        
        <div className="auth-card">
          <div className="auth-header">
            <h2>{t.appFeedbackTitle}</h2>
            <p>{t.appFeedbackDesc}</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.yourRating} *</label>
              <div className="rating-enhanced">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-star ${feedbackData.rating >= num ? 'selected' : ''}`}
                    onClick={() => handleSetRating(num)}
                  >
                    {feedbackData.rating >= num ? '★' : '☆'}
                  </button>
                ))}
              </div>
              {feedbackData.rating > 0 && (
                <div className="rating-label">
                  {ratingLabels.find(r => r.value === feedbackData.rating)?.icon} {t.ratingLabels[feedbackData.rating]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{t.feedbackCategory}</label>
              <select name="category" value={feedbackData.category} onChange={handleChange}>
                <option value="">{t.selectCategory}</option>
                <option value="usability">Usability</option>
                <option value="features">Features</option>
                <option value="performance">Performance</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.yourFeedback} *</label>
              <textarea
                name="feedback"
                value={feedbackData.feedback}
                onChange={handleChange}
                rows="5"
                placeholder="Share your thoughts about the app..."
                required
              />
            </div>

            <button type="submit" className="submit-btn">{t.submit}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppFeedbackPage;