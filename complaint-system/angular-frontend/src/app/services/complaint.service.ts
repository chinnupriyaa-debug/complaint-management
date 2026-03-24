import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, interval, switchMap } from 'rxjs';

export interface Complaint {
  _id: string;
  studentId: {
    _id: string;
    username: string;
    email: string;
  };
  issue: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  response?: string;
  facultyId?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ComplaintStats {
  total: number;
  pending: number;
  resolved: number;
  byPriority: { _id: string; count: number }[];
  byIssue: { _id: string; count: number }[];
  averageResolutionTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private readonly API_URL = 'http://localhost:5000/api/complaints';

  // Signals for reactive state
  private complaintsSignal = signal<Complaint[]>([]);
  private loadingSignal = signal<boolean>(false);
  private statsSignal = signal<ComplaintStats | null>(null);

  // Computed signals
  complaints = computed(() => this.complaintsSignal());
  loading = computed(() => this.loadingSignal());
  stats = computed(() => this.statsSignal());

  pendingComplaints = computed(() => 
    this.complaintsSignal().filter(c => c.status === 'pending')
  );

  resolvedComplaints = computed(() => 
    this.complaintsSignal().filter(c => c.status === 'resolved')
  );

  constructor(private http: HttpClient) {}

  // Student Methods
  submitComplaint(data: {
    issue: string;
    priority: string;
    description: string;
  }): Observable<Complaint> {
    this.loadingSignal.set(true);
    return this.http.post<Complaint>(`${this.API_URL}/submit`, data).pipe(
      tap(complaint => {
        const current = this.complaintsSignal();
        this.complaintsSignal.set([complaint, ...current]);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  getMyComplaints(): Observable<Complaint[]> {
    this.loadingSignal.set(true);
    return this.http.get<Complaint[]>(`${this.API_URL}/my-complaints`).pipe(
      tap(complaints => {
        this.complaintsSignal.set(complaints);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  // Faculty Methods
  getAllComplaints(): Observable<Complaint[]> {
    this.loadingSignal.set(true);
    return this.http.get<Complaint[]>(`${this.API_URL}/all`).pipe(
      tap(complaints => {
        this.complaintsSignal.set(complaints);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  respondToComplaint(complaintId: string, response: string, status: string): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.API_URL}/respond/${complaintId}`, {
      response,
      status
    }).pipe(
      tap(updatedComplaint => {
        const current = this.complaintsSignal();
        const index = current.findIndex(c => c._id === complaintId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedComplaint;
          this.complaintsSignal.set(updated);
        }
      })
    );
  }

  getComplaintStats(): Observable<ComplaintStats> {
    return this.http.get<ComplaintStats>(`${this.API_URL}/stats`).pipe(
      tap(stats => this.statsSignal.set(stats))
    );
  }

  // Real-time polling for new complaints (faculty)
  startPolling(intervalMs: number = 5000): Observable<Complaint[]> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getAllComplaints())
    );
  }

  // Get pending complaints that need urgent attention
  getUrgentComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.API_URL}/urgent`);
  }

  // Check for overdue complaints
  checkOverdueComplaints(): Observable<any> {
    return this.http.get(`${this.API_URL}/check-overdue`);
  }
}
