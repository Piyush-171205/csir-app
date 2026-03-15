import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const EmergencyPage = ({ t }) => {
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
        
        <div className="auth-card">
          <div className="auth-header">
            <h2>{t.emergency}</h2>
          </div>
          
          <div className="info-content">
            <p>🚓 Police: 100</p>
            <p>🚑 Ambulance: 102</p>
            <p>🔥 Fire: 101</p>
            <p>🚨 Women Helpline: 1091</p>
            <p>🏥 NMMC Hospital: 022-9876-5432</p>
            <p>🌊 Disaster Management: 108</p>
          </div>
          
          <button className="submit-btn" onClick={() => navigate('/')}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;