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
  private readonly orderItemsApiUrl = `${environment.apiUrl}/SMOrderItem`;
  private readonly ordersApiUrl = `${environment.apiUrl}/SMOrder`;

  constructor(private http: HttpClient) {}

  /**
   * Get list of order items (grouped orders)
   */
  getOrderItemsList(params: any = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.orderItemsApiUrl, {
      reqType: 'GetOrderItemsList',
      reqObject: {
        itemsPerPage: params.itemsPerPage || 50,
        pageNumber: params.pageNumber || 0,
        groupBy: params.groupBy || 'OrderId',
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

  /**
   * Save order - Fixed to match backend expectations
   */
  saveOrderItem(orderData: any): Observable<any> {
    const items = orderData.items || [];
    const totalBeforeTax = items.reduce((sum: number, item: any) => sum + (item.totalBeforeTax || 0), 0);
    const totalTax = items.reduce((sum: number, item: any) => sum + (item.taxAmount || 0), 0);
    const totalWithTax = items.reduce((sum: number, item: any) => sum + (item.totalWithTax || 0), 0);

    // Transform to backend structure
    const transformedData = {
      orderId: orderData.orderId || 0,
      customerId: orderData.customerId,
      driverId: orderData.carId || null,
      locationAddress: orderData.addressLine1 || null,
      orderNotes: orderData.notes || null,
      contractNumber: orderData.contractNumber || null,
      orderDate: orderData.orderDate, // YYYY-MM-DD
      orderIncludeVat: orderData.includeVAT ? 1 : 0,
      orderTotalPriceWithOutVat: totalBeforeTax,
      orderTotalPriceVat: totalTax,
      orderTotalPriceWithVat: totalWithTax,
      orderStatusId: 1,
      
      // Order items array
      orderItems: items.map((item: any) => ({
        orderItemId: item.orderItemId || 0,
        orderTypeId: item.productId, // Map productId to orderTypeId
        orderUnitsNumber: item.quantity,
        orderPrice: item.price,
        orderVat: item.quantity > 0 ? item.taxAmount / item.quantity : 0,
        orderIncludeVat: orderData.includeVAT ? 1 : 0,
        orderTotalPriceWithOutVat: item.totalBeforeTax,
        orderTotalPriceVat: item.taxAmount,
        orderTotalPriceWithVat: item.totalWithTax,
        orderCost: item.price,
        orderTotalCost: item.totalWithTax,
        orderStatusId: 1
      }))
    };

    console.log('Transformed save request:', transformedData);

    return this.http.post<ApiResponse>(this.ordersApiUrl, {
      reqType: 'SaveOrderDetails',
      reqObject: transformedData
    }).pipe(
      map(response => {
        console.log('Save response:', response);
        return {
          success: response.result,
          data: response.result_data,
          message: response.message || (response.result ? 'تم حفظ الطلب بنجاح' : 'فشل حفظ الطلب')
        };
      })
    );
  }

  /**
   * Delete an order
   */
  deleteOrder(orderId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.ordersApiUrl, {
      reqType: 'DeleteOrder',
      reqObject: { 
        orderId: orderId
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  /**
   * Get order details with items
   */
  getOrderDetails(orderId: number, includeOrderItems: boolean = true): Observable<any> {
    return this.http.post<ApiResponse>(this.ordersApiUrl, {
      reqType: 'GetOrderDetails',
      reqObject: { 
        orderId: orderId,
        includeOrderItems: includeOrderItems 
      }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  /**
   * Format date to DD/MM/YYYY
   */
  private formatShortDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}