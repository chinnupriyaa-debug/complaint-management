import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [complaints, setComplaints] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseForm, setResponseForm] = useState({
    status: '',
    response: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on mount and tab change
  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingComplaints();
    } else if (activeTab === 'all') {
      fetchAllComplaints();
    } else if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchPendingComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints/pending`);
      setPendingComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints/all`);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints/history`);
      setHistory(response.data);
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setLoading(true);
    try {
      await axios.patch(
        `${API_URL}/complaints/${selectedComplaint._id}/respond`,
        responseForm
      );
      toast.success('Response submitted successfully!');
      setSelectedComplaint(null);
      setResponseForm({ status: '', response: '' });
      fetchPendingComplaints();
      fetchAllComplaints();
    } catch (error) {
      toast.error('Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  // ============================================
  // useMemo - React Advanced Topic
  // Memoize filtered complaints for performance
  // ============================================
  const filteredComplaints = useMemo(() => {
    let result = activeTab === 'pending' ? pendingComplaints : 
                 activeTab === 'history' ? history : complaints;

    if (filter !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === filter.toLowerCase());
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.studentUsername?.toLowerCase().includes(term) ||
        c.issue.toLowerCase().includes(term) ||
        c.complaint.toLowerCase().includes(term)
      );
    }

    return result;
  }, [pendingComplaints, complaints, history, activeTab, filter, searchTerm]);

  // Memoized chart data
  const chartData = useMemo(() => {
    if (!stats) return { statusData: [], priorityData: [], issueData: [] };

    const COLORS = ['#ff9800', '#2196f3', '#4caf50', '#f44336'];

    const statusData = stats.statusStats?.map((item, index) => ({
      name: item.status,
      value: item.count,
      color: COLORS[index % COLORS.length]
    })) || [];

    const priorityData = stats.priorityStats?.map(item => ({
      name: item.priority,
      count: item.count
    })) || [];

    const issueData = stats.issueStats?.slice(0, 5).map(item => ({
      name: item.issue,
      total: item.total,
      pending: item.pending,
      rectified: item.rectified
    })) || [];

    return { statusData, priorityData, issueData, COLORS };
  }, [stats]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'badge-pending',
      'In Progress': 'badge-progress',
      'Rectified': 'badge-rectified',
      'Rejected': 'badge-rejected'
    };
    return `badge ${statusClasses[status] || ''}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'Low': 'badge-low',
      'Medium': 'badge-medium',
      'High': 'badge-high',
      'Critical': 'badge-critical'
    };
    return `badge ${priorityClasses[priority] || ''}`;
  };

  return (
    <div className="dashboard faculty-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png" 
            alt="Anna University" 
            className="sidebar-logo"
          />
          <h3>Faculty Portal</h3>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Complaints
            {pendingComplaints.length > 0 && (
              <span className="badge-count">{pendingComplaints.length}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            All Complaints
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Responses
          </button>
          <button 
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistics
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar faculty-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Faculty</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h1>Faculty Dashboard</h1>
          <p>Manage and resolve student complaints</p>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Pending Complaints */}
          {activeTab === 'pending' && (
            <div className="pending-section fade-in">
              <div className="section-header">
                <h2>Pending Complaints</h2>
                <div className="history-controls">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by student or issue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading complaints...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="empty-state success-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3>All caught up!</h3>
                  <p>No pending complaints to review.</p>
                </div>
              ) : (
                <div className="complaints-table-container">
                  <table className="complaints-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Complaint</th>
                        <th>Submitted</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td>
                            <strong>{complaint.studentUsername}</strong>
                          </td>
                          <td>{complaint.issue}</td>
                          <td>
                            <span className={getPriorityBadge(complaint.priority)}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="complaint-text">{complaint.complaint}</td>
                          <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => setSelectedComplaint(complaint)}
                            >
                              Respond
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* All Complaints */}
          {activeTab === 'all' && (
            <div className="all-section fade-in">
              <div className="section-header">
                <h2>All Complaints</h2>
                <div className="history-controls">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="rectified">Rectified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="complaints-table-container">
                  <table className="complaints-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Complaint</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td><strong>{complaint.studentUsername}</strong></td>
                          <td>{complaint.issue}</td>
                          <td>
                            <span className={getPriorityBadge(complaint.priority)}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td>
                            <span className={getStatusBadge(complaint.status)}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="complaint-text">{complaint.complaint}</td>
                          <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div className="history-section fade-in">
              <div className="section-header">
                <h2>My Response History</h2>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3>No responses yet</h3>
                  <p>You haven't responded to any complaints yet.</p>
                </div>
              ) : (
                <div className="complaints-grid">
                  {filteredComplaints.map((complaint, index) => (
                    <div 
                      key={complaint._id} 
                      className="complaint-card slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="complaint-header">
                        <span className={getStatusBadge(complaint.status)}>
                          {complaint.status}
                        </span>
                        <span className={getPriorityBadge(complaint.priority)}>
                          {complaint.priority}
                        </span>
                      </div>
                      <div className="complaint-body">
                        <p className="student-name">From: {complaint.studentUsername}</p>
                        <h4>{complaint.issue}</h4>
                        <p>{complaint.complaint}</p>
                      </div>
                      <div className="complaint-response">
                        <strong>Your Response:</strong>
                        <p>{complaint.facultyResponse}</p>
                      </div>
                      <div className="complaint-footer">
                        <span>Responded: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          {activeTab === 'stats' && (
            <div className="stats-section fade-in">
              <h2>Complaint Statistics</h2>
              
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : stats ? (
                <div className="charts-grid">
                  {/* Status Distribution */}
                  <div className="chart-card">
                    <h3>Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData.statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {chartData.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Priority Distribution */}
                  <div className="chart-card">
                    <h3>Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1a237e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Issue Categories */}
                  <div className="chart-card full-width">
                    <h3>Top Issue Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.issueData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#1a237e" name="Total" />
                        <Bar dataKey="pending" fill="#ff9800" name="Pending" />
                        <Bar dataKey="rectified" fill="#4caf50" name="Rectified" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Stats */}
                  <div className="summary-stats">
                    <div className="summary-item">
                      <span className="summary-value">{stats.totalComplaints}</span>
                      <span className="summary-label">Total Complaints</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No statistics available</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Respond to Complaint</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedComplaint(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="complaint-details">
                <p><strong>Student:</strong> {selectedComplaint.studentUsername}</p>
                <p><strong>Issue:</strong> {selectedComplaint.issue}</p>
                <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                <p><strong>Complaint:</strong></p>
                <p className="complaint-text-box">{selectedComplaint.complaint}</p>
              </div>

              <form onSubmit={handleRespond}>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-control"
                    value={responseForm.status}
                    onChange={(e) => setResponseForm({...responseForm, status: e.target.value})}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Rectified">Rectified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Response *</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter your response..."
                    value={responseForm.response}
                    onChange={(e) => setResponseForm({...responseForm, response: e.target.value})}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
