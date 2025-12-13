import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  // Using signals for reactive state
  private isAuthenticatedSignal = signal<boolean>(this.checkAuthStatus());
  public readonly isAuthenticated$ = this.isAuthenticatedSignal.asReadonly();

  constructor(private router: Router) {
    // Check for existing token on service initialization
    this.checkAuthStatus();
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
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/']);
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
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user info
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Set authentication token and user info
   */
  private setAuthToken(token: string, user: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Check authentication status from localStorage
   */
  private checkAuthStatus(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // TODO: Validate token expiration with backend
      // For now, just check if token exists
      return true;
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
