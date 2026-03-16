import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoad, FaTint, FaBolt, FaTrashAlt, FaLightbulb, FaSchool, FaSpinner } from 'react-icons/fa';
import { getDepartmentStats } from '../../services/adminService';

// Departments are fixed enums in the DB schema — categories page shows real complaint counts per dept
const DEPARTMENTS = [
  { id: 'road',           name: 'Road',           icon: <FaRoad />,      color: '#4a90e2' },
  { id: 'water',          name: 'Water',          icon: <FaTint />,      color: '#50c878' },
  { id: 'electricity',    name: 'Electricity',    icon: <FaBolt />,      color: '#f39c12' },
  { id: 'garbage',        name: 'Garbage',        icon: <FaTrashAlt />,  color: '#e67e22' },
  { id: 'infrastructure', name: 'Infrastructure', icon: <FaLightbulb />, color: '#9b59b6' },
  { id: 'education',      name: 'Education',      icon: <FaSchool />,    color: '#3498db' },
];

const AdminCategoriesPage = ({ t }) => {
  const navigate = useNavigate();
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try { setStats(await getDepartmentStats()); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load stats.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const total = Object.values(stats).reduce((s, v) => s + v, 0) || 1;

  if (loading) return (
    <div className="admin-page-container" style={{textAlign:'center',padding:60}}>
      <FaSpinner className="spin" style={{fontSize:32}}/><p style={{marginTop:12}}>Loading…</p>
    </div>
  );

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Complaint Categories</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
      </div>

      <p style={{color:'#666',marginBottom:16}}>
        Categories map to fixed department enums in the database. Counts reflect all complaints submitted.
      </p>

      {error && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{error}</div>}

      <div className="categories-grid">
        {DEPARTMENTS.map(dept => {
          const count = stats[dept.id] || 0;
          const pct   = Math.round((count / total) * 100);
          return (
            <div key={dept.id} className="category-card glass-card" style={{ borderTopColor: dept.color }}>
              <div className="category-icon" style={{ backgroundColor: dept.color + '20', color: dept.color }}>
                {dept.icon}
              </div>
              <div className="category-content">
                <h3>{dept.name}</h3>
                <p className="category-count">{count} complaints</p>
                <div className="progress-bar-container" style={{marginTop:8}}>
                  <div className="progress-bar" style={{width:`${pct}%`, backgroundColor: dept.color}}/>
                </div>
                <small style={{color:'#888'}}>{pct}% of total</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{padding:20,marginTop:16}}>
        <h3>Total Complaints: {total}</h3>
        <p style={{color:'#666',fontSize:14}}>
          To add new departments, update the <code>department</code> enum in <code>models/Complaint.js</code> and <code>models/User.js</code>.
        </p>
      </div>
    </div>
  );
};
export default AdminCategoriesPage;