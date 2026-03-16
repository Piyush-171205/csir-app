import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { forgotPassword, resetPassword } from '../services/authService';

/*
  Two-step flow:
  Step 1 — User enters email → POST /api/auth/forgot-password → OTP sent (logged on server)
  Step 2 — User enters OTP + new password → POST /api/auth/reset-password

  NOTE: Your current backend's reset-password endpoint doesn't verify the OTP
  (it's a stub). The OTP field is included here on the frontend so you can
  wire it up once the backend validates it. Until then the UX still works.
*/

const ForgotPasswordPage = ({ t }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Step 1: Request OTP ───────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setSuccessMsg(data.message || 'OTP sent to your email. Check server logs during development.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(email, newPassword);
      setSuccessMsg(data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
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
        <button className="back-home-btn" onClick={() => navigate('/login')}>
          <FaArrowLeft /> Back to Login
        </button>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Forgot Password</h2>
            <p>
              {step === 1
                ? 'Enter your registered email to receive an OTP'
                : 'Enter the OTP and your new password'}
            </p>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '0 8px' }}>
            {['Enter Email', 'Reset Password'].map((label, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: step === i + 1 ? 700 : 400,
                  background: step === i + 1 ? '#FF671F' : step > i + 1 ? '#138808' : '#eee',
                  color: step >= i + 1 ? '#fff' : '#666',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMsg && (
            <div className="success-message" style={{ color: '#138808', marginBottom: '12px', fontSize: '14px' }}>
              {successMsg}
            </div>
          )}

          {/* ── Step 1 form ── */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label>Registered Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* ── Step 2 form ── */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>OTP (sent to {email})</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setError(''); }}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmNewPassword}
                  onChange={(e) => { setConfirmNewPassword(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button
                type="button"
                className="forgot-password"
                onClick={() => { setStep(1); setSuccessMsg(''); setError(''); }}
                disabled={loading}
              >
                ← Use a different email
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <button onClick={() => navigate('/login')} disabled={loading}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;