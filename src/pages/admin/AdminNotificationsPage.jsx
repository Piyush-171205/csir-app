import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPlus, FaEdit, FaTrash, FaPaperPlane, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/adminService';

const EMPTY = { title: '', message: '', targetAudience: 'all', priority: 'normal', expiresAt: '' };

const AdminNotificationsPage = ({ t }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [pageError, setPageError]         = useState('');
  const [filter, setFilter]               = useState('all');
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected]           = useState(null);
  const [form, setForm]                   = useState(EMPTY);
  const [formError, setFormError]         = useState('');
  const [submitting, setSubmitting]       = useState(false);

  useEffect(() => {
    (async () => {
      try { setAnnouncements(await getAnnouncements()); }
      catch (err) { setPageError(err.response?.data?.message || 'Failed to load announcements.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = announcements.filter(a => {
    if (filter === 'active')   return a.status === 'active';
    if (filter === 'archived') return a.status === 'archived';
    return true;
  });

  const handleCreate = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      const created = await createAnnouncement(form);
      setAnnouncements(prev => [created, ...prev]);
      setShowAddModal(false); setForm(EMPTY);
    } catch (err) { setFormError(err.response?.data?.message || 'Failed to create.'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      const updated = await updateAnnouncement(selected._id, selected);
      setAnnouncements(prev => prev.map(a => a._id === updated._id ? updated : a));
      setShowEditModal(false); setSelected(null);
    } catch (err) { setFormError(err.response?.data?.message || 'Failed to update.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete.'); }
  };

  const handleToggleStatus = async (a) => {
    const newStatus = a.status === 'active' ? 'archived' : 'active';
    try {
      const updated = await updateAnnouncement(a._id, { status: newStatus });
      setAnnouncements(prev => prev.map(x => x._id === updated._id ? updated : x));
    } catch (err) { alert(err.response?.data?.message || 'Failed to update status.'); }
  };

  const FormFields = ({ data, onChange }) => (
    <>
      <div className="form-group"><label>Title *</label>
        <input type="text" value={data.title} onChange={e=>onChange({...data,title:e.target.value})} required disabled={submitting} placeholder="Announcement title"/>
      </div>
      <div className="form-group"><label>Message *</label>
        <textarea value={data.message} onChange={e=>onChange({...data,message:e.target.value})} required rows="5" disabled={submitting} placeholder="Announcement message"/>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Target Audience</label>
          <select value={data.targetAudience} onChange={e=>onChange({...data,targetAudience:e.target.value})} disabled={submitting}>
            <option value="all">All Citizens</option>
            {['road','water','electricity','garbage','infrastructure','education'].map(d=>(
              <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)} Department</option>
            ))}
          </select>
        </div>
        <div className="form-group"><label>Priority</label>
          <select value={data.priority} onChange={e=>onChange({...data,priority:e.target.value})} disabled={submitting}>
            <option value="low">Low</option><option value="normal">Normal</option>
            <option value="high">High</option><option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div className="form-group"><label>Expiry Date (Optional)</label>
        <input type="date" value={data.expiresAt||''} onChange={e=>onChange({...data,expiresAt:e.target.value})} disabled={submitting}/>
      </div>
    </>
  );

  if (loading) return <div className="admin-page-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Notifications & Announcements</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={()=>{setForm(EMPTY);setFormError('');setShowAddModal(true)}}><FaPlus /> New Announcement</button>
          <button className="back-btn" onClick={()=>navigate('/admin/dashboard')}>← Back</button>
        </div>
      </div>

      {pageError && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{pageError}</div>}

      <div className="filter-tabs glass-card">
        {['all','active','archived'].map(f=>(
          <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      <div className="announcements-list">
        {filtered.length === 0
          ? <div className="no-data glass-card"><FaBell size={50}/><p>No announcements found</p></div>
          : filtered.map(a => (
            <div key={a._id} className={`announcement-card glass-card ${a.status}`}>
              <div className="announcement-header">
                <div className="title-section">
                  <h3>{a.title}</h3>
                  <span className={`priority-badge ${a.priority}`}>{a.priority}</span>
                </div>
                <div className="status-badge">
                  {a.status==='active'
                    ? <span className="active"><FaCheckCircle /> Active</span>
                    : <span className="archived"><FaTimesCircle /> Archived</span>}
                </div>
              </div>
              <div className="announcement-content"><p>{a.message}</p></div>
              <div className="announcement-meta">
                <span className="meta-item"><FaCalendarAlt /> {new Date(a.createdAt).toLocaleDateString()}</span>
                <span className="meta-item">Target: {a.targetAudience==='all'?'All Citizens':a.targetAudience}</span>
                {a.expiresAt && <span className="meta-item">Expires: {new Date(a.expiresAt).toLocaleDateString()}</span>}
              </div>
              <div className="announcement-actions">
                <button className="action-btn edit"   onClick={()=>{setSelected({...a});setFormError('');setShowEditModal(true)}} title="Edit"><FaEdit /></button>
                <button className="action-btn toggle" onClick={()=>handleToggleStatus(a)} title={a.status==='active'?'Archive':'Activate'}>
                  {a.status==='active'?<FaEyeSlash/>:<FaEye/>}
                </button>
                <button className="action-btn delete" onClick={()=>handleDelete(a._id)} title="Delete"><FaTrash /></button>
              </div>
            </div>
          ))
        }
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={()=>setShowAddModal(false)}>
          <div className="modal-content large-modal" onClick={e=>e.stopPropagation()}>
            <h3>Create New Announcement</h3>
            {formError && <div className="error-message" style={{marginBottom:12}}>{formError}</div>}
            <form onSubmit={handleCreate}>
              <FormFields data={form} onChange={setForm}/>
              <div className="modal-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>{submitting?<><FaSpinner className="spin"/> Creating…</>:'Create'}</button>
                <button type="button" className="cancel-btn" onClick={()=>setShowAddModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selected && (
        <div className="modal-overlay" onClick={()=>setShowEditModal(false)}>
          <div className="modal-content large-modal" onClick={e=>e.stopPropagation()}>
            <h3>Edit Announcement</h3>
            {formError && <div className="error-message" style={{marginBottom:12}}>{formError}</div>}
            <form onSubmit={handleEdit}>
              <FormFields data={selected} onChange={setSelected}/>
              <div className="modal-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>{submitting?<><FaSpinner className="spin"/> Saving…</>:'Save'}</button>
                <button type="button" className="cancel-btn" onClick={()=>setShowEditModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminNotificationsPage;