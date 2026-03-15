import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminChangePasswordPage = ({ currentUser, t, usersDB }) => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (passwords.current.length < 8) {
      setError('Current password must be at least 8 characters');
      return;
    }
    
    if (passwords.new.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(passwords.new);
    const hasLowerCase = /[a-z]/.test(passwords.new);
    const hasNumbers = /\d/.test(passwords.new);
    const hasSpecial = /[@$!%*?&]/.test(passwords.new);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecial)) {
      setError('Password must contain uppercase, lowercase, number and special character');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwords.current === passwords.new) {
      setError('New password must be different from current password');
      return;
    }
    
    // In real app, would call API to update password
    setSuccess(true);
    setTimeout(() => {
      navigate('/admin/profile');
    }, 2000);
  };

  const getPasswordStrength = () => {
    const pwd = passwords.new;
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 15;
    if (/[@$!%*?&]/.test(pwd)) strength += 10;
    
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColor = 
    strength < 50 ? '#dc3545' :
    strength < 75 ? '#ffc107' : '#28a745';

  return (
    <div className="admin-change-password-container">
      <div className="page-header">
        <h2>Change Password</h2>
        <button className="back-btn" onClick={() => navigate('/admin/profile')}>
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
            <div className="form-header">
              <FaLock size={30} color="#000080" />
              <h3>Update Your Password</h3>
              <p>Please choose a strong password that you don't use elsewhere</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="current"
                  value={passwords.current}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShowPassword('current')}
                >
                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="new"
                  value={passwords.new}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShowPassword('new')}
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password strength meter */}
              {passwords.new && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ width: `${strength}%`, backgroundColor: strengthColor }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: strengthColor }}>
                    {strength < 50 ? 'Weak' : strength < 75 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}

              <ul className="password-requirements">
                <li className={passwords.new.length >= 8 ? 'met' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[A-Z]/.test(passwords.new) ? 'met' : ''}>
                  ✓ At least one uppercase letter
                </li>
                <li className={/[a-z]/.test(passwords.new) ? 'met' : ''}>
                  ✓ At least one lowercase letter
                </li>
                <li className={/\d/.test(passwords.new) ? 'met' : ''}>
                  ✓ At least one number
                </li>
                <li className={/[@$!%*?&]/.test(passwords.new) ? 'met' : ''}>
                  ✓ At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShowPassword('confirm')}
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwords.confirm && passwords.new !== passwords.confirm && (
                <span className="error-text">Passwords do not match</span>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!!error || (passwords.new && passwords.new !== passwords.confirm)}
              >
                Change Password
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/admin/profile')}
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

export default AdminChangePasswordPage;