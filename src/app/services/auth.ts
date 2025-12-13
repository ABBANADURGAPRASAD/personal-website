import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly platformId = inject(PLATFORM_ID);
  
  // Using signals for reactive state
  private isAuthenticatedSignal = signal<boolean>(false);
  public readonly isAuthenticated$ = this.isAuthenticatedSignal.asReadonly();

  constructor() {
    // Check for existing token on service initialization (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticatedSignal.set(this.checkAuthStatus());
    }
  }

  /**
   * Login method - ready for backend integration
   * In production, this should call an HTTP service
   */
  login(username: string, password: string): Observable<boolean> {
    // TODO: Replace with actual HTTP call to backend
    // return this.http.post<AuthResponse>('/api/auth/login', { username, password })
    //   .pipe(
    //     tap(response => this.setAuthToken(response.token, response.user)),
    //     map(() => true),
    //     catchError(() => of(false))
    //   );

    // Temporary mock implementation
    if (username === 'admin' && password === 'admin123') {
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser = { username, role: 'admin' };
      this.setAuthToken(mockToken, mockUser);
      return of(true);
    }
    return of(false);
  }

  /**
   * Logout method - clears token and redirects
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      } catch (e) {
        console.error('Error during logout:', e);
      }
    }
    this.isAuthenticatedSignal.set(false);
    // Router navigation will be handled by the component calling logout
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  /**
   * Get current auth token (for API calls)
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(this.TOKEN_KEY);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Get current user info
   */
  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Set authentication token and user info
   */
  private setAuthToken(token: string, user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Error storing auth token:', e);
      }
    }
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Check authentication status from localStorage
   */
  private checkAuthStatus(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
          // TODO: Validate token expiration with backend
          // For now, just check if token exists
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Validate token with backend (for future use)
   */
  validateToken(): Observable<boolean> {
    // TODO: Implement token validation API call
    // return this.http.get<boolean>('/api/auth/validate')
    //   .pipe(
    //     tap(valid => {
    //       if (!valid) this.logout();
    //       this.isAuthenticatedSignal.set(valid);
    //     }),
    //     catchError(() => {
    //       this.logout();
    //       return of(false);
    //     })
    //   );
    return of(this.checkAuthStatus());
  }
}
