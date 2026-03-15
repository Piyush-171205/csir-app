import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import FormGroup from '../components/common/FormGroup';

const ProfilePage = ({ currentUser, t, usersDB, handleLogout }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ ...currentUser });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const index = usersDB.findIndex(u => u.username === currentUser.username);
    if (index !== -1) {
      usersDB[index] = { ...usersDB[index], ...profileData };
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <h2>{t.userProfile}</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {showSuccess && (
        <div className="success-message">
          {t.profileUpdated}
        </div>
      )}

      <div className="profile-card glass-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            <FaUserCircle size={80} color="#000080" />
          </div>
          <h3>{profileData.firstName} {profileData.lastName}</h3>
          <p className="username">@{profileData.username}</p>
        </div>

        {!isEditing ? (
          <>
            <div className="profile-section">
              <h4>{t.personalInformation}</h4>
              <div className="profile-details-grid">
                <div className="detail-item">
                  <label>{t.firstName}:</label>
                  <span>{profileData.firstName}</span>
                </div>
                <div className="detail-item">
                  <label>{t.middleName}:</label>
                  <span>{profileData.middleName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t.lastName}:</label>
                  <span>{profileData.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>{t.dob}:</label>
                  <span>{profileData.dob}</span>
                </div>
                <div className="detail-item">
                  <label>{t.gender}:</label>
                  <span>{profileData.gender}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>{t.contactInformation}</h4>
              <div className="profile-details-grid">
                <div className="detail-item">
                  <label>{t.mobile}:</label>
                  <span>{profileData.mobile}</span>
                </div>
                <div className="detail-item">
                  <label>{t.altMobile}:</label>
                  <span>{profileData.altMobile || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t.email}:</label>
                  <span>{profileData.email}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>{t.addressInformation}</h4>
              <div className="profile-details-grid">
                <div className="detail-item full-width">
                  <label>{t.address1}:</label>
                  <span>{profileData.address1}</span>
                </div>
                <div className="detail-item full-width">
                  <label>{t.address2}:</label>
                  <span>{profileData.address2 || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t.cityTown}:</label>
                  <span>{profileData.city}</span>
                </div>
                <div className="detail-item">
                  <label>{t.district}:</label>
                  <span>{profileData.district}</span>
                </div>
                <div className="detail-item">
                  <label>{t.state}:</label>
                  <span>{profileData.state}</span>
                </div>
                <div className="detail-item">
                  <label>{t.pincode}:</label>
                  <span>{profileData.pincode}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> {t.editProfile}
              </button>
              <button className="logout-btn-profile" onClick={handleLogout}>
                {t.logout}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-section">
              <h4>{t.personalInformation}</h4>
              <div className="form-row">
                <FormGroup label={t.firstName}>
                  <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.middleName}>
                  <input type="text" name="middleName" value={profileData.middleName} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.lastName}>
                  <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label={t.dob}>
                  <input type="date" name="dob" value={profileData.dob} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.gender}>
                  <select name="gender" value={profileData.gender} onChange={handleInputChange}>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.genderOther}</option>
                  </select>
                </FormGroup>
              </div>
            </div>

            <div className="profile-section">
              <h4>{t.contactInformation}</h4>
              <div className="form-row">
                <FormGroup label={t.mobile}>
                  <input type="tel" name="mobile" value={profileData.mobile} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.altMobile}>
                  <input type="tel" name="altMobile" value={profileData.altMobile} onChange={handleInputChange} />
                </FormGroup>
              </div>
              <FormGroup label={t.email}>
                <input type="email" name="email" value={profileData.email} onChange={handleInputChange} />
              </FormGroup>
            </div>

            <div className="profile-section">
              <h4>{t.addressInformation}</h4>
              <FormGroup label={t.address1}>
                <input type="text" name="address1" value={profileData.address1} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup label={t.address2}>
                <input type="text" name="address2" value={profileData.address2} onChange={handleInputChange} />
              </FormGroup>
              <div className="form-row">
                <FormGroup label={t.cityTown}>
                  <input type="text" name="city" value={profileData.city} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.district}>
                  <input type="text" name="district" value={profileData.district} onChange={handleInputChange} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label={t.state}>
                  <input type="text" name="state" value={profileData.state} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup label={t.pincode}>
                  <input type="text" name="pincode" value={profileData.pincode} onChange={handleInputChange} />
                </FormGroup>
              </div>
            </div>

            <div className="profile-actions">
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> {t.saveChanges}
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                {t.cancel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;