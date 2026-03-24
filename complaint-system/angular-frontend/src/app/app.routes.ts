import { Routes } from '@angular/router';
import { authGuard, studentGuard, facultyGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'student-login',
    loadComponent: () => import('./pages/student-login/student-login.component').then(m => m.StudentLoginComponent)
  },
  {
    path: 'faculty-login',
    loadComponent: () => import('./pages/faculty-login/faculty-login.component').then(m => m.FacultyLoginComponent)
  },
  {
    path: 'student-dashboard',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [authGuard, studentGuard]
  },
  {
    path: 'faculty-dashboard',
    loadComponent: () => import('./pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent),
    canActivate: [authGuard, facultyGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
