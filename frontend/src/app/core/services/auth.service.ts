import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, ApiRequest } from '../models/api-response.model';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenKey = 'smart_auth_token';
  private userKey = 'smart_user_data';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUserValue;
  }

  login(username: string, password: string): Observable<ApiResponse<LoginResponse>> {
    const request: ApiRequest = {
      ReqType: 'CheckUserLogin',
      ReqObject: {
        UserName: username,
        Password: password
      }
    };

    return this.http.post<ApiResponse<LoginResponse>>(
      `${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      request
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  private setSession(userData: LoginResponse): void {
    if (userData.token) {
      localStorage.setItem(this.tokenKey, userData.token);
      
      // Don't store password
      const { password, token, ...userWithoutSensitiveData } = userData;
      localStorage.setItem(this.userKey, JSON.stringify(userWithoutSensitiveData));
      
      this.currentUserSubject.next(userWithoutSensitiveData as User);
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshUserData(userData: User): void {
    const { password, ...userWithoutPassword } = userData;
    localStorage.setItem(this.userKey, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);
  }
}