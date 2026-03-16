import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import FormGroup from '../components/common/FormGroup';
import { validateUsername, validatePassword } from '../utils/validators';
import { registerUser } from '../services/authService';

const RegisterPage = ({ t, securityQuestions }) => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: '',
    mobile: '', altMobile: '', email: '', address1: '', address2: '',
    city: '', district: '', state: '', pincode: '',
    identityType: '', idNumber: '', username: '', password: '',
    confirmPassword: '', securityQuestion: '', securityAnswer: '',
    acceptTerms: false,
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (registerErrors[name]) {
      setRegisterErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (apiError) setApiError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!validateUsername(registerData.username)) {
      errors.username =
        'Username must contain 1 capital letter, 1 small letter, 1 number, and 1 special character';
    }
    if (!validatePassword(registerData.password)) {
      errors.password = 'Password must be at least 8 characters long';
    }
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!registerData.acceptTerms) {
      errors.acceptTerms = 'You must accept Terms & Conditions';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Strip confirmPassword & acceptTerms — backend doesn't need them
      const { confirmPassword, acceptTerms, ...payload } = registerData;
      await registerUser(payload);

      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(message);
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

      <div className="page-content register-page-content">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Home
        </button>

        <div className="auth-card register-card">
          <div className="auth-header">
            <h2>{t.registerNew}</h2>
            <p>Create your account to start reporting issues</p>
          </div>

          <form className="auth-form registration-form" onSubmit={handleRegisterSubmit}>

            {apiError && <div className="error-message">{apiError}</div>}

            {/* ── Personal Info ── */}
            <h3>{t.personalInfo}</h3>
            <div className="form-row">
              <FormGroup label={t.firstName} required>
                <input type="text" name="firstName" value={registerData.firstName} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
              <FormGroup label={t.middleName}>
                <input type="text" name="middleName" value={registerData.middleName} onChange={handleRegisterChange} disabled={loading} />
              </FormGroup>
              <FormGroup label={t.lastName} required>
                <input type="text" name="lastName" value={registerData.lastName} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
            </div>

            <div className="form-row">
              <FormGroup label={t.dob} required>
                <input type="date" name="dob" value={registerData.dob} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
              <FormGroup label={t.gender} required>
                <select name="gender" value={registerData.gender} onChange={handleRegisterChange} required disabled={loading}>
                  <option value="">{t.gender}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.genderOther}</option>
                </select>
              </FormGroup>
            </div>

            {/* ── Contact Info ── */}
            <h3>{t.contactInfo}</h3>
            <div className="form-row">
              <FormGroup label={t.mobile} required>
                <input type="tel" name="mobile" value={registerData.mobile} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
              <FormGroup label={t.altMobile}>
                <input type="tel" name="altMobile" value={registerData.altMobile} onChange={handleRegisterChange} disabled={loading} />
              </FormGroup>
            </div>

            <FormGroup label={t.email} required>
              <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required disabled={loading} />
            </FormGroup>

            <FormGroup label={t.address1} required>
              <input type="text" name="address1" value={registerData.address1} onChange={handleRegisterChange} required disabled={loading} />
            </FormGroup>

            <FormGroup label={t.address2}>
              <input type="text" name="address2" value={registerData.address2} onChange={handleRegisterChange} disabled={loading} />
            </FormGroup>

            <div className="form-row">
              <FormGroup label={t.cityTown} required>
                <input type="text" name="city" value={registerData.city} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
              <FormGroup label={t.district} required>
                <input type="text" name="district" value={registerData.district} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
            </div>

            <div className="form-row">
              <FormGroup label={t.state} required>
                <input type="text" name="state" value={registerData.state} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
              <FormGroup label={t.pincode} required>
                <input type="text" name="pincode" value={registerData.pincode} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
            </div>

            {/* ── Identity Verification ── */}
            <h3>{t.identityVerification}</h3>
            <div className="form-row">
              <FormGroup label={t.identityType} required>
                <select name="identityType" value={registerData.identityType} onChange={handleRegisterChange} required disabled={loading}>
                  <option value="">{t.identityType}</option>
                  <option value="aadhaar">{t.aadhaar}</option>
                  <option value="pan">{t.pan}</option>
                  <option value="voter">{t.voterId}</option>
                  <option value="license">{t.drivingLicense}</option>
                </select>
              </FormGroup>
              <FormGroup label={t.idNumber} required>
                <input type="text" name="idNumber" value={registerData.idNumber} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
            </div>

            <FormGroup label={t.uploadId}>
              <input type="file" accept="image/*,.pdf" disabled={loading} />
            </FormGroup>

            {/* ── Account Credentials ── */}
            <h3>{t.accountCredentials}</h3>
            <FormGroup label={t.username} required>
              <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} required disabled={loading} />
              <div className="username-requirements">
                Must contain: 1 capital, 1 small, 1 number, 1 special character
              </div>
              {registerErrors.username && <div className="error-message">{registerErrors.username}</div>}
            </FormGroup>

            <div className="form-row">
              <FormGroup label={t.password} required>
                <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required disabled={loading} />
                <div className="password-requirements">Minimum 8 characters</div>
                {registerErrors.password && <div className="error-message">{registerErrors.password}</div>}
              </FormGroup>
              <FormGroup label={t.confirmPassword} required>
                <input type="password" name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterChange} required disabled={loading} />
                {registerErrors.confirmPassword && <div className="error-message">{registerErrors.confirmPassword}</div>}
              </FormGroup>
            </div>

            {/* ── Security ── */}
            <h3>{t.security}</h3>
            <div className="form-row">
              <FormGroup label={t.securityQuestion} required>
                <select name="securityQuestion" value={registerData.securityQuestion} onChange={handleRegisterChange} required disabled={loading}>
                  <option value="">Select a question</option>
                  {securityQuestions.map((q, index) => (
                    <option key={index} value={q}>{q}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label={t.securityAnswer} required>
                <input type="text" name="securityAnswer" value={registerData.securityAnswer} onChange={handleRegisterChange} required disabled={loading} />
              </FormGroup>
            </div>

            <div className="form-group checkbox-group">
              <input type="checkbox" name="acceptTerms" checked={registerData.acceptTerms} onChange={handleRegisterChange} id="acceptTerms" disabled={loading} />
              <label htmlFor="acceptTerms">{t.acceptTerms}</label>
            </div>
            {registerErrors.acceptTerms && <div className="error-message">{registerErrors.acceptTerms}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : t.registerBtn}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
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

export default RegisterPage;