import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComplaintService, Complaint } from '../../services/complaint.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="university-logo">AU</div>
          <div class="university-name">
            <h3>Anna University</h3>
            <p>Student Portal</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button 
            class="nav-item"
            [class.active]="activeTab() === 'submit'"
            (click)="activeTab.set('submit')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Submit Complaint
          </button>
          <button 
            class="nav-item"
            [class.active]="activeTab() === 'history'"
            (click)="activeTab.set('history')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            My Complaints
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ getUserInitials() }}</div>
            <div class="user-details">
              <span class="user-name">{{ user()?.username }}</span>
              <span class="user-role">Student</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="content-header">
          <h1>{{ activeTab() === 'submit' ? 'Submit New Complaint' : 'My Complaints History' }}</h1>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalComplaints() }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item pending">
              <span class="stat-value">{{ pendingCount() }}</span>
              <span class="stat-label">Pending</span>
            </div>
            <div class="stat-item resolved">
              <span class="stat-value">{{ resolvedCount() }}</span>
              <span class="stat-label">Resolved</span>
            </div>
          </div>
        </header>

        @if (activeTab() === 'submit') {
          <div class="submit-section">
            @if (successMessage()) {
              <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {{ successMessage() }}
              </div>
            }

            @if (errorMessage()) {
              <div class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {{ errorMessage() }}
              </div>
            }

            <form (ngSubmit)="submitComplaint()" class="complaint-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="issue">Issue Category</label>
                  <select id="issue" [(ngModel)]="newComplaint.issue" name="issue" required>
                    <option value="">Select Issue Category</option>
                    <option value="Academic">Academic Issues</option>
                    <option value="Infrastructure">Infrastructure Problems</option>
                    <option value="Hostel">Hostel Related</option>
                    <option value="Library">Library Services</option>
                    <option value="Lab">Lab Equipment</option>
                    <option value="Transport">Transport Services</option>
                    <option value="Canteen">Canteen/Food</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="priority">Priority Level</label>
                  <select id="priority" [(ngModel)]="newComplaint.priority" name="priority" required>
                    <option value="">Select Priority</option>
                    <option value="low">Low - Can wait</option>
                    <option value="medium">Medium - Needs attention</option>
                    <option value="high">High - Urgent</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="description">Complaint Description</label>
                <textarea
                  id="description"
                  [(ngModel)]="newComplaint.description"
                  name="description"
                  rows="6"
                  placeholder="Describe your complaint in detail..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="submit-btn" [disabled]="loading()">
                @if (loading()) {
                  <span class="spinner"></span>
                  Submitting...
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Complaint
                }
              </button>
            </form>
          </div>
        } @else {
          <div class="history-section">
            <div class="filter-bar">
              <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select [(ngModel)]="priorityFilter" (ngModelChange)="applyFilters()">
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            @if (loading()) {
              <div class="loading-state">
                <div class="spinner large"></div>
                <p>Loading complaints...</p>
              </div>
            } @else if (filteredComplaints().length === 0) {
              <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <h3>No complaints found</h3>
                <p>You haven't submitted any complaints yet.</p>
                <button class="btn-primary" (click)="activeTab.set('submit')">Submit Your First Complaint</button>
              </div>
            } @else {
              <div class="complaints-grid">
                @for (complaint of filteredComplaints(); track complaint._id) {
                  <div class="complaint-card" [class]="'priority-' + complaint.priority">
                    <div class="card-header">
                      <span class="issue-badge">{{ complaint.issue }}</span>
                      <span class="status-badge" [class]="'status-' + complaint.status">
                        {{ complaint.status }}
                      </span>
                    </div>
                    <p class="complaint-description">{{ complaint.description }}</p>
                    <div class="card-meta">
                      <span class="priority-badge" [class]="'priority-' + complaint.priority">
                        {{ complaint.priority }} priority
                      </span>
                      <span class="date">{{ complaint.createdAt | date:'medium' }}</span>
                    </div>
                    @if (complaint.response) {
                      <div class="response-section">
                        <h4>Faculty Response:</h4>
                        <p>{{ complaint.response }}</p>
                        @if (complaint.facultyId) {
                          <span class="responded-by">- {{ complaint.facultyId.username }}</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      background: #f5f7fa;
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1a237e 0%, #0d47a1 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
    }

    .sidebar-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .university-logo {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #ffc107, #ff9800);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: #1a237e;
    }

    .university-name h3 {
      font-size: 1.1rem;
      margin: 0;
    }

    .university-name p {
      font-size: 0.8rem;
      opacity: 0.7;
      margin: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
    }

    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.95rem;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.3s ease;
      margin-bottom: 8px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .user-avatar {
      width: 42px;
      height: 42px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
    }

    .user-role {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      padding: 32px;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .content-header h1 {
      font-size: 1.8rem;
      color: #1a1a2e;
    }

    .header-stats {
      display: flex;
      gap: 16px;
    }

    .stat-item {
      background: white;
      padding: 16px 24px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
    }

    .stat-item.pending .stat-value {
      color: #f57c00;
    }

    .stat-item.resolved .stat-value {
      color: #2e7d32;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    .submit-section {
      max-width: 800px;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .alert-success {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    .complaint-form {
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #1a1a2e;
    }

    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 35, 126, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .history-section {
      width: 100%;
    }

    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .filter-bar select {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
    }

    .empty-state svg {
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }

    .btn-primary {
      display: inline-flex;
      padding: 12px 24px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .complaints-grid {
      display: grid;
      gap: 20px;
    }

    .complaint-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border-left: 4px solid #1a237e;
      transition: all 0.3s ease;
    }

    .complaint-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .complaint-card.priority-high {
      border-left-color: #c62828;
    }

    .complaint-card.priority-medium {
      border-left-color: #f57c00;
    }

    .complaint-card.priority-low {
      border-left-color: #1565c0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .issue-badge {
      background: #e3f2fd;
      color: #1565c0;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: #fff3e0;
      color: #e65100;
    }

    .status-in-progress {
      background: #e3f2fd;
      color: #1565c0;
    }

    .status-resolved {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .complaint-description {
      color: #444;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .priority-badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .priority-badge.priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-badge.priority-medium {
      background: #fff8e1;
      color: #f57c00;
    }

    .priority-badge.priority-low {
      background: #e3f2fd;
      color: #1565c0;
    }

    .date {
      font-size: 0.85rem;
      color: #999;
    }

    .response-section {
      margin-top: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .response-section h4 {
      color: #2e7d32;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .response-section p {
      color: #444;
      margin-bottom: 8px;
    }

    .responded-by {
      font-size: 0.85rem;
      color: #666;
      font-style: italic;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner.large {
      width: 40px;
      height: 40px;
      border-color: #e0e0e0;
      border-top-color: #1a237e;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 80px;
      }

      .sidebar-header,
      .user-details,
      .logout-btn span,
      .nav-item span:not(svg) {
        display: none;
      }

      .university-name,
      .nav-item {
        justify-content: center;
      }

      .main-content {
        margin-left: 80px;
      }

      .content-header {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .header-stats {
        flex-wrap: wrap;
      }

      .filter-bar {
        flex-direction: column;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  activeTab = signal<'submit' | 'history'>('submit');
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  statusFilter = 'all';
  priorityFilter = 'all';

  newComplaint = {
    issue: '',
    priority: '',
    description: ''
  };

  private complaints = signal<Complaint[]>([]);

  user = computed(() => this.authService.currentUser());
  
  totalComplaints = computed(() => this.complaints().length);
  pendingCount = computed(() => this.complaints().filter(c => c.status === 'pending').length);
  resolvedCount = computed(() => this.complaints().filter(c => c.status === 'resolved').length);

  filteredComplaints = computed(() => {
    let result = this.complaints();
    
    if (this.statusFilter !== 'all') {
      result = result.filter(c => c.status === this.statusFilter);
    }
    
    if (this.priorityFilter !== 'all') {
      result = result.filter(c => c.priority === this.priorityFilter);
    }
    
    return result;
  });

  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  getUserInitials(): string {
    const user = this.user();
    if (!user) return '?';
    return user.username.slice(0, 2).toUpperCase();
  }

  loadComplaints(): void {
    this.loading.set(true);
    this.complaintService.getMyComplaints().subscribe({
      next: (data) => {
        this.complaints.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
        this.loading.set(false);
      }
    });
  }

  submitComplaint(): void {
    if (!this.newComplaint.issue || !this.newComplaint.priority || !this.newComplaint.description) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.complaintService.submitComplaint(this.newComplaint).subscribe({
      next: (complaint) => {
        this.complaints.update(list => [complaint, ...list]);
        this.successMessage.set('Complaint submitted successfully!');
        this.newComplaint = { issue: '', priority: '', description: '' };
        this.loading.set(false);
        
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to submit complaint');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    // Filters are computed automatically via the filteredComplaints computed signal
  }

  logout(): void {
    this.authService.logout();
  }
}
