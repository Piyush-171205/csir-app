import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ForgotPasswordPage = ({ t }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('OTP has been sent to your registered mobile number');
    navigate('/login');
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
            <h2>{t.forgotPassword}</h2>
            <p>Enter your username to reset password</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.username}</label>
              <input type="text" placeholder={t.username} required />
            </div>
            
            <button type="submit" className="submit-btn">{t.otpVerification}</button>
          </form>
          
          <div className="auth-footer">
            <p>Remember your password? <button onClick={() => navigate('/login')}>Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;