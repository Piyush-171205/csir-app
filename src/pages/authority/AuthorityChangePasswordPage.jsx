import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { changePassword } from '../../services/authorityService';

const AuthorityChangePasswordPage = ({ currentUser, t }) => {
  const navigate = useNavigate();
  const [passwords, setPasswords]         = useState({ current:'', new:'', confirm:'' });
  const [showPasswords, setShowPasswords] = useState({ current:false, new:false, confirm:false });
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(false);
  const [loading, setLoading]             = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 8)                 { setError('New password must be at least 8 characters.'); return; }
    if (passwords.new !== passwords.confirm)       { setError('New passwords do not match.'); return; }
    if (passwords.current === passwords.new)       { setError('New password must differ from current.'); return; }

    setLoading(true); setError('');
    try {
      await changePassword(passwords.current, passwords.new);
      setSuccess(true);
      setTimeout(() => navigate('/authority/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Check your current password.');
    } finally { setLoading(false); }
  };

  const Toggle = ({ field }) => (
    <button type="button" className="password-toggle" onClick={()=>setShowPasswords(p=>({...p,[field]:!p[field]}))}>
      {showPasswords[field]?<FaEyeSlash/>:<FaEye/>}
    </button>
  );

  return (
    <div className="authority-change-password-container">
      <div className="page-header">
        <h2>Change Password</h2>
        <button className="back-btn" onClick={() => navigate('/authority/profile')}>← Back to Profile</button>
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
            {error && <div className="error-message">{error}</div>}
            {[['current','Current Password'],['new','New Password'],['confirm','Confirm New Password']].map(([field,label])=>(
              <div key={field} className="form-group">
                <label>{label}</label>
                <div className="password-input-wrapper">
                  <input type={showPasswords[field]?'text':'password'} name={field} value={passwords[field]}
                    onChange={handleChange} required disabled={loading} placeholder={`Enter ${label.toLowerCase()}`}/>
                  <Toggle field={field}/>
                </div>
                {field==='new'&&<small>Minimum 8 characters</small>}
                {field==='confirm'&&passwords.confirm&&passwords.new!==passwords.confirm&&<span className="error-text">Passwords do not match</span>}
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading||!!(passwords.new&&passwords.new!==passwords.confirm)}>
                {loading?<><FaSpinner className="spin"/> Changing…</>:'Change Password'}
              </button>
              <button type="button" className="cancel-btn" onClick={()=>navigate('/authority/profile')} disabled={loading}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default AuthorityChangePasswordPage;