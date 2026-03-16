import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaBuilding, FaSpinner } from 'react-icons/fa';
import { getDepartmentComplaint, updateComplaintStatus } from '../../services/authorityService';

const DEPT_NAMES = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', garbage:'Garbage Department', infrastructure:'Infrastructure Department', education:'Education Department' };
const STATUS_COLORS = { reported:'#6b7280', acknowledged:'#3b82f6', 'in-progress':'#f59e0b', 'almost-resolved':'#9b59b6', resolved:'#10b981', completed:'#10b981' };
const STATUS_OPTIONS = [
  { value:'reported',         label:'Reported' },
  { value:'acknowledged',     label:'Acknowledged' },
  { value:'in-progress',      label:'In Progress' },
  { value:'almost-resolved',  label:'Almost Resolved' },
  { value:'resolved',         label:'Resolved' },
  { value:'completed',        label:'Completed' },
];
const PROGRESS_MESSAGES = {
  0:'Not started yet',25:'Initial assessment done',50:'Work is halfway through',
  75:'Almost done, finishing up',90:'Final touches remaining',100:'Work completed successfully!',
};

const AuthorityComplaintDetailPage = ({ currentUser, t, setAuthorityNotifications }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [complaint, setComplaint]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [showUpdateForm, setShowUpdate] = useState(false);
  const [newStatus, setNewStatus]       = useState('');
  const [newProgress, setNewProgress]   = useState(0);
  const [remarks, setRemarks]           = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [updateError, setUpdateError]   = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await getDepartmentComplaint(id);
        setComplaint(c);
        setNewStatus(c.status);
        setNewProgress(c.progress || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint.');
      } finally { setLoading(false); }
    })();
  }, [id]);

  const handleStatusUpdate = async () => {
    setSubmitting(true); setUpdateError('');
    try {
      const updated = await updateComplaintStatus(id, newStatus, newProgress, remarks);
      setComplaint(updated);
      setShowUpdate(false);
      setRemarks('');
      // Bubble up notification to App state (for badge counter)
      if (setAuthorityNotifications) {
        setAuthorityNotifications(prev => [{
          id: `notif_${Date.now()}`, type:'status_update',
          title:'Status Updated', message:`Complaint status changed to ${newStatus}`,
          complaintId: id, read:false, timestamp:new Date().toISOString(),
        }, ...prev]);
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update status.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="authority-complaint-detail-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;
  if (error || !complaint) return <div className="authority-complaint-detail-container"><div className="error-message glass-card" style={{padding:24}}>{error||'Complaint not found.'}</div></div>;

  return (
    <div className="authority-complaint-detail-container">
      <div className="page-header">
        <h2>Complaint Details — {complaint.complaintId || complaint._id.slice(-6).toUpperCase()}</h2>
        <button className="back-btn" onClick={() => navigate('/authority/complaints')}>← Back</button>
      </div>

      <div className="complaint-detail-grid">
        {/* Left — Info */}
        <div className="complaint-info-card glass-card">
          <div className="complaint-header">
            <h3>{complaint.title}</h3>
            <span className="status-badge-large" style={{backgroundColor:STATUS_COLORS[complaint.status]||'#888',color:'white',padding:'4px 12px',borderRadius:6}}>
              {complaint.status}
            </span>
          </div>

          <div className="complaint-meta">
            {complaint.reportedBy && (<>
              <div className="meta-item"><FaUser className="meta-icon"/>
                <div className="meta-content"><label>Citizen</label><span>{complaint.reportedBy.firstName} {complaint.reportedBy.lastName}</span></div>
              </div>
              <div className="meta-item"><FaPhone className="meta-icon"/>
                <div className="meta-content"><label>Mobile</label><span>{complaint.reportedBy.mobile}</span></div>
              </div>
            </>)}
            <div className="meta-item"><FaCalendarAlt className="meta-icon"/>
              <div className="meta-content"><label>Reported On</label><span>{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="meta-item"><FaBuilding className="meta-icon"/>
              <div className="meta-content"><label>Department</label><span>{DEPT_NAMES[complaint.department]||complaint.department}</span></div>
            </div>
            <div className="meta-item"><FaMapMarkerAlt className="meta-icon"/>
              <div className="meta-content">
                <label>Location</label>
                <span>{complaint.location?.address||'—'}</span>
                {complaint.location?.area && <small>{complaint.location.area}, {complaint.location.city}</small>}
              </div>
            </div>
          </div>

          <div className="complaint-description"><h4>Description</h4><p>{complaint.description}</p></div>

          {complaint.images?.length > 0 && (
            <div className="complaint-images">
              <h4>Attached Images</h4>
              <div className="image-grid">
                {complaint.images.map((img,i) => (
                  <div key={i} className="image-thumbnail" onClick={()=>setSelectedImage(img)}>
                    <img src={img} alt={`img-${i}`} style={{width:80,height:60,objectFit:'cover',borderRadius:4,cursor:'pointer'}}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {complaint.geoLocation?.coordinates && (
            <div className="complaint-location">
              <h4>Coordinates</h4>
              <p><FaMapMarkerAlt /> {complaint.geoLocation.coordinates[1].toFixed(4)}, {complaint.geoLocation.coordinates[0].toFixed(4)}</p>
            </div>
          )}
        </div>

        {/* Right — Status Update */}
        <div className="complaint-actions-card glass-card">
          <h3>Update Complaint Status</h3>

          {!showUpdateForm ? (
            <div className="current-status">
              <div className="status-display">
                <label>Current Status:</label>
                <span className="status-badge-large" style={{backgroundColor:STATUS_COLORS[complaint.status]||'#888',color:'white',padding:'4px 12px',borderRadius:6,marginLeft:8}}>
                  {complaint.status}
                </span>
              </div>
              <div className="progress-display" style={{marginTop:16}}>
                <label>Work Progress: {complaint.progress||0}%</label>
                <div className="progress-bar-large" style={{background:'#f0f0f0',borderRadius:8,height:16,marginTop:8,overflow:'hidden'}}>
                  <div className="progress-fill" style={{width:`${complaint.progress||0}%`,height:'100%',backgroundColor:STATUS_COLORS[complaint.status]||'#888',transition:'width .3s'}}/>
                </div>
              </div>
              <button className="update-status-btn submit-btn" style={{marginTop:16}} onClick={()=>setShowUpdate(true)}>
                Update Status
              </button>
            </div>
          ) : (
            <div className="status-update-form">
              {updateError && <div className="error-message">{updateError}</div>}
              <div className="form-group"><label>New Status</label>
                <select value={newStatus} onChange={e=>setNewStatus(e.target.value)} disabled={submitting}>
                  {STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Progress ({newProgress}%)</label>
                <input type="range" min="0" max="100" step="5" value={newProgress} onChange={e=>setNewProgress(parseInt(e.target.value))} disabled={submitting}/>
                <div className="progress-labels" style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#888'}}>
                  {[0,25,50,75,100].map(v=><span key={v}>{v}%</span>)}
                </div>
              </div>
              <div className="form-group"><label>Remarks / Solution</label>
                <textarea rows="4" value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Describe work done or any remarks…" disabled={submitting}/>
              </div>
              <div className="progress-message" style={{color:'#555',fontSize:13,marginBottom:12}}>
                <p>{PROGRESS_MESSAGES[newProgress] || `Progress: ${newProgress}%`}</p>
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={()=>setShowUpdate(false)} disabled={submitting}>Cancel</button>
                <button className="submit-btn" onClick={handleStatusUpdate} disabled={submitting}>
                  {submitting?<><FaSpinner className="spin"/> Updating…</>:'Update Status'}
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="quick-stats" style={{marginTop:24}}>
            <h4>Status History</h4>
            <div className="stat-items">
              {complaint.statusHistory?.slice(-4).reverse().map((h,i) => (
                <div key={i} className="stat-item">
                  <span className="stat-label" style={{color:STATUS_COLORS[h.status]||'#888'}}>{h.status}</span>
                  <span className="stat-value" style={{fontSize:12}}>{new Date(h.date||h.updatedAt||Date.now()).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={()=>setSelectedImage(null)}>
          <div className="image-modal-content" onClick={e=>e.stopPropagation()}>
            <button className="close-modal" onClick={()=>setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Full size" style={{maxWidth:'100%',maxHeight:'80vh'}}/>
          </div>
        </div>
      )}
    </div>
  );
};
export default AuthorityComplaintDetailPage;