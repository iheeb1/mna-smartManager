import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ApiResponse<T = any> {
  result?: boolean;
  code?: number;
  message?: string;
  result_data?: T;
  errorMessage?: string;
  // Direct response format (capital letters)
  TotalLength?: number;
  RowsList?: any[];
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
      map(response => {
        // Handle both response formats
        const rowsList = response.RowsList || response.result_data?.rowsList || response.result_data?.RowsList || [];
        const totalLength = response.TotalLength || response.result_data?.totalLength || response.result_data?.TotalLength || 0;
        
        return {
          success: response.result !== false,
          data: {
            rowsList: rowsList,
            totalLength: totalLength
          },
          message: response.message || 'Success'
        };
      })
    );
  }

  getCustomerDetails(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomerDetails',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => {
        // Handle different response formats
        let customerData = null;
        
        // Check if data is in RowsList (capital R)
        if (response.RowsList && response.RowsList.length > 0) {
          customerData = response.RowsList[0];
        }
        // Check if data is in result_data.RowsList
        else if (response.result_data?.RowsList && response.result_data.RowsList.length > 0) {
          customerData = response.result_data.RowsList[0];
        }
        // Check if data is in result_data directly
        else if (response.result_data) {
          customerData = response.result_data;
        }
        // Last resort: use response itself
        else {
          customerData = response;
        }
        
        return {
          success: response.result !== false && customerData !== null,
          data: customerData,
          message: response.message || 'Success'
        };
      })
    );
  }

  getCustomerAddresses(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomerAddresses',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => {
        const addresses = response.RowsList || response.result_data?.rowsList || 
                         response.result_data?.RowsList || [];
        
        return {
          success: response.result !== false,
          data: addresses,
          message: response.message || 'Success'
        };
      })
    );
  }

  getCustomerCars(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'GetCustomerCars',
      ReqObject: { 
        CustomerId: customerId 
      }
    }).pipe(
      map(response => {
        const cars = response.RowsList || response.result_data?.rowsList || 
                    response.result_data?.RowsList || [];
        
        return {
          success: response.result !== false,
          data: cars,
          message: response.message || 'Success'
        };
      })
    );
  }

  saveCustomer(customerData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      ReqType: 'SaveCustomerDetails',
      ReqObject: customerData
    }).pipe(
      map(response => ({
        success: response.result !== false,
        data: response.result_data || response.RowsList?.[0],
        message: response.message || 'Success'
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
        success: response.result !== false,
        data: response.result_data,
        message: response.message || 'Success'
      }))
    );
  }
}