import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiRequest } from '../models/api-response.model';
import { User } from '../models/user.model';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsersList(filters?: any): Observable<ApiResponse<User[]>> {
    const request: ApiRequest = {
      ReqType: 'GetUsersList',
      ReqObject: {
        userId: -1,
        userStatus: -1,
        userType: -1,
        fullName: '',
        userName: '',
        phoneNumber: '',
        mobileNumber: '',
        city: '',
        ItemsPerPage: 30,
        PageNumber: 0,
        ...filters
      }
    };

    return this.http.post<ApiResponse<User[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.USER.GET_LIST}`,
      request
    );
  }

  getUserDetails(userId: number): Observable<ApiResponse<User>> {
    const request: ApiRequest = {
      ReqType: 'GetUserDetails',
      ReqObject: { UserId: userId }
    };

    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}${API_ENDPOINTS.USER.GET_DETAILS}`,
      request
    );
  }

  saveUser(user: User): Observable<ApiResponse<User>> {
    const request: ApiRequest = {
      ReqType: 'SaveUserDetails',
      ReqObject: user
    };

    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}${API_ENDPOINTS.USER.SAVE}`,
      request
    );
  }

  deleteUser(userId: number): Observable<ApiResponse<any>> {
    const request: ApiRequest = {
      ReqType: 'DeleteUser',
      ReqObject: { UserId: userId }
    };

    return this.http.post<ApiResponse<any>>(
      `${environment.apiUrl}${API_ENDPOINTS.USER.DELETE}`,
      request
    );
  }
}