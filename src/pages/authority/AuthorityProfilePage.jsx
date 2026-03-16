import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaKey, FaSave, FaSpinner, FaIdBadge } from 'react-icons/fa';
import { getDepartmentStats, getProfile, updateProfile } from '../../services/authorityService';

const DEPT_NAMES = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', garbage:'Garbage Department', infrastructure:'Infrastructure Department', education:'Education Department' };

const AuthorityProfilePage = ({ currentUser, t, handleLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile]         = useState(null);
  const [stats, setStats]             = useState(null);
  const [isEditing, setIsEditing]     = useState(false);
  const [editData, setEditData]       = useState({});
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [error, setError]             = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([ getProfile(), getDepartmentStats() ]);
        setProfile(p); setStats(s);
        setEditData({ firstName: p.firstName, lastName: p.lastName, mobile: p.mobile, altMobile: p.altMobile||'' });
      } catch (err) { setError('Failed to load profile.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const updated = await updateProfile(editData);
      setProfile(prev => ({ ...prev, ...updated }));
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
    } catch (err) { setError(err.response?.data?.message || 'Failed to update.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="authority-profile-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="authority-profile-container">
      <div className="page-header">
        <h2>Officer Profile</h2>
        <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>← Back</button>
      </div>

      {successMsg && <div className="success-message glass-card" style={{padding:12,marginBottom:16,color:'#28a745'}}>{successMsg}</div>}
      {error && <div className="error-message glass-card" style={{padding:12,marginBottom:16}}>{error}</div>}

      <div className="profile-grid">
        <div className="profile-card-main glass-card">
          <div className="profile-header">
            <div className="profile-avatar-large"><FaUserTie size={80} color="#000080"/></div>
            <h3>{profile?.firstName} {profile?.lastName}</h3>
            <p className="department-badge"><FaBuilding /> {DEPT_NAMES[profile?.department]||profile?.department}</p>
          </div>

          {!isEditing ? (
            <>
              <div className="profile-details">
                {[
                  [<FaUserTie/>,  'Full Name',   `${profile?.firstName} ${profile?.lastName}`],
                  [<FaIdBadge/>,  'Employee ID', profile?.employeeId||'—'],
                  [<FaEnvelope/>, 'Email',       profile?.email],
                  [<FaPhone/>,    'Mobile',      profile?.mobile],
                  [<FaBuilding/>, 'Department',  DEPT_NAMES[profile?.department]||profile?.department],
                ].map(([icon, label, value]) => (
                  <div key={label} className="detail-row">
                    <span className="detail-icon">{icon}</span>
                    <div className="detail-content"><label>{label}</label><span>{value}</span></div>
                  </div>
                ))}
              </div>
              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
                <button className="password-btn" onClick={() => navigate('/authority/change-password')}><FaKey /> Change Password</button>
                <button className="logout-btn-profile" onClick={handleLogout}>{t.logout}</button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-edit-form">
                {[['firstName','First Name','text'],['lastName','Last Name','text'],['mobile','Mobile','tel'],['altMobile','Alt Mobile','tel']].map(([field,label,type])=>(
                  <div key={field} className="form-group"><label>{label}</label>
                    <input type={type} value={editData[field]||''} onChange={e=>setEditData(p=>({...p,[field]:e.target.value}))} disabled={saving}/>
                  </div>
                ))}
              </div>
              <div className="profile-actions">
                <button className="save-btn submit-btn" onClick={handleSave} disabled={saving}>
                  {saving?<><FaSpinner className="spin"/> Saving…</>:<><FaSave /> Save Changes</>}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
              </div>
            </>
          )}
        </div>

        <div className="stats-card glass-card">
          <h3>Department Overview</h3>
          <div className="stat-items">
            {[
              ['Department',       DEPT_NAMES[profile?.department]||profile?.department, ''],
              ['Total Complaints', stats?.total||0, ''],
              ['Reported',         stats?.reported||0, '#6b7280'],
              ['In Progress',      stats?.inProgress||0, '#f59e0b'],
              ['Resolved',         stats?.resolved||0, '#10b981'],
              ['Resolution Rate',  `${stats?.resolutionRate||0}%`, '#10b981'],
            ].map(([label,value,color])=>(
              <div key={label} className="stat-item">
                <span className="stat-label">{label}:</span>
                <span className="stat-value" style={color?{color}:{}}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthorityProfilePage;