import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaSpinner } from 'react-icons/fa';
import { getDepartmentComplaints } from '../../services/authorityService';

const DEPT_NAMES = { road:'Road Department', water:'Water Department', electricity:'Electricity Department', garbage:'Garbage Department', infrastructure:'Infrastructure Department', education:'Education Department' };
const STATUS_COLORS = { reported:'#6b7280', acknowledged:'#3b82f6', 'in-progress':'#f59e0b', 'almost-resolved':'#9b59b6', resolved:'#10b981', completed:'#10b981' };

const AuthorityComplaintsPage = ({ currentUser, t }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy]         = useState('newest');

  useEffect(() => {
    (async () => {
      try { setComplaints(await getDepartmentComplaints()); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load complaints.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = [...complaints];
    if (filter !== 'all') list = list.filter(c => c.status === filter);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(c =>
        (c.complaintId||'').toLowerCase().includes(t) ||
        c.title.toLowerCase().includes(t) ||
        (c.reportedBy ? `${c.reportedBy.firstName} ${c.reportedBy.lastName}`.toLowerCase().includes(t) : false) ||
        (c.location?.address||'').toLowerCase().includes(t)
      );
    }
    if (sortBy === 'oldest')   list.sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
    else if (sortBy === 'progress') list.sort((a,b) => b.progress-a.progress);
    else list.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    return list;
  }, [complaints, filter, searchTerm, sortBy]);

  const stats = {
    total:       complaints.length,
    reported:    complaints.filter(c=>c.status==='reported').length,
    acknowledged:complaints.filter(c=>c.status==='acknowledged').length,
    inProgress:  complaints.filter(c=>['in-progress','almost-resolved'].includes(c.status)).length,
    resolved:    complaints.filter(c=>['resolved','completed'].includes(c.status)).length,
  };

  if (loading) return <div className="authority-complaints-container" style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>;

  return (
    <div className="authority-complaints-container">
      <div className="page-header">
        <h2>{DEPT_NAMES[currentUser?.department]} — All Complaints</h2>
        <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>← Back</button>
      </div>

      {error && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{error}</div>}

      <div className="complaints-summary glass-card">
        <div className="summary-stats">
          {[['Total',stats.total,''],['Reported',stats.reported,'#6b7280'],['Acknowledged',stats.acknowledged,'#3b82f6'],['In Progress',stats.inProgress,'#f59e0b'],['Resolved',stats.resolved,'#10b981']].map(([l,v,c])=>(
            <div key={l} className="summary-stat">
              <span className="stat-label">{l}:</span>
              <span className="stat-value" style={c?{color:c}:{}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="complaints-filters glass-card">
        <div className="filter-group"><label>Status:</label>
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="reported">Reported</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in-progress">In Progress</option>
            <option value="almost-resolved">Almost Resolved</option>
            <option value="resolved">Resolved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="filter-group"><label>Sort:</label>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="progress">By Progress</option>
          </select>
        </div>
        <div className="search-group">
          <input type="text" placeholder="Search by ID, title, citizen, location…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          <FaSearch className="search-icon"/>
        </div>
      </div>

      <div className="complaints-table-container glass-card">
        {filtered.length === 0
          ? <div className="no-complaints"><p>No complaints found.</p></div>
          : <table className="complaints-table">
              <thead><tr><th>ID</th><th>Title</th><th>Citizen</th><th>Location</th><th>Date</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td className="complaint-id">{c.complaintId || c._id.slice(-6).toUpperCase()}</td>
                    <td>{c.title}</td>
                    <td>{c.reportedBy ? `${c.reportedBy.firstName} ${c.reportedBy.lastName}` : '—'}</td>
                    <td>{c.location?.area || c.location?.address || '—'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge" style={{backgroundColor:STATUS_COLORS[c.status]||'#888',color:'white',padding:'2px 8px',borderRadius:4}}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{width:`${c.progress||0}%`,backgroundColor:STATUS_COLORS[c.status]||'#888'}}/>
                        </div>
                        <span className="progress-text">{c.progress||0}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => navigate(`/authority/complaint/${c._id}`)}>
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
};
export default AuthorityComplaintsPage;