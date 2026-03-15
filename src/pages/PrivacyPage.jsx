import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PrivacyPage = ({ t }) => {
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
            <h2>{t.privacyTitle}</h2>
          </div>
          
          <div className="info-content">
            <p>{t.privacyContent1}</p>
            <p><strong>Information Collection:</strong> {t.privacyContent2}</p>
            <p><strong>Use of Information:</strong> {t.privacyContent3}</p>
            <p><strong>Data Security:</strong> {t.privacyContent4}</p>
            <p><strong>Your Rights:</strong> {t.privacyContent5}</p>
          </div>
          
          <button className="submit-btn" onClick={() => navigate('/')}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;