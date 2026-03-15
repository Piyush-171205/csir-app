import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaCamera } from 'react-icons/fa';

const ReportIssuePage = ({ currentUser, t, complaintsDB }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yourLocation: '',
    yourLocationCoords: null,
    issueLocation: '',
    issueLocationCoords: null,
    issueLocationAddress: '',
    photo: null,
    date: new Date().toISOString().split('T')[0]
  });
  const [showSummary, setShowSummary] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 19.076, lng: 72.8777 });

  const departments = [
    { id: 'road', name: t.departments.road, icon: '🛣️', color: '#4a90e2' },
    { id: 'water', name: t.departments.water, icon: '💧', color: '#50c878' },
    { id: 'electricity', name: t.departments.electricity, icon: '⚡', color: '#f39c12' },
    { id: 'garbage', name: t.departments.garbage, icon: '🗑️', color: '#e67e22' },
    { id: 'infrastructure', name: t.departments.infrastructure, icon: '🏗️', color: '#9b59b6' },
    { id: 'education', name: t.departments.education, icon: '📚', color: '#3498db' }
  ];

  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapLocation(coords);
          setFormData(prev => ({ 
            ...prev, 
            yourLocation: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
            yourLocationCoords: coords
          }));
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
            .then(res => res.json())
            .then(data => {
              if (data.display_name) {
                setFormData(prev => ({ ...prev, yourLocation: data.display_name }));
              }
            })
            .catch(err => console.log('Reverse geocoding failed'));
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const findOnMap = () => {
    if (!mapSearchQuery.trim()) {
      alert('Please enter a location to search');
      return;
    }

    setShowMap(true);
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const location = data[0];
          const coords = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon)
          };
          setMapLocation(coords);
          setFormData(prev => ({
            ...prev,
            issueLocation: mapSearchQuery,
            issueLocationCoords: coords,
            issueLocationAddress: location.display_name
          }));
        } else {
          alert('Location not found. Please try a different search term.');
        }
      })
      .catch(err => {
        alert('Error searching for location. Please try again.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newIssue = {
      _id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: formData.title,
      description: formData.description,
      department: selectedDepartment,
      location: {
        area: formData.issueLocation.split(',')[0] || 'Unknown',
        city: formData.issueLocation.includes('Mumbai') ? 'Mumbai' : 'Navi Mumbai',
        address: formData.issueLocationAddress || formData.issueLocation || 'Not specified'
      },
      status: 'reported',
      progress: 0,
      priority: 'medium',
      reportedBy: currentUser?.username || 'unknown',
      geoLocation: formData.issueLocationCoords ? {
        type: 'Point',
        coordinates: [formData.issueLocationCoords.lng, formData.issueLocationCoords.lat]
      } : formData.yourLocationCoords ? {
        type: 'Point',
        coordinates: [formData.yourLocationCoords.lng, formData.yourLocationCoords.lat]
      } : {
        type: 'Point',
        coordinates: [72.8777, 19.076]
      },
      images: formData.photo ? [URL.createObjectURL(formData.photo)] : [],
      statusHistory: [
        { status: 'reported', date: new Date().toISOString(), note: 'Complaint registered' }
      ],
      expectedResolutionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };

    complaintsDB.push(newIssue);
    setSubmittedIssue(newIssue);
    setShowSummary(true);
    setIsSubmitting(false);
  };

  const handleBackToDashboard = () => {
    setShowSummary(false);
    setStep(1);
    setSelectedDepartment('');
    setFormData({
      title: '',
      description: '',
      yourLocation: '',
      yourLocationCoords: null,
      issueLocation: '',
      issueLocationCoords: null,
      issueLocationAddress: '',
      photo: null,
      date: new Date().toISOString().split('T')[0]
    });
    navigate('/dashboard');
  };

  if (showSummary && submittedIssue) {
    return (
      <div className="report-issue-container">
        <div className="success-summary glass-card">
          <h2>{t.issueReportedSuccess} ✅</h2>
          <div className="summary-card">
            <h3>{t.issueSummary}</h3>
            
            <div className="summary-details-enhanced">
              <div className="summary-row">
                <span className="summary-label">{t.issueTitle}:</span>
                <span className="summary-value">{submittedIssue.title}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.description}:</span>
                <span className="summary-value">{submittedIssue.description}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.department}:</span>
                <span className="summary-value">{departments.find(d => d.id === submittedIssue.department)?.name || submittedIssue.department}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.location}:</span>
                <span className="summary-value">{submittedIssue.location.address}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.area}:</span>
                <span className="summary-value">{submittedIssue.location.area}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.city}:</span>
                <span className="summary-value">{submittedIssue.location.city}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.coordinates}:</span>
                <span className="summary-value">
                  {submittedIssue.geoLocation.coordinates[1].toFixed(4)}, {submittedIssue.geoLocation.coordinates[0].toFixed(4)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.status}:</span>
                <span className="summary-value status-badge pending">{submittedIssue.status}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.expectedResolution}:</span>
                <span className="summary-value">{new Date(submittedIssue.expectedResolutionDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">{t.reportedOn}:</span>
                <span className="summary-value">{new Date(submittedIssue.createdAt).toLocaleString()}</span>
              </div>
              <div className="summary-row highlight">
                <span className="summary-label">Issue ID:</span>
                <span className="summary-value issue-id-highlight">{submittedIssue._id}</span>
              </div>
            </div>
          </div>
          <button className="submit-btn" onClick={handleBackToDashboard}>
            {t.backToDashboard}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-issue-container">
      <div className="report-issue-header">
        <h2>{t.reportIssue}</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {step === 1 ? (
        <div className="department-selection glass-card">
          <h3>{t.selectDepartment}</h3>
          <div className="departments-grid-report">
            {departments.map(dept => (
              <div 
                key={dept.id} 
                className="department-card-report glass-card"
                style={{ borderColor: dept.color }}
                onClick={() => handleDepartmentSelect(dept.id)}
              >
                <div className="department-icon-report" style={{ color: dept.color }}>{dept.icon}</div>
                <h4>{dept.name}</h4>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form className="issue-form glass-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.issueTitle} *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter issue title"
            />
          </div>

          <div className="form-group">
            <label>{t.department} *</label>
            <input 
              type="text" 
              value={departments.find(d => d.id === selectedDepartment)?.name || selectedDepartment}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>{t.issueDescription} *</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe the issue in detail"
            />
          </div>

          <div className="form-group">
            <label>{t.yourLocation}</label>
            <div className="location-input-group">
              <input 
                type="text" 
                name="yourLocation"
                value={formData.yourLocation}
                onChange={handleInputChange}
                placeholder="Your current location"
                readOnly
              />
              <button type="button" className="location-btn" onClick={getLiveLocation}>
                <FaMapMarkerAlt /> {t.getLiveLocation}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t.issueLocation} *</label>
            <div className="map-search-group">
              <input 
                type="text" 
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                placeholder={t.searchLocation}
              />
              <button type="button" className="map-btn" onClick={findOnMap}>
                <FaSearch /> {t.findOnMap}
              </button>
            </div>
            
            {showMap && (
              <div className="map-preview">
                <div className="map-placeholder">
                  <div className="map-coordinates">
                    <p>📍 {mapLocation.lat.toFixed(4)}, {mapLocation.lng.toFixed(4)}</p>
                    <p className="map-note">{t.dragPinToAdjust}</p>
                    <iframe
                      title="location-map"
                      width="100%"
                      height="250"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLocation.lng-0.01},${mapLocation.lat-0.01},${mapLocation.lng+0.01},${mapLocation.lat+0.01}&layer=mapnik&marker=${mapLocation.lat},${mapLocation.lng}`}
                      style={{ border: '1px solid #ddd', borderRadius: '5px' }}
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
            
            <input 
              type="text" 
              name="issueLocation"
              value={formData.issueLocation}
              onChange={handleInputChange}
              required
              placeholder="Selected location will appear here"
              className="mt-2"
            />
            {formData.issueLocationCoords && (
              <small className="coords-display">
                <FaMapMarkerAlt /> {formData.issueLocationCoords.lat.toFixed(4)}, {formData.issueLocationCoords.lng.toFixed(4)}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>{t.uploadPhoto}</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="file-input-label">
                <FaCamera /> {formData.photo ? formData.photo.name : t.uploadPhoto}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t.dateOfComplaint}</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              readOnly
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
              Back to Departments
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportIssuePage;