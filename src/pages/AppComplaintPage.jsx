import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AppComplaintPage = ({ t, appComplaintsDB, appComplaintTypes, severityLevels, currentUser }) => {
  const navigate = useNavigate();
  const [complaintData, setComplaintData] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    device: '',
    os: '',
    appVersion: '',
    attachments: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newComplaint = {
      id: 'APP' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...complaintData,
      reportedBy: currentUser?.username || 'anonymous',
      reportedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    appComplaintsDB.push(newComplaint);
    alert('Your app complaint has been submitted successfully. Thank you for helping us improve!');
    navigate('/');
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
            <h2>{t.appComplaintTitle}</h2>
            <p>{t.appComplaintDesc}</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.complaintType} *</label>
              <select name="type" value={complaintData.type} onChange={handleChange} required>
                <option value="">{t.selectComplaintType}</option>
                {appComplaintTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t.severity} *</label>
              <select name="severity" value={complaintData.severity} onChange={handleChange} required>
                <option value="">{t.selectSeverity}</option>
                {severityLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t.issueTitle} *</label>
              <input
                type="text"
                name="title"
                value={complaintData.title}
                onChange={handleChange}
                placeholder="Brief title of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label>{t.description} *</label>
              <textarea
                name="description"
                value={complaintData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the issue in detail. Include steps to reproduce if applicable."
                required
              />
            </div>

            <h3 className="form-section-title">{t.deviceInfo}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>{t.deviceModel}</label>
                <input
                  type="text"
                  name="device"
                  value={complaintData.device}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 13, Samsung S21"
                />
              </div>

              <div className="form-group">
                <label>{t.osVersion}</label>
                <input
                  type="text"
                  name="os"
                  value={complaintData.os}
                  onChange={handleChange}
                  placeholder="e.g., iOS 15.4, Android 12"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t.appVersion}</label>
              <input
                type="text"
                name="appVersion"
                value={complaintData.appVersion}
                onChange={handleChange}
                placeholder="e.g., 1.0.2"
              />
            </div>

            <div className="form-group">
              <label>{t.attachScreenshots}</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setComplaintData(prev => ({ ...prev, attachments: files }));
                }}
              />
            </div>

            <button type="submit" className="submit-btn">{t.submit}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppComplaintPage;