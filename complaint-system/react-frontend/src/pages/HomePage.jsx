import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Background with Anna University Image */}
      <div className="hero-background">
        <div className="overlay"></div>

        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <img
              src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100063746330901"
              alt="Anna University Logo"
              className="logo"
              onError={(e) => {
                // Fallback: show AU SVG badge if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback SVG — hidden unless the img above fails */}
            <svg
              style={{ display: 'none' }}
              className="logo"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Anna University Logo"
            >
              <circle cx="40" cy="40" r="38" fill="#1a2456" stroke="#c8a020" strokeWidth="3" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#c8a020" strokeWidth="1.2" />
              <text
                x="40" y="46"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontWeight="bold"
                fontSize="22"
                fill="#e8c84a"
                letterSpacing="1"
              >
                AU
              </text>
            </svg>

            <div className="title-container">
              <h1>Anna University</h1>
              <p className="tagline">Chennai - 600 025</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-box fade-in">
            <h2 className="welcome-title">
              Complaint Management System
            </h2>
            <p className="welcome-text">
              A unified platform for students to submit complaints and for faculty
              to manage and resolve them efficiently.
            </p>

            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Quick Submission</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Real-time Updates</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span>Track Progress</span>
              </div>
            </div>

            {/* Login Options */}
            <div className="login-section">
              <h3>Select Your Login Type</h3>
              <div className="login-buttons">
                <Link to="/student-login" className="login-card student-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h4>Student Login</h4>
                  <p>Submit and track your complaints</p>
                </Link>

                <Link to="/faculty-login" className="login-card faculty-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4>Faculty Login</h4>
                  <p>Manage and resolve complaints</p>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Anna University, Chennai. All Rights Reserved.</p>
          <p>Complaint Management System - Version 1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
