import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { changePassword } from '../../services/userService';

const AdminChangePasswordPage = ({ currentUser, t }) => {
  const navigate = useNavigate();
  const [passwords, setPasswords]       = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const getStrength = () => {
    const p = passwords.new;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s += 25;
    if (/[A-Z]/.test(p))         s += 25;
    if (/[a-z]/.test(p))         s += 25;
    if (/\d/.test(p))            s += 15;
    if (/[@$!%*?&]/.test(p))     s += 10;
    return s;
  };

  const strength      = getStrength();
  const strengthColor = strength < 50 ? '#dc3545' : strength < 75 ? '#ffc107' : '#28a745';
  const strengthLabel = strength < 50 ? 'Weak' : strength < 75 ? 'Medium' : 'Strong';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 8)                                                { setError('New password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(passwords.new)||!/[a-z]/.test(passwords.new)||!/\d/.test(passwords.new)||!/[@$!%*?&]/.test(passwords.new)) { setError('Password must contain uppercase, lowercase, number and special character.'); return; }
    if (passwords.new !== passwords.confirm)                                      { setError('New passwords do not match.'); return; }
    if (passwords.current === passwords.new)                                      { setError('New password must differ from current.'); return; }

    setLoading(true); setError('');
    try {
      await changePassword(passwords.current, passwords.new);
      setSuccess(true);
      setTimeout(() => navigate('/admin/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Check your current password.');
    } finally { setLoading(false); }
  };

  const Toggle = ({ field }) => (
    <button type="button" className="password-toggle" onClick={() => setShowPasswords(p=>({...p,[field]:!p[field]}))}>
      {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
    </button>
  );

  return (
    <div className="admin-change-password-container">
      <div className="page-header">
        <h2>Change Password</h2>
        <button className="back-btn" onClick={() => navigate('/admin/profile')}>← Back to Profile</button>
      </div>

      <div className="change-password-card glass-card">
        {success ? (
          <div className="success-message-large">
            <FaCheckCircle size={50} color="#28a745"/>
            <h3>Password Changed Successfully!</h3>
            <p>Redirecting to profile…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-header">
              <FaLock size={30} color="#000080"/>
              <h3>Update Your Password</h3>
              <p>Choose a strong password you don't use elsewhere</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {[['current','Current Password'],['new','New Password'],['confirm','Confirm New Password']].map(([field, label]) => (
              <div className="form-group" key={field}>
                <label>{label}</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords[field] ? 'text' : 'password'}
                    name={field}
                    value={passwords[field]}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  <Toggle field={field}/>
                </div>
                {field === 'new' && passwords.new && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className="strength-fill" style={{width:`${strength}%`, backgroundColor:strengthColor}}/>
                    </div>
                    <span className="strength-text" style={{color:strengthColor}}>{strengthLabel}</span>
                  </div>
                )}
                {field === 'confirm' && passwords.confirm && passwords.new !== passwords.confirm && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </div>
            ))}

            <ul className="password-requirements">
              {[
                [passwords.new.length >= 8,        '✓ At least 8 characters'],
                [/[A-Z]/.test(passwords.new),      '✓ At least one uppercase letter'],
                [/[a-z]/.test(passwords.new),      '✓ At least one lowercase letter'],
                [/\d/.test(passwords.new),         '✓ At least one number'],
                [/[@$!%*?&]/.test(passwords.new),  '✓ At least one special character (@$!%*?&)'],
              ].map(([met, label]) => <li key={label} className={met ? 'met' : ''}>{label}</li>)}
            </ul>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading || (passwords.new && passwords.new !== passwords.confirm)}>
                {loading ? <><FaSpinner className="spin"/> Changing…</> : 'Change Password'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/admin/profile')} disabled={loading}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default AdminChangePasswordPage;