import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const FacultyLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

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
      let result;
      
      if (isLogin) {
        result = await login(formData.username, formData.password, 'faculty');
      } else {
        result = await register({
          ...formData,
          role: 'faculty'
        });
      }

      if (result.success) {
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/faculty-dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Information Technology',
    'Biotechnology',
    'Administration'
  ];

  return (
    <div className="login-page faculty-page">
      <div className="login-background">
        <div className="login-container fade-in">
          <Link to="/" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="login-header">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png" 
              alt="Anna University" 
              className="login-logo"
            />
            <h2>Faculty {isLogin ? 'Login' : 'Registration'}</h2>
            <p>Complaint Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your official email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-block" disabled={loading}>
              {loading ? (
                <span className="spinner-small"></span>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>

          <div className="toggle-form">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>

          <div className="demo-credentials faculty-demo">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: faculty1 | Password: faculty123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;
