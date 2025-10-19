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

export interface GetProductsListRequest {
  productId?: number;
  categoryIds?: string;
  brandIds?: string;
  productCode?: string;
  productName?: string;
  returnableItem?: number;
  productStatusIds?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  includeProductItems?: boolean;
  includeTotalRowsLength?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/SMProduct`;

  constructor(private http: HttpClient) {}

  getProductsList(params: GetProductsListRequest = {}): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetProductsList',
      reqObject: {
        itemsPerPage: params.itemsPerPage || 100,
        pageNumber: params.pageNumber || 0,
        productStatusIds: params.productStatusIds || '1',
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

  getProductDetails(productId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetProductDetails',
      reqObject: { productId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  saveProduct(productData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'SaveProductDetails',
      reqObject: productData
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'DeleteProduct',
      reqObject: { productId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
}