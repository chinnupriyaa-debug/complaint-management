import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Background with Anna University Image -->
      <div class="background-overlay"></div>
      
      <!-- Header -->
      <header class="header">
        <div class="logo-section">
          <div class="university-emblem">
            <span class="emblem-text">AU</span>
          </div>
          <div class="university-info">
            <h1>Anna University</h1>
            <p>Chennai - 600 025</p>
          </div>
        </div>
        <nav class="nav-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="title-line">Complaint Management</span>
            <span class="title-line accent">System</span>
          </h1>
          <p class="hero-subtitle">
            A streamlined platform for students and faculty to manage, 
            track, and resolve academic and administrative complaints efficiently.
          </p>
          
          <!-- Login Cards -->
          <div class="login-cards">
            <div class="login-card student-card" (click)="navigateTo('/student-login')">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3>Student Login</h3>
              <p>Submit and track your complaints</p>
              <button class="card-btn">
                Login as Student
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div class="login-card faculty-card" (click)="navigateTo('/faculty-login')">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Faculty Login</h3>
              <p>Review and resolve complaints</p>
              <button class="card-btn">
                Login as Faculty
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="about">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
            </div>
            <h4>Easy Submission</h4>
            <p>Submit complaints with priority levels and detailed descriptions</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h4>Real-time Tracking</h4>
            <p>Track complaint status with instant notifications</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h4>Quick Resolution</h4>
            <p>Automated alerts for pending complaints</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h4>Communication</h4>
            <p>Direct communication between students and faculty</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer" id="contact">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Anna University</h4>
            <p>Sardar Patel Road, Guindy</p>
            <p>Chennai - 600 025, Tamil Nadu</p>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Phone: 044-2235 8561</p>
            <p>Email: support&#64;annauniv.edu</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <a routerLink="/student-login">Student Portal</a>
            <a routerLink="/faculty-login">Faculty Portal</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Anna University. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      position: relative;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
    }

    .background-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://upload.wikimedia.org/wikipedia/en/6/6c/Anna_University_Logo.svg');
      background-size: 400px;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 60px;
      position: relative;
      z-index: 10;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .university-emblem {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ffc107, #ff9800);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
    }

    .emblem-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
    }

    .university-info h1 {
      font-size: 1.5rem;
      color: white;
      margin: 0;
      font-weight: 600;
    }

    .university-info p {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    .nav-links {
      display: flex;
      gap: 30px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: #ffc107;
    }

    .hero {
      min-height: calc(100vh - 100px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      position: relative;
      z-index: 5;
    }

    .hero-content {
      text-align: center;
      max-width: 1200px;
    }

    .hero-title {
      margin-bottom: 24px;
    }

    .title-line {
      display: block;
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.3);
    }

    .title-line.accent {
      color: #ffc107;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto 50px;
      line-height: 1.8;
    }

    .login-cards {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 320px;
      text-align: center;
      cursor: pointer;
      transition: all 0.4s ease;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .login-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .student-card .card-icon {
      color: #1a237e;
    }

    .faculty-card .card-icon {
      color: #c62828;
    }

    .card-icon {
      margin-bottom: 20px;
    }

    .login-card h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #1a1a2e;
    }

    .login-card p {
      color: #666;
      margin-bottom: 25px;
    }

    .card-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .student-card .card-btn {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
    }

    .faculty-card .card-btn {
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
    }

    .card-btn:hover {
      transform: scale(1.05);
    }

    .features {
      padding: 80px 60px;
      background: white;
      position: relative;
      z-index: 5;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #1a237e;
      margin-bottom: 50px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-item {
      text-align: center;
      padding: 30px;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: #f5f7fa;
      transform: translateY(-5px);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
    }

    .feature-item h4 {
      font-size: 1.3rem;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .feature-item p {
      color: #666;
      line-height: 1.6;
    }

    .footer {
      background: #1a1a2e;
      color: white;
      padding: 60px 60px 20px;
      position: relative;
      z-index: 5;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto 40px;
    }

    .footer-section h4 {
      font-size: 1.2rem;
      margin-bottom: 20px;
      color: #ffc107;
    }

    .footer-section p,
    .footer-section a {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
      display: block;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: #ffc107;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom p {
      color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .header {
        padding: 15px 20px;
        flex-direction: column;
        gap: 15px;
      }

      .title-line {
        font-size: 2.5rem;
      }

      .login-cards {
        flex-direction: column;
        align-items: center;
      }

      .login-card {
        width: 100%;
        max-width: 320px;
      }

      .features,
      .footer {
        padding: 40px 20px;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
