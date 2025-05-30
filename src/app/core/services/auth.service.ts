import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSignupRequest, UserSignupResponse, LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://knowledge-box-auth-service.lemonhill-9a1917eb.westeurope.azurecontainerapps.io';

  constructor(private http: HttpClient) {}

  signup(request: UserSignupRequest): Observable<UserSignupResponse> {
    return this.http.post<UserSignupResponse>(`${this.baseUrl}/Auth/signup`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, request);
  }
} 