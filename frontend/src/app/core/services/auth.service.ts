import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, ApiRequest } from '../../shared/models/api-response.model';
import { LoginRequest, LoginResponse, User } from '../../shared/models/user.model';
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
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Only access localStorage in the browser
    const storedUser = this.isBrowser ? localStorage.getItem(this.userKey) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  get isAuthenticated(): boolean {
    const token = this.token;
    if (!token || !this.currentUserValue) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      
      return expiry < now;
    } catch (e) {
      return true;
    }
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
    if (!this.isBrowser) return;
    
    if (userData.token) {
      localStorage.setItem(this.tokenKey, userData.token);
      
      const { password, token, ...userWithoutSensitiveData } = userData;
      localStorage.setItem(this.userKey, JSON.stringify(userWithoutSensitiveData));
      
      this.currentUserSubject.next(userWithoutSensitiveData as User);
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshUserData(userData: User): void {
    if (!this.isBrowser) return;
    
    const { password, ...userWithoutPassword } = userData;
    localStorage.setItem(this.userKey, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);
  }
}