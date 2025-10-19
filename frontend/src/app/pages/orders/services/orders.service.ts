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
export class OrdersService {
  private readonly apiUrl = `${environment.apiUrl}/SMOrderItem`;

  constructor(private http: HttpClient) {}

  getOrderItemsList(params: any = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetOrderItemsList',
      reqObject: {
        itemsPerPage: params.itemsPerPage || 50,
        pageNumber: params.pageNumber || 0,
        groupBy: params.groupBy || 'OrderId',
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

  saveOrderItem(orderData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'SaveOrderItemDetails',
      reqObject: orderData
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  deleteOrderItem(orderId : number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'DeleteOrderItem',
      reqObject: { orderId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
}