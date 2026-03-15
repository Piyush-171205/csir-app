import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartBar, FaChartPie, FaChartLine, FaDownload,
  FaCalendarAlt, FaFilePdf, FaFileExcel, FaPrint
} from 'react-icons/fa';
import { monthlyReportData, complaintCategories } from '../../data/adminData';

const AdminReportsPage = ({ t }) => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [reportType, setReportType] = useState('monthly');

  // Mock data for different report types
  const departmentWiseData = {
    road: 45,
    water: 32,
    electricity: 28,
    garbage: 38,
    infrastructure: 25,
    education: 18
  };

  const priorityWiseData = {
    urgent: 15,
    high: 28,
    medium: 42,
    low: 25
  };

  const statusWiseData = {
    pending: 35,
    'in-progress': 42,
    resolved: 68
  };

  const resolutionTimeData = {
    road: '3.5 days',
    water: '2.8 days',
    electricity: '4.2 days',
    garbage: '1.5 days',
    infrastructure: '5.1 days',
    education: '6.3 days'
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="report-controls glass-card">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="monthly">Monthly Report</option>
            <option value="department">Department-wise</option>
            <option value="priority">Priority Analysis</option>
            <option value="resolution">Resolution Time</option>
          </select>
        </div>

        <div className="control-group">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="control-group">
          <label>Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="all">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="export-buttons">
          <button className="export-btn"><FaFilePdf /> PDF</button>
          <button className="export-btn"><FaFileExcel /> Excel</button>
          <button className="export-btn"><FaPrint /> Print</button>
          <button className="export-btn"><FaDownload /> Download</button>
        </div>
      </div>

      {/* Report Content */}
      <div className="report-content glass-card">
        {reportType === 'monthly' && (
          <>
            <h3>Monthly Complaint Report - {selectedYear}</h3>
            
            {/* Summary Cards */}
            <div className="stats-grid-small">
              <div className="stat-card mini glass-card">
                <span className="stat-label">Total Complaints</span>
                <span className="stat-value">568</span>
              </div>
              <div className="stat-card mini glass-card">
                <span className="stat-label">Resolved</span>
                <span className="stat-value">412</span>
              </div>
              <div className="stat-card mini glass-card">
                <span className="stat-label">Pending</span>
                <span className="stat-value">156</span>
              </div>
              <div className="stat-card mini glass-card">
                <span className="stat-label">Avg. Resolution</span>
                <span className="stat-value">3.8 days</span>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <h4>Monthly Trends</h4>
              <div className="chart-container">
                <div className="chart-bars large">
                  {monthlyReportData.labels.map((label, index) => (
                    <div key={index} className="chart-bar-group">
                      <div className="bar-labels">
                        <span>{label}</span>
                      </div>
                      <div className="bars">
                        <div 
                          className="bar complaints" 
                          style={{ height: `${monthlyReportData.complaints[index] * 3}px` }}
                        >
                          <span className="bar-value">{monthlyReportData.complaints[index]}</span>
                        </div>
                        <div 
                          className="bar resolved" 
                          style={{ height: `${monthlyReportData.resolved[index] * 3}px` }}
                        >
                          <span className="bar-value">{monthlyReportData.resolved[index]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Complaints</th>
                    <th>Resolved</th>
                    <th>Pending</th>
                    <th>Resolution Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReportData.labels.map((label, index) => {
                    const total = monthlyReportData.complaints[index];
                    const resolved = monthlyReportData.resolved[index];
                    const rate = Math.round((resolved / total) * 100);
                    return (
                      <tr key={index}>
                        <td><strong>{label}</strong></td>
                        <td>{total}</td>
                        <td>{resolved}</td>
                        <td>{monthlyReportData.pending[index]}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${rate}%` }}></div>
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

        {reportType === 'department' && (
          <>
            <h3>Department-wise Complaint Analysis</h3>
            
            <div className="department-stats">
              {Object.entries(departmentWiseData).map(([dept, count]) => (
                <div key={dept} className="department-stat-item">
                  <span className="dept-name">{dept.charAt(0).toUpperCase() + dept.slice(1)}</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${(count / 50) * 100}%` }}></div>
                  </div>
                  <span className="dept-count">{count}</span>
                </div>
              ))}
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Complaints</th>
                    <th>Percentage</th>
                    <th>Avg Resolution Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(departmentWiseData).map(([dept, count]) => (
                    <tr key={dept}>
                      <td>{dept.charAt(0).toUpperCase() + dept.slice(1)}</td>
                      <td>{count}</td>
                      <td>{Math.round((count / 186) * 100)}%</td>
                      <td>{resolutionTimeData[dept]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {reportType === 'priority' && (
          <>
            <h3>Priority-wise Complaint Analysis</h3>
            
            <div className="priority-chart">
              {Object.entries(priorityWiseData).map(([priority, count]) => (
                <div key={priority} className="priority-item">
                  <span className={`priority-label ${priority}`}>{priority}</span>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(count / 45) * 100}%`,
                        backgroundColor: 
                          priority === 'urgent' ? '#dc3545' :
                          priority === 'high' ? '#fd7e14' :
                          priority === 'medium' ? '#ffc107' : '#28a745'
                      }}
                    ></div>
                  </div>
                  <span className="priority-count">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;