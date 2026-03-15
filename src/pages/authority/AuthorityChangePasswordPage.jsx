import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const AuthorityChangePasswordPage = ({ currentUser, t, usersDB }) => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate current password
    if (passwords.current !== currentUser.password) {
      setError('Current password is incorrect');
      return;
    }
    
    // Validate new password
    if (passwords.new.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    // Validate confirm password
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    
    // In real app, would call API to update password
    setSuccess(true);
    setTimeout(() => {
      navigate('/authority/profile');
    }, 2000);
  };

  return (
    <div className="authority-change-password-container">
      <div className="page-header">
        <h2>Change Password</h2>
        <button className="back-btn" onClick={() => navigate('/authority/profile')}>
          ← Back to Profile
        </button>
      </div>

      <div className="change-password-card glass-card">
        {success ? (
          <div className="success-message-large">
            <FaCheckCircle size={50} color="#28a745" />
            <h3>Password Changed Successfully!</h3>
            <p>Redirecting to profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handleChange}
                required
              />
              <small>Minimum 8 characters</small>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Change Password
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/authority/profile')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthorityChangePasswordPage;