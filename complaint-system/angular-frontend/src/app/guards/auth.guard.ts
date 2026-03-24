import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ROUTE GUARDS - Angular Feature
 * 
 * Route guards are used to control access to routes based on certain conditions.
 * They implement CanActivateFn interface and return boolean or UrlTree.
 * 
 * Types of Route Guards:
 * 1. CanActivate - Decides if a route can be activated
 * 2. CanActivateChild - Decides if child routes can be activated
 * 3. CanDeactivate - Decides if a route can be deactivated
 * 4. CanLoad - Decides if a lazy-loaded module can be loaded
 * 5. Resolve - Pre-fetches data before route activation
 */

// Main authentication guard - checks if user is logged in
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[Route Guard] Checking authentication...');

  if (authService.isAuthenticated()) {
    console.log('[Route Guard] User is authenticated');
    return true;
  }

  console.log('[Route Guard] User not authenticated, redirecting to home');
  router.navigate(['/']);
  return false;
};

// Student role guard - ensures only students can access student routes
export const studentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[Route Guard] Checking student role...');

  const user = authService.getCurrentUser();
  
  if (user && user.role === 'student') {
    console.log('[Route Guard] User is a student, access granted');
    return true;
  }

  console.log('[Route Guard] User is not a student, redirecting');
  router.navigate(['/']);
  return false;
};

// Faculty role guard - ensures only faculty can access faculty routes
export const facultyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[Route Guard] Checking faculty role...');

  const user = authService.getCurrentUser();
  
  if (user && user.role === 'faculty') {
    console.log('[Route Guard] User is faculty, access granted');
    return true;
  }

  console.log('[Route Guard] User is not faculty, redirecting');
  router.navigate(['/']);
  return false;
};

// Additional guard example - checks if user has completed profile
export const profileCompleteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  
  if (user && user.email) {
    return true;
  }

  // Could redirect to profile completion page
  router.navigate(['/complete-profile']);
  return false;
};

// Guard with async check (example for API verification)
export const tokenValidGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isValid = await authService.verifyToken();
    if (isValid) {
      return true;
    }
  } catch (error) {
    console.error('[Route Guard] Token verification failed', error);
  }

  authService.logout();
  router.navigate(['/']);
  return false;
};
