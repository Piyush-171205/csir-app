import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaFileExcel, FaPrint, FaDownload, FaSpinner } from 'react-icons/fa';
import { getReports } from '../../services/adminService';

const DEPT_COLORS = { road:'#4a90e2', water:'#50c878', electricity:'#f39c12', garbage:'#e67e22', infrastructure:'#9b59b6', education:'#3498db' };
const PRIORITY_COLORS = { urgent:'#dc3545', high:'#fd7e14', medium:'#ffc107', low:'#28a745' };

const AdminReportsPage = ({ t }) => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [reportType, setReportType]     = useState('monthly');
  const [reports, setReports]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try { setReports(await getReports(selectedYear)); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load reports.'); }
      finally { setLoading(false); }
    })();
  }, [selectedYear]);

  const maxBar = (arr, key) => Math.max(...arr.map(i => i[key] || 0), 1);

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
      </div>

      <div className="report-controls glass-card">
        <div className="control-group"><label>Report Type:</label>
          <select value={reportType} onChange={e=>setReportType(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="department">By Department</option>
            <option value="priority">By Priority</option>
            <option value="status">By Status</option>
          </select>
        </div>
        <div className="control-group"><label>Year:</label>
          <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)}>
            {[2026,2025,2024].map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="export-buttons">
          {[['PDF',<FaFilePdf/>],['Excel',<FaFileExcel/>],['Print',<FaPrint/>],['Download',<FaDownload/>]].map(([l,icon])=>(
            <button key={l} className="export-btn" onClick={()=>alert(`${l} export coming soon`)}>{icon} {l}</button>
          ))}
        </div>
      </div>

      {error && <div className="error-message glass-card" style={{padding:16,marginBottom:16}}>{error}</div>}

      {loading ? (
        <div style={{textAlign:'center',padding:60}}><FaSpinner className="spin" style={{fontSize:32}}/></div>
      ) : reports && (
        <div className="report-content glass-card">

          {/* ── Summary cards (always shown) ── */}
          <div className="stats-grid-small" style={{marginBottom:24}}>
            {[
              ['Total Complaints', reports.summary.totalThisYear],
              ['Resolved',         reports.summary.resolvedThisYear],
              ['Pending',          reports.summary.pendingThisYear],
              ['Avg. Resolution',  `${reports.summary.avgResolutionDays} days`],
            ].map(([l,v])=>(
              <div key={l} className="stat-card mini glass-card"><span className="stat-label">{l}</span><span className="stat-value">{v}</span></div>
            ))}
          </div>

          {/* ── Monthly ── */}
          {reportType === 'monthly' && (
            <>
              <h3>Monthly Trend — {selectedYear}</h3>
              <div className="chart-section">
                <div className="chart-container">
                  <div className="chart-bars large">
                    {reports.monthly.map((m,i) => (
                      <div key={i} className="chart-bar-group">
                        <div className="bar-labels"><span>{m.label}</span></div>
                        <div className="bars">
                          <div className="bar complaints" style={{height:`${(m.total/maxBar(reports.monthly,'total'))*120}px`}} title={`Total: ${m.total}`}><span className="bar-value">{m.total}</span></div>
                          <div className="bar resolved"   style={{height:`${(m.resolved/maxBar(reports.monthly,'total'))*120}px`}} title={`Resolved: ${m.resolved}`}><span className="bar-value">{m.resolved}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-legend">
                    <span className="legend-item complaints">Total</span>
                    <span className="legend-item resolved">Resolved</span>
                  </div>
                </div>
              </div>
              <div className="data-table-container" style={{marginTop:16}}>
                <table className="data-table">
                  <thead><tr><th>Month</th><th>Total</th><th>Resolved</th><th>Pending</th><th>Rate</th></tr></thead>
                  <tbody>
                    {reports.monthly.map((m,i) => {
                      const rate = m.total > 0 ? Math.round((m.resolved/m.total)*100) : 0;
                      return (
                        <tr key={i}>
                          <td><strong>{m.label}</strong></td><td>{m.total}</td><td>{m.resolved}</td><td>{m.pending}</td>
                          <td>
                            <div className="progress-bar-container">
                              <div className="progress-bar" style={{width:`${rate}%`}}/>
                              <span className="progress-text">{rate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── By Department ── */}
          {reportType === 'department' && (
            <>
              <h3>Department-wise Analysis</h3>
              <div className="department-stats">
                {reports.byDepartment.map(d => (
                  <div key={d.department} className="department-stat-item">
                    <span className="dept-name">{d.department?.charAt(0).toUpperCase()+d.department?.slice(1)}</span>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{width:`${(d.count/Math.max(...reports.byDepartment.map(x=>x.count),1))*100}%`, backgroundColor: DEPT_COLORS[d.department]||'#4a90e2'}}/>
                    </div>
                    <span className="dept-count">{d.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── By Priority ── */}
          {reportType === 'priority' && (
            <>
              <h3>Priority-wise Analysis</h3>
              <div className="priority-chart">
                {reports.byPriority.map(d => (
                  <div key={d.priority} className="priority-item">
                    <span className={`priority-label ${d.priority}`}>{d.priority}</span>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{width:`${(d.count/Math.max(...reports.byPriority.map(x=>x.count),1))*100}%`, backgroundColor: PRIORITY_COLORS[d.priority]||'#4a90e2'}}/>
                    </div>
                    <span className="priority-count">{d.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── By Status ── */}
          {reportType === 'status' && (
            <>
              <h3>Status-wise Breakdown</h3>
              <div className="department-stats">
                {reports.byStatus.map(d => (
                  <div key={d.status} className="department-stat-item">
                    <span className="dept-name">{d.status}</span>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{width:`${(d.count/Math.max(...reports.byStatus.map(x=>x.count),1))*100}%`}}/>
                    </div>
                    <span className="dept-count">{d.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminReportsPage;