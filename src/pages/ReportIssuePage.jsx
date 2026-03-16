import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaCamera, FaSpinner } from 'react-icons/fa';
import {
  uploadComplaintImages,
  createComplaint,
} from '../services/complaintService';

const ReportIssuePage = ({ currentUser, t }) => {
  const navigate = useNavigate();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  // Loading / error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Form state ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yourLocation: '',
    yourLocationCoords: null,
    issueLocation: '',
    issueLocationCoords: null,
    issueLocationAddress: '',
    photos: [],           // File objects chosen by the user
    date: new Date().toISOString().split('T')[0],
  });

  // ── Map state ────────────────────────────────────────────────────────────────
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 19.076, lng: 72.8777 });
  const [mapSearching, setMapSearching] = useState(false);

  // ── Departments ───────────────────────────────────────────────────────────────
  const departments = [
    { id: 'road',           name: t.departments.road,           icon: '🛣️', color: '#4a90e2' },
    { id: 'water',          name: t.departments.water,          icon: '💧', color: '#50c878' },
    { id: 'electricity',    name: t.departments.electricity,    icon: '⚡', color: '#f39c12' },
    { id: 'garbage',        name: t.departments.garbage,        icon: '🗑️', color: '#e67e22' },
    { id: 'infrastructure', name: t.departments.infrastructure, icon: '🏗️', color: '#9b59b6' },
    { id: 'education',      name: t.departments.education,      icon: '📚', color: '#3498db' },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Allow up to 5 photos
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFormData((prev) => ({ ...prev, photos: selected }));
  };

  // Reverse-geocode the user's current GPS position
  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapLocation(coords);
        setFormData((prev) => ({
          ...prev,
          yourLocation: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          yourLocationCoords: coords,
        }));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await res.json();
          if (data.display_name) {
            setFormData((prev) => ({ ...prev, yourLocation: data.display_name }));
          }
        } catch {
          // silently fall back to raw coords already set above
        }
      },
      () => alert('Unable to get your location. Please enable location services.')
    );
  };

  // Forward-geocode a typed address and show the map pin
  const findOnMap = async () => {
    if (!mapSearchQuery.trim()) {
      alert('Please enter a location to search');
      return;
    }
    setMapSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const loc = data[0];
        const coords = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
        setMapLocation(coords);
        setShowMap(true);
        setFormData((prev) => ({
          ...prev,
          issueLocation: mapSearchQuery,
          issueLocationCoords: coords,
          issueLocationAddress: loc.display_name,
        }));
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch {
      alert('Error searching for location. Please try again.');
    } finally {
      setMapSearching(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // ── Step A: upload photos first (if any) ───────────────────────────────
      let imageUrls = [];
      if (formData.photos.length > 0) {
        const uploadResult = await uploadComplaintImages(formData.photos);
        // uploadResult.files = [{ filename, path, url }]
        imageUrls = uploadResult.files.map((f) => f.url);
      }

      // ── Step B: build the payload the backend expects ──────────────────────
      // Validator requires: title, description, department, location.address
      const payload = {
        title: formData.title,
        description: formData.description,
        department: selectedDepartment,
        location: {
          address: formData.issueLocationAddress || formData.issueLocation || 'Not specified',
          area:    formData.issueLocation.split(',')[0]?.trim() || 'Unknown',
          city:    formData.issueLocationAddress?.includes('Mumbai') ? 'Mumbai' : 'Navi Mumbai',
        },
        geoLocation: formData.issueLocationCoords
          ? {
              type: 'Point',
              coordinates: [formData.issueLocationCoords.lng, formData.issueLocationCoords.lat],
            }
          : formData.yourLocationCoords
          ? {
              type: 'Point',
              coordinates: [formData.yourLocationCoords.lng, formData.yourLocationCoords.lat],
            }
          : {
              type: 'Point',
              coordinates: [72.8777, 19.076], // Mumbai fallback
            },
        images: imageUrls,
      };

      // ── Step C: create the complaint ───────────────────────────────────────
      const complaint = await createComplaint(payload);

      setSubmittedIssue(complaint);
      setShowSummary(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Failed to submit complaint. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset and go home ─────────────────────────────────────────────────────────
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
      photos: [],
      date: new Date().toISOString().split('T')[0],
    });
    setSubmitError('');
    navigate('/dashboard');
  };

  // ── Success summary screen ────────────────────────────────────────────────────
  if (showSummary && submittedIssue) {
    return (
      <div className="report-issue-container">
        <div className="success-summary glass-card">
          <h2>{t.issueReportedSuccess} ✅</h2>
          <div className="summary-card">
            <h3>{t.issueSummary}</h3>
            <div className="summary-details-enhanced">
              {[
                [t.issueTitle,          submittedIssue.title],
                [t.description,         submittedIssue.description],
                [t.department,          departments.find((d) => d.id === submittedIssue.department)?.name || submittedIssue.department],
                [t.location,            submittedIssue.location?.address],
                [t.area,                submittedIssue.location?.area],
                [t.city,                submittedIssue.location?.city],
                [t.coordinates,         submittedIssue.geoLocation?.coordinates
                                          ? `${submittedIssue.geoLocation.coordinates[1].toFixed(4)}, ${submittedIssue.geoLocation.coordinates[0].toFixed(4)}`
                                          : '—'],
                [t.status,              submittedIssue.status],
                [t.expectedResolution,  submittedIssue.expectedResolutionDate
                                          ? new Date(submittedIssue.expectedResolutionDate).toLocaleDateString()
                                          : '—'],
                [t.reportedOn,          new Date(submittedIssue.createdAt).toLocaleString()],
              ].map(([label, value]) => (
                <div className="summary-row" key={label}>
                  <span className="summary-label">{label}:</span>
                  <span className="summary-value">{value}</span>
                </div>
              ))}
              <div className="summary-row highlight">
                <span className="summary-label">Issue ID:</span>
                <span className="summary-value issue-id-highlight">
                  {submittedIssue.complaintId || submittedIssue._id}
                </span>
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

  // ── Main form ─────────────────────────────────────────────────────────────────
  return (
    <div className="report-issue-container">
      <div className="report-issue-header">
        <h2>{t.reportIssue}</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {/* ── Step 1: pick department ── */}
      {step === 1 ? (
        <div className="department-selection glass-card">
          <h3>{t.selectDepartment}</h3>
          <div className="departments-grid-report">
            {departments.map((dept) => (
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

        /* ── Step 2: fill in complaint details ── */
        <form className="issue-form glass-card" onSubmit={handleSubmit}>

          {submitError && (
            <div className="error-message" style={{ marginBottom: '16px' }}>
              {submitError}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label>{t.issueTitle} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter issue title"
              disabled={isSubmitting}
            />
          </div>

          {/* Department (read-only) */}
          <div className="form-group">
            <label>{t.department} *</label>
            <input
              type="text"
              value={departments.find((d) => d.id === selectedDepartment)?.name || selectedDepartment}
              readOnly
              className="readonly-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>{t.issueDescription} *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe the issue in detail"
              disabled={isSubmitting}
            />
          </div>

          {/* Your location (GPS) */}
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
              <button type="button" className="location-btn" onClick={getLiveLocation} disabled={isSubmitting}>
                <FaMapMarkerAlt /> {t.getLiveLocation}
              </button>
            </div>
          </div>

          {/* Issue location (map search) */}
          <div className="form-group">
            <label>{t.issueLocation} *</label>
            <div className="map-search-group">
              <input
                type="text"
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                placeholder={t.searchLocation}
                disabled={isSubmitting}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), findOnMap())}
              />
              <button type="button" className="map-btn" onClick={findOnMap} disabled={isSubmitting || mapSearching}>
                {mapSearching ? <FaSpinner className="spin" /> : <FaSearch />} {t.findOnMap}
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
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLocation.lng - 0.01},${mapLocation.lat - 0.01},${mapLocation.lng + 0.01},${mapLocation.lat + 0.01}&layer=mapnik&marker=${mapLocation.lat},${mapLocation.lng}`}
                      style={{ border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Editable confirmed location label */}
            <input
              type="text"
              name="issueLocation"
              value={formData.issueLocation}
              onChange={handleInputChange}
              required
              placeholder="Selected location will appear here"
              className="mt-2"
              disabled={isSubmitting}
            />
            {formData.issueLocationCoords && (
              <small className="coords-display">
                <FaMapMarkerAlt />{' '}
                {formData.issueLocationCoords.lat.toFixed(4)}, {formData.issueLocationCoords.lng.toFixed(4)}
              </small>
            )}
          </div>

          {/* Photo upload (up to 5) */}
          <div className="form-group">
            <label>{t.uploadPhoto}</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                id="photo-upload"
                disabled={isSubmitting}
              />
              <label htmlFor="photo-upload" className="file-input-label">
                <FaCamera />{' '}
                {formData.photos.length > 0
                  ? `${formData.photos.length} photo${formData.photos.length > 1 ? 's' : ''} selected`
                  : t.uploadPhoto}
              </label>
            </div>
            {/* Thumbnail previews */}
            {formData.photos.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {formData.photos.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Date (read-only) */}
          <div className="form-group">
            <label>{t.dateOfComplaint}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              readOnly
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              Back to Departments
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <><FaSpinner className="spin" /> {t.submitting}…</>
              ) : (
                t.submit
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportIssuePage;