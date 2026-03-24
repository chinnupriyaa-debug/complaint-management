import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('submit');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issue: '',
    priority: '',
    complaint: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const issues = [
    'Academic',
    'Infrastructure',
    'Library',
    'Hostel',
    'Canteen',
    'Transportation',
    'Lab Equipment',
    'Wi-Fi/Internet',
    'Examination',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  // Fetch complaints on mount
  useEffect(() => {
    if (activeTab === 'history') {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/complaints/my-complaints`);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/complaints`, formData);
      toast.success('Complaint submitted successfully!');
      setFormData({ issue: '', priority: '', complaint: '' });
      setActiveTab('history');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
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
  // Memoize filtered and searched complaints
  // ============================================
  const filteredComplaints = useMemo(() => {
    let result = complaints;

    // Filter by status
    if (filter !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === filter.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.issue.toLowerCase().includes(term) ||
        c.complaint.toLowerCase().includes(term) ||
        c.status.toLowerCase().includes(term)
      );
    }

    return result;
  }, [complaints, filter, searchTerm]);

  // Memoized stats calculation
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      rectified: complaints.filter(c => c.status === 'Rectified').length
    };
  }, [complaints]);

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
    <div className="dashboard student-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png" 
            alt="Anna University" 
            className="sidebar-logo"
          />
          <h3>Student Portal</h3>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Submit Complaint
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Complaints
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Student</span>
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
          <h1>Welcome, {user?.username}!</h1>
          <p>Anna University Complaint Management System</p>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Complaints</span>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card progress">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.rectified}</span>
              <span className="stat-label">Rectified</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'submit' && (
            <div className="card submit-card fade-in">
              <div className="card-header">
                <h2>Submit New Complaint</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Issue Category *</label>
                      <select
                        name="issue"
                        className="form-control"
                        value={formData.issue}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Issue Category</option>
                        {issues.map(issue => (
                          <option key={issue} value={issue}>{issue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority Level *</label>
                      <select
                        name="priority"
                        className="form-control"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Priority</option>
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Complaint Details *</label>
                    <textarea
                      name="complaint"
                      className="form-control"
                      placeholder="Describe your complaint in detail (minimum 10 characters)"
                      value={formData.complaint}
                      onChange={handleChange}
                      required
                      minLength={10}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section fade-in">
              <div className="history-header">
                <h2>My Complaints History</h2>
                <div className="history-controls">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search complaints..."
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
                  <p>Loading complaints...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3>No complaints found</h3>
                  <p>You haven't submitted any complaints yet or no complaints match your filter.</p>
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
                        <h4>{complaint.issue}</h4>
                        <p>{complaint.complaint}</p>
                      </div>
                      {complaint.facultyResponse && (
                        <div className="complaint-response">
                          <strong>Faculty Response:</strong>
                          <p>{complaint.facultyResponse}</p>
                        </div>
                      )}
                      <div className="complaint-footer">
                        <span>
                          Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                        {complaint.resolvedAt && (
                          <span>
                            Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
