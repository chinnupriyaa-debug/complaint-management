import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'faculty';
  department?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  
  // Using Angular Signals for reactive state management
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals
  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUser = computed(() => this.userSignal());
  userRole = computed(() => this.userSignal()?.role || null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.tokenSignal.set(token);
        this.userSignal.set(user);
      } catch (e) {
        this.clearAuth();
      }
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  login(username: string, password: string, role: 'student' | 'faculty'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, {
      username,
      password,
      role
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
    role: 'student' | 'faculty';
    department?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.user);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }

  getCurrentUser(): User | null {
    return this.userSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      await this.http.get(`${this.API_URL}/verify`).toPromise();
      return true;
    } catch {
      return false;
    }
  }
}
