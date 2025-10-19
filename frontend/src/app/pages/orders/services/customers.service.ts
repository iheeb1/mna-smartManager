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

export interface GetCustomersListRequest {
  customerIds?: string;
  customerName?: string;
  customerIdz?: string;
  phoneNumber?: string;
  customerStatusIds?: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  includeTotalRowsLength?: boolean;
  groupBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly apiUrl = `${environment.apiUrl}/SMCustomer`;

  constructor(private http: HttpClient) {}

  getCustomersList(params: GetCustomersListRequest = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomersList',
      ReqObject: {
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
      ReqType: 'GetCustomerDetails',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getCustomerAddresses(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomerAddresses',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getCustomerCars(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomerCars',
      ReqObject: { 
        CustomerId: customerId 
      }
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
      ReqType: 'SaveCustomerDetails',
      ReqObject: customerData
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
      ReqType: 'DeleteCustomer',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
} 