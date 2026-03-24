import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-faculty-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-background"></div>
      
      <div class="login-card">
        <a routerLink="/" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </a>

        <div class="card-header">
          <div class="header-icon faculty">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2>Faculty Login</h2>
          <p>Enter your credentials to manage complaints</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          @if (error()) {
            <div class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ error() }}
            </div>
          }

          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                id="username"
                [(ngModel)]="username"
                name="username"
                placeholder="Enter your username"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                required
              >
              <button type="button" class="toggle-password" (click)="togglePassword()">
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Logging in...
            } @else {
              Login
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            }
          </button>
        </form>

        <div class="card-footer">
          <p>Don't have an account?</p>
          <button class="register-btn" (click)="toggleMode()">
            {{ isRegisterMode() ? 'Back to Login' : 'Register Here' }}
          </button>
        </div>

        @if (isRegisterMode()) {
          <form (ngSubmit)="onRegister()" class="register-form">
            <h3>Create Faculty Account</h3>
            
            <div class="form-group">
              <label for="regUsername">Username</label>
              <input
                type="text"
                id="regUsername"
                [(ngModel)]="regUsername"
                name="regUsername"
                placeholder="Choose a username"
                required
              >
            </div>

            <div class="form-group">
              <label for="regEmail">Email</label>
              <input
                type="email"
                id="regEmail"
                [(ngModel)]="regEmail"
                name="regEmail"
                placeholder="Enter your email"
                required
              >
            </div>

            <div class="form-group">
              <label for="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                [(ngModel)]="regPassword"
                name="regPassword"
                placeholder="Create a password"
                required
              >
            </div>

            <div class="form-group">
              <label for="regDepartment">Department</label>
              <select
                id="regDepartment"
                [(ngModel)]="regDepartment"
                name="regDepartment"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="MECH">Mechanical Engineering</option>
                <option value="CIVIL">Civil Engineering</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>

            <button type="submit" class="submit-btn faculty-btn" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span>
                Creating Account...
              } @else {
                Create Account
              }
            </button>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #b71c1c 0%, #c62828 50%, #d32f2f 100%);
      position: relative;
    }

    .login-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://upload.wikimedia.org/wikipedia/en/6/6c/Anna_University_Logo.svg');
      background-size: 300px;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.05;
      pointer-events: none;
    }

    .login-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 10;
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 24px;
      transition: color 0.3s ease;
    }

    .back-btn:hover {
      color: #c62828;
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .header-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .header-icon.faculty {
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
    }

    .card-header h2 {
      font-size: 1.8rem;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .card-header p {
      color: #666;
    }

    .login-form {
      margin-bottom: 24px;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #1a1a2e;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper svg {
      position: absolute;
      left: 14px;
      color: #999;
    }

    .input-wrapper input {
      width: 100%;
      padding: 14px 14px 14px 46px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .input-wrapper input:focus {
      outline: none;
      border-color: #c62828;
      box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
    }

    .toggle-password {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      padding: 0;
    }

    .toggle-password:hover {
      color: #c62828;
    }

    .submit-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .card-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .card-footer p {
      color: #666;
      margin-bottom: 8px;
    }

    .register-btn {
      background: none;
      border: none;
      color: #c62828;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
    }

    .register-btn:hover {
      text-decoration: underline;
    }

    .register-form {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .register-form h3 {
      text-align: center;
      margin-bottom: 20px;
      color: #1a1a2e;
    }

    .register-form input,
    .register-form select {
      width: 100%;
      padding: 14px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .register-form input:focus,
    .register-form select:focus {
      outline: none;
      border-color: #c62828;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
      }
    }
  `]
})
export class FacultyLoginComponent {
  username = '';
  password = '';
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regDepartment = '';
  
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);
  isRegisterMode = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleMode(): void {
    this.isRegisterMode.update(v => !v);
    this.error.set('');
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password, 'faculty').subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/faculty-dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please try again.');
      }
    });
  }

  onRegister(): void {
    if (!this.regUsername || !this.regEmail || !this.regPassword || !this.regDepartment) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register({
      username: this.regUsername,
      email: this.regEmail,
      password: this.regPassword,
      role: 'faculty',
      department: this.regDepartment
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/faculty-dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
