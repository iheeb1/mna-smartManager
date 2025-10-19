import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ApiResponse<T = any> {
  result: boolean;
  code: number;
  message: string;
  result_data?: T;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly apiUrl = `${environment.apiUrl}/SMCustomer`;

  constructor(private http: HttpClient) {}

  getCustomersList(params: any = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetCustomersList',
      reqObject: {
        itemsPerPage: params.itemsPerPage || 100,
        pageNumber: params.pageNumber || 0,
        customerStatusIds: params.customerStatusIds || '1',
        includeTotalRowsLength: true,
        ...params
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getCustomerDetails(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetCustomerDetails',
      reqObject: { customerId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  saveCustomer(customerData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'SaveCustomerDetails',
      reqObject: customerData
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'DeleteCustomer',
      reqObject: { customerId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
}