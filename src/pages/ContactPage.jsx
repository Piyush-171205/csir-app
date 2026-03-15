import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ContactPage = ({ t }) => {
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
            <h2>{t.contactUs}</h2>
          </div>
          
          <div className="info-content">
            <p>📞 NMMC Helpline: 022-1234-5678</p>
            <p>📞 Ward Office: 022-8765-4321</p>
            <p>📧 Email: help@nmmc.gov.in</p>
            <p>🏛️ Address: NMMC Headquarters, Navi Mumbai</p>
            <p>🕒 Office Hours: Monday-Friday, 10:00 AM - 5:00 PM</p>
          </div>
          
          <button className="submit-btn" onClick={() => navigate('/')}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;