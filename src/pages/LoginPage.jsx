import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { loginUser } from '../services/authService';

const LoginPage = ({ t, setIsLoggedIn, setCurrentUser }) => {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const user = await loginUser(loginUsername, loginPassword);

      setIsLoggedIn(true);
      setCurrentUser(user);

      // Redirect based on role
      if (user.userType === 'citizen') navigate('/dashboard');
      else if (user.userType === 'authority') navigate('/authority/dashboard');
      else navigate('/admin/dashboard');

    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid username or password';
      setLoginError(message);
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button
              type="button"
              className="forgot-password"
              onClick={() => navigate('/forgot-password')}
              disabled={loading}
            >
              {t.forgotPassword}
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : t.login}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} disabled={loading}>
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;