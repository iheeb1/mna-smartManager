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

export interface GetLookupsRequest {
  lookUpId?: number;
  lookUpTableName?: string;
  lookUpStatusId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  private readonly apiUrl = `${environment.apiUrl}/SMLookUp`;

  constructor(private http: HttpClient) {}

  getLookupsList(params: GetLookupsRequest = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetLookUpsList',
      reqObject: params
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getLookupsByTable(tableName: string, statusId: number = 1): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetLookUpsByTable',
      reqObject: {
        lookUpTableName: tableName,
        lookUpStatusId: statusId
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getOrderTypes(): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetOrderTypes',
      reqObject: {}
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getTaxRate(): Observable<number> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetTaxRate',
      reqObject: {}
    }).pipe(
      map(response => {
        if (response.result && response.result_data?.taxRate) {
          return response.result_data.taxRate;
        }
        return 0.17;
      })
    );
  }

  getLookupDetails(lookUpId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetLookUpDetails',
      reqObject: { lookUpId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  saveLookup(lookupData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'SaveLookUpDetails',
      reqObject: lookupData
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  deleteLookup(lookUpId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'DeleteLookUp',
      reqObject: { lookUpId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
}