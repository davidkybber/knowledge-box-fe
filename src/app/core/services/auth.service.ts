import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserSignupRequest, UserSignupResponse, LoginRequest, LoginResponse, UserDto } from '../models/auth.models';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.authUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  signup(request: UserSignupRequest): Observable<UserSignupResponse> {
    return this.http.post<UserSignupResponse>(`${this.baseUrl}/Auth/signup`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, request)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setToken(response.token);
            if (response.user) {
              this.setCurrentUser(response.user);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  logoutWithTimeout(): void {
    this.logout();
    this.notificationService.showSessionTimeout();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): UserDto | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.logoutWithTimeout();
      return false;
    }
    
    return true;
  }

  isTokenExpired(token?: string): boolean {
    const currentToken = token || this.getToken();
    if (!currentToken) {
      return true;
    }

    try {
      const payload = this.decodeJWTPayload(currentToken);
      if (!payload || !payload.exp) {
        return true;
      }

      // JWT exp is in seconds, Date.now() returns milliseconds
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      return isExpired;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return true;
    }
  }

  checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      this.logoutWithTimeout();
    }
  }

  private decodeJWTPayload(token: string): any {
    try {
      // JWT structure: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token structure');
      }

      const payload = parts[1];
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
      
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Failed to decode JWT payload');
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setCurrentUser(user: UserDto): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
} 