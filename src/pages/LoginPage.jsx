import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const LoginPage = ({ t, usersDB, setIsLoggedIn, setCurrentUser }) => {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    const user = usersDB.find(u => u.username === loginUsername && u.password === loginPassword);
    
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      navigate('/dashboard');
    } else {
      setLoginError('Invalid username or password');
    }
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
            <h2>{t.login}</h2>
            <p>Welcome back! Please login to your account</p>
          </div>
          
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            {loginError && <div className="error-message">{loginError}</div>}
            
            <div className="form-group">
              <label>{t.username}</label>
              <input 
                type="text" 
                placeholder={t.username}
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t.password}</label>
              <input 
                type="password" 
                placeholder={t.password}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="button" className="forgot-password" onClick={() => navigate('/forgot-password')}>
              {t.forgotPassword}
            </button>
            
            <button type="submit" className="submit-btn">{t.login}</button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <button onClick={() => navigate('/register')}>Register</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;