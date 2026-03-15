import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const DisclaimerPage = ({ t }) => {
  const navigate = useNavigate();

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
        
        <div className="auth-card large">
          <div className="auth-header">
            <h2>{t.disclaimerTitle}</h2>
          </div>
          
          <div className="info-content">
            <p>{t.disclaimerContent1}</p>
            <p>{t.disclaimerContent2}</p>
            <p>{t.disclaimerContent3}</p>
          </div>
          
          <button className="submit-btn" onClick={() => navigate('/')}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;