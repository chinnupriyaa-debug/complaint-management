import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ComplaintService, Complaint, ComplaintStats } from '../../services/complaint.service';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar faculty">
        <div class="sidebar-header">
          <div class="university-logo">AU</div>
          <div class="university-name">
            <h3>Anna University</h3>
            <p>Faculty Portal</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button 
            class="nav-item"
            [class.active]="activeTab() === 'pending'"
            (click)="activeTab.set('pending')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Pending Complaints
            @if (pendingCount() > 0) {
              <span class="badge">{{ pendingCount() }}</span>
            }
          </button>
          <button 
            class="nav-item"
            [class.active]="activeTab() === 'resolved'"
            (click)="activeTab.set('resolved')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Resolved
          </button>
          <button 
            class="nav-item"
            [class.active]="activeTab() === 'stats'"
            (click)="activeTab.set('stats')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Statistics
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar faculty">{{ getUserInitials() }}</div>
            <div class="user-details">
              <span class="user-name">{{ user()?.username }}</span>
              <span class="user-role">Faculty</span>
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
          <div class="header-left">
            <h1>{{ getTabTitle() }}</h1>
            <p class="header-subtitle">Manage and respond to student complaints</p>
          </div>
          <div class="header-stats">
            <div class="stat-item total">
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

        @if (activeTab() === 'pending' || activeTab() === 'resolved') {
          <div class="complaints-section">
            <div class="filter-bar">
              <div class="search-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm"
                  placeholder="Search by student name or description..."
                  (input)="applyFilters()"
                >
              </div>
              <select [(ngModel)]="priorityFilter" (ngModelChange)="applyFilters()">
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select [(ngModel)]="issueFilter" (ngModelChange)="applyFilters()">
                <option value="all">All Issues</option>
                <option value="Academic">Academic</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Hostel">Hostel</option>
                <option value="Library">Library</option>
                <option value="Lab">Lab</option>
                <option value="Transport">Transport</option>
                <option value="Canteen">Canteen</option>
                <option value="Other">Other</option>
              </select>
            </div>

            @if (loading()) {
              <div class="loading-state">
                <div class="spinner large"></div>
                <p>Loading complaints...</p>
              </div>
            } @else if (getDisplayedComplaints().length === 0) {
              <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>{{ activeTab() === 'pending' ? 'No pending complaints' : 'No resolved complaints' }}</h3>
                <p>{{ activeTab() === 'pending' ? 'All complaints have been addressed!' : 'Resolved complaints will appear here.' }}</p>
              </div>
            } @else {
              <div class="complaints-table-container">
                <table class="complaints-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Issue</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (complaint of getDisplayedComplaints(); track complaint._id) {
                      <tr [class]="'priority-row-' + complaint.priority">
                        <td>
                          <div class="student-info">
                            <div class="student-avatar">{{ getStudentInitials(complaint) }}</div>
                            <div>
                              <span class="student-name">{{ complaint.studentId?.username || 'Unknown' }}</span>
                              <span class="student-email">{{ complaint.studentId?.email || '' }}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="issue-badge">{{ complaint.issue }}</span>
                        </td>
                        <td class="description-cell">
                          <p>{{ complaint.description | slice:0:100 }}{{ complaint.description.length > 100 ? '...' : '' }}</p>
                        </td>
                        <td>
                          <span class="priority-badge" [class]="'priority-' + complaint.priority">
                            {{ complaint.priority }}
                          </span>
                        </td>
                        <td class="date-cell">
                          {{ complaint.createdAt | date:'short' }}
                        </td>
                        <td>
                          @if (complaint.status === 'pending' || complaint.status === 'in-progress') {
                            <button class="respond-btn" (click)="openResponseModal(complaint)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                              </svg>
                              Respond
                            </button>
                          } @else {
                            <button class="view-btn" (click)="openResponseModal(complaint)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                              View
                            </button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }

        @if (activeTab() === 'stats') {
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats()?.total || 0 }}</span>
                  <span class="stat-title">Total Complaints</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon orange">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats()?.pending || 0 }}</span>
                  <span class="stat-title">Pending</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ stats()?.resolved || 0 }}</span>
                  <span class="stat-title">Resolved</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ formatTime(stats()?.averageResolutionTime || 0) }}</span>
                  <span class="stat-title">Avg Resolution Time</span>
                </div>
              </div>
            </div>

            <div class="charts-row">
              <div class="chart-card">
                <h3>Complaints by Priority</h3>
                <div class="priority-bars">
                  @for (item of stats()?.byPriority || []; track item._id) {
                    <div class="bar-item">
                      <span class="bar-label">{{ item._id | titlecase }}</span>
                      <div class="bar-container">
                        <div 
                          class="bar-fill"
                          [class]="'priority-' + item._id"
                          [style.width.%]="getPercentage(item.count)"
                        ></div>
                      </div>
                      <span class="bar-value">{{ item.count }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="chart-card">
                <h3>Complaints by Issue</h3>
                <div class="issue-list">
                  @for (item of stats()?.byIssue || []; track item._id) {
                    <div class="issue-item">
                      <span class="issue-name">{{ item._id }}</span>
                      <div class="issue-bar-container">
                        <div 
                          class="issue-bar-fill"
                          [style.width.%]="getPercentage(item.count)"
                        ></div>
                      </div>
                      <span class="issue-count">{{ item.count }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Response Modal -->
        @if (showModal()) {
          <div class="modal-overlay" (click)="closeModal()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <button class="modal-close" (click)="closeModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              @if (selectedComplaint()) {
                <div class="modal-header">
                  <h2>Complaint Details</h2>
                  <span class="status-badge" [class]="'status-' + selectedComplaint()!.status">
                    {{ selectedComplaint()!.status }}
                  </span>
                </div>

                <div class="modal-body">
                  <div class="complaint-details">
                    <div class="detail-row">
                      <strong>Student:</strong>
                      <span>{{ selectedComplaint()!.studentId?.username || 'Unknown' }}</span>
                    </div>
                    <div class="detail-row">
                      <strong>Email:</strong>
                      <span>{{ selectedComplaint()!.studentId?.email || 'N/A' }}</span>
                    </div>
                    <div class="detail-row">
                      <strong>Issue:</strong>
                      <span class="issue-badge">{{ selectedComplaint()!.issue }}</span>
                    </div>
                    <div class="detail-row">
                      <strong>Priority:</strong>
                      <span class="priority-badge" [class]="'priority-' + selectedComplaint()!.priority">
                        {{ selectedComplaint()!.priority }}
                      </span>
                    </div>
                    <div class="detail-row">
                      <strong>Submitted:</strong>
                      <span>{{ selectedComplaint()!.createdAt | date:'medium' }}</span>
                    </div>
                  </div>

                  <div class="description-box">
                    <strong>Description:</strong>
                    <p>{{ selectedComplaint()!.description }}</p>
                  </div>

                  @if (selectedComplaint()!.status !== 'resolved') {
                    <div class="response-form">
                      <div class="form-group">
                        <label for="response">Your Response</label>
                        <textarea
                          id="response"
                          [(ngModel)]="responseText"
                          rows="4"
                          placeholder="Enter your response to the student..."
                        ></textarea>
                      </div>

                      <div class="form-group">
                        <label for="status">Update Status</label>
                        <select id="status" [(ngModel)]="responseStatus">
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>

                      <button 
                        class="submit-response-btn" 
                        (click)="submitResponse()"
                        [disabled]="respondLoading()"
                      >
                        @if (respondLoading()) {
                          <span class="spinner"></span>
                          Submitting...
                        } @else {
                          Submit Response
                        }
                      </button>
                    </div>
                  } @else {
                    <div class="existing-response">
                      <strong>Faculty Response:</strong>
                      <p>{{ selectedComplaint()!.response }}</p>
                      @if (selectedComplaint()!.resolvedAt) {
                        <span class="resolved-date">Resolved on {{ selectedComplaint()!.resolvedAt | date:'medium' }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
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
      background: linear-gradient(180deg, #b71c1c 0%, #c62828 100%);
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
      color: #b71c1c;
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
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .nav-item .badge {
      position: absolute;
      right: 16px;
      background: #ffc107;
      color: #1a1a2e;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
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
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .header-left h1 {
      font-size: 1.8rem;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .header-subtitle {
      color: #666;
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
      color: #1a1a2e;
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

    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box svg {
      position: absolute;
      left: 14px;
      color: #999;
    }

    .search-box input {
      width: 100%;
      padding: 12px 16px 12px 46px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: #c62828;
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
      color: #2e7d32;
      margin-bottom: 20px;
    }

    .complaints-table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .complaints-table {
      width: 100%;
      border-collapse: collapse;
    }

    .complaints-table th {
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .complaints-table td {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }

    .complaints-table tr:hover {
      background: #fafafa;
    }

    .priority-row-high {
      border-left: 4px solid #c62828;
    }

    .priority-row-medium {
      border-left: 4px solid #f57c00;
    }

    .priority-row-low {
      border-left: 4px solid #1565c0;
    }

    .student-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .student-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .student-name {
      display: block;
      font-weight: 500;
      color: #1a1a2e;
    }

    .student-email {
      display: block;
      font-size: 0.8rem;
      color: #999;
    }

    .issue-badge {
      background: #e3f2fd;
      color: #1565c0;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .description-cell p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .priority-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
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

    .date-cell {
      color: #999;
      font-size: 0.9rem;
    }

    .respond-btn,
    .view-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .respond-btn {
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
    }

    .respond-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(198, 40, 40, 0.4);
    }

    .view-btn {
      background: #e0e0e0;
      color: #666;
    }

    .view-btn:hover {
      background: #d0d0d0;
    }

    /* Stats Section */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.blue { background: linear-gradient(135deg, #1565c0, #1e88e5); }
    .stat-icon.orange { background: linear-gradient(135deg, #ef6c00, #f57c00); }
    .stat-icon.green { background: linear-gradient(135deg, #2e7d32, #43a047); }
    .stat-icon.purple { background: linear-gradient(135deg, #7b1fa2, #9c27b0); }

    .stat-number {
      display: block;
      font-size: 1.8rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .stat-title {
      color: #666;
      font-size: 0.9rem;
    }

    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .chart-card h3 {
      margin-bottom: 20px;
      color: #1a1a2e;
    }

    .bar-item,
    .issue-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .bar-label,
    .issue-name {
      width: 80px;
      font-size: 0.9rem;
      color: #666;
    }

    .bar-container,
    .issue-bar-container {
      flex: 1;
      height: 12px;
      background: #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
    }

    .bar-fill,
    .issue-bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.5s ease;
    }

    .bar-fill.priority-high { background: linear-gradient(90deg, #c62828, #e53935); }
    .bar-fill.priority-medium { background: linear-gradient(90deg, #ef6c00, #f57c00); }
    .bar-fill.priority-low { background: linear-gradient(90deg, #1565c0, #1e88e5); }

    .issue-bar-fill {
      background: linear-gradient(90deg, #c62828, #e53935);
    }

    .bar-value,
    .issue-count {
      width: 40px;
      text-align: right;
      font-weight: 600;
      color: #1a1a2e;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: modalIn 0.3s ease;
    }

    @keyframes modalIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      padding: 0;
    }

    .modal-close:hover {
      color: #c62828;
    }

    .modal-header {
      padding: 24px 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      color: #1a1a2e;
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

    .modal-body {
      padding: 24px;
    }

    .complaint-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-row strong {
      color: #999;
      font-size: 0.85rem;
    }

    .description-box {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .description-box strong {
      display: block;
      margin-bottom: 8px;
      color: #666;
    }

    .description-box p {
      color: #1a1a2e;
      line-height: 1.6;
    }

    .response-form .form-group {
      margin-bottom: 20px;
    }

    .response-form label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #1a1a2e;
    }

    .response-form textarea,
    .response-form select {
      width: 100%;
      padding: 14px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .response-form textarea:focus,
    .response-form select:focus {
      outline: none;
      border-color: #c62828;
    }

    .submit-response-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #c62828, #e53935);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
    }

    .submit-response-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
    }

    .existing-response {
      background: #e8f5e9;
      padding: 20px;
      border-radius: 12px;
    }

    .existing-response strong {
      color: #2e7d32;
      display: block;
      margin-bottom: 8px;
    }

    .existing-response p {
      color: #1a1a2e;
      margin-bottom: 12px;
    }

    .resolved-date {
      font-size: 0.85rem;
      color: #666;
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
      border-top-color: #c62828;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 80px;
      }

      .sidebar-header .university-name,
      .user-details,
      .logout-btn span:not(:first-child),
      .nav-item span:not(svg):not(.badge) {
        display: none;
      }

      .nav-item {
        justify-content: center;
      }

      .nav-item .badge {
        position: static;
        margin-left: 0;
      }

      .main-content {
        margin-left: 80px;
      }

      .content-header {
        flex-direction: column;
        gap: 20px;
      }

      .charts-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FacultyDashboardComponent implements OnInit, OnDestroy {
  activeTab = signal<'pending' | 'resolved' | 'stats'>('pending');
  loading = signal(false);
  showModal = signal(false);
  selectedComplaint = signal<Complaint | null>(null);
  respondLoading = signal(false);
  
  searchTerm = '';
  priorityFilter = 'all';
  issueFilter = 'all';
  responseText = '';
  responseStatus = 'resolved';

  private complaints = signal<Complaint[]>([]);
  stats = signal<ComplaintStats | null>(null);
  
  private pollingSubscription?: Subscription;
  private alertCheckInterval?: any;

  user = computed(() => this.authService.currentUser());
  
  totalComplaints = computed(() => this.complaints().length);
  pendingCount = computed(() => this.complaints().filter(c => c.status === 'pending' || c.status === 'in-progress').length);
  resolvedCount = computed(() => this.complaints().filter(c => c.status === 'resolved').length);

  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
    this.loadStats();
    this.startAlertCheck();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
    }
  }

  getUserInitials(): string {
    const user = this.user();
    if (!user) return '?';
    return user.username.slice(0, 2).toUpperCase();
  }

  getTabTitle(): string {
    switch (this.activeTab()) {
      case 'pending': return 'Pending Complaints';
      case 'resolved': return 'Resolved Complaints';
      case 'stats': return 'Statistics & Analytics';
      default: return '';
    }
  }

  loadComplaints(): void {
    this.loading.set(true);
    this.complaintService.getAllComplaints().subscribe({
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

  loadStats(): void {
    this.complaintService.getComplaintStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  startAlertCheck(): void {
    // Check for overdue complaints every 10 seconds
    this.alertCheckInterval = setInterval(() => {
      this.complaintService.checkOverdueComplaints().subscribe({
        next: (response: any) => {
          if (response.alertsSent > 0) {
            console.log(`${response.alertsSent} alert(s) sent for overdue complaints`);
          }
        }
      });
    }, 10000);
  }

  getDisplayedComplaints(): Complaint[] {
    let result = this.complaints();
    
    // Filter by tab
    if (this.activeTab() === 'pending') {
      result = result.filter(c => c.status === 'pending' || c.status === 'in-progress');
    } else if (this.activeTab() === 'resolved') {
      result = result.filter(c => c.status === 'resolved');
    }
    
    // Apply search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c => 
        c.studentId?.username?.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    }
    
    // Apply priority filter
    if (this.priorityFilter !== 'all') {
      result = result.filter(c => c.priority === this.priorityFilter);
    }
    
    // Apply issue filter
    if (this.issueFilter !== 'all') {
      result = result.filter(c => c.issue === this.issueFilter);
    }
    
    return result;
  }

  applyFilters(): void {
    // Filters are applied in getDisplayedComplaints()
  }

  getStudentInitials(complaint: Complaint): string {
    if (!complaint.studentId?.username) return '?';
    return complaint.studentId.username.slice(0, 2).toUpperCase();
  }

  getPercentage(count: number): number {
    const total = this.stats()?.total || 1;
    return (count / total) * 100;
  }

  formatTime(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / 1440)}d`;
  }

  openResponseModal(complaint: Complaint): void {
    this.selectedComplaint.set(complaint);
    this.responseText = complaint.response || '';
    this.responseStatus = complaint.status === 'resolved' ? 'resolved' : 'in-progress';
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedComplaint.set(null);
    this.responseText = '';
  }

  submitResponse(): void {
    const complaint = this.selectedComplaint();
    if (!complaint || !this.responseText) return;

    this.respondLoading.set(true);

    this.complaintService.respondToComplaint(
      complaint._id,
      this.responseText,
      this.responseStatus
    ).subscribe({
      next: (updated) => {
        // Update local complaints array
        this.complaints.update(list => 
          list.map(c => c._id === updated._id ? updated : c)
        );
        this.respondLoading.set(false);
        this.closeModal();
        this.loadStats();
      },
      error: (err) => {
        console.error('Error submitting response:', err);
        this.respondLoading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
