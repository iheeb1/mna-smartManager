import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) {}

  /**
   * Get Products List from SMProduct controller
   */
  getProducts(): Observable<any[]> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/SMProduct`, {
      reqType: 'GetProductsList',
      reqObject: {
        includeTotalRowsLength: false,
        ItemsPerPage: 100,
        PageNumber: 1
      }
    }).pipe(
      map(response => {
        if (response.success && response.data?.rowsList) {
          return response.data.rowsList.map((product: any) => ({
            id: product.productId,
            name: product.productName,
            number: product.productCode,
            amount: `${product.productPrice?.toLocaleString() || 0}₪`,
            status: product.isActive ? 'نشط' : 'غير نشط',
            statusLabel: product.isDefault ? 'نشط' : 'غير نشط',
            isActive: product.isActive
          }));
        }
        return [];
      })
    );
  }

  /**
   * Save Product using SMProduct controller
   */
  saveProduct(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/SMProduct`, {
      reqType: 'SaveProductDetails',
      reqObject: {
        productId: data.id,
        productName: data.name,
        productCode: data.number,
        productPrice: parseFloat((data.amount || '0').replace(/[₪,]/g, '')),
        isActive: data.status === 'نشط',
        isDefault: data.statusLabel === 'نشط'
      }
    });
  }

  /**
   * Delete Product using SMProduct controller
   */
  deleteProduct(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/SMProduct`, {
      reqType: 'DeleteProduct',
      reqObject: {
        productId: id
      }
    });
  }

  /**
   * Get Banks List - Using lookup
   */
  getBanks(): Observable<any[]> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'GetLookUpsList',
      reqObject: {
        LookUpTypeId: 2, // Banks
        includeTotalRowsLength: false
      }
    }).pipe(
      map(response => {
        if (response.success && response.data?.rowsList) {
          return response.data.rowsList.map((bank: any) => ({
            id: bank.lookUpId,
            name: bank.lookUpValue,
            number: bank.lookUpCode || bank.lookUpId.toString(),
            status: bank.isActive ? 'نشط' : 'غير نشط',
            statusLabel: 'غير نشط',
            isActive: bank.isActive
          }));
        }
        return [];
      })
    );
  }

  /**
   * Get Check Statuses List
   */
  getCheckStatuses(): Observable<any[]> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'GetLookUpsList',
      reqObject: {
        LookUpTypeId: 5, // Check status
        includeTotalRowsLength: false
      }
    }).pipe(
      map(response => {
        if (response.success && response.data?.rowsList) {
          return response.data.rowsList.map((status: any) => ({
            id: status.lookUpId,
            name: status.lookUpValue,
            number: status.lookUpCode || status.lookUpId.toString().padStart(3, '0'),
            status: status.isActive ? 'نشط' : 'غير نشط',
            statusLabel: 'غير نشط',
            isActive: status.isActive
          }));
        }
        return [];
      })
    );
  }

  /**
   * Get Addresses List
   */
  getAddresses(): Observable<any[]> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'GetLookUpsList',
      reqObject: {
        LookUpTypeId: 3, // Address
        includeTotalRowsLength: false
      }
    }).pipe(
      map(response => {
        if (response.success && response.data?.rowsList) {
          return response.data.rowsList.map((address: any) => ({
            id: address.lookUpId,
            name: address.lookUpValue,
            number: address.lookUpCode || address.lookUpId.toString().padStart(3, '0'),
            status: address.isActive ? 'نشط' : 'غير نشط',
            statusLabel: 'غير نشط',
            isActive: address.isActive
          }));
        }
        return [];
      })
    );
  }

  /**
   * Get Payment Types List
   */
  getPaymentTypes(): Observable<any[]> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'GetLookUpsList',
      reqObject: {
        LookUpTypeId: 4, // Payment type
        includeTotalRowsLength: false
      }
    }).pipe(
      map(response => {
        if (response.success && response.data?.rowsList) {
          return response.data.rowsList.map((type: any) => ({
            id: type.lookUpId,
            name: type.lookUpValue,
            number: type.lookUpCode || type.lookUpId.toString().padStart(3, '0'),
            status: type.isActive ? 'نشط' : 'غير نشط',
            statusLabel: 'غير نشط',
            isActive: type.isActive
          }));
        }
        return [];
      })
    );
  }

  /**
   * Save Lookup (for Banks, Check Statuses, Addresses, Payment Types)
   */
  saveLookup(data: any, lookupTypeId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'SaveLookUpDetails',
      reqObject: {
        lookUpId: data.id,
        lookUpTypeId: lookupTypeId,
        lookUpValue: data.name,
        lookUpCode: data.number,
        isActive: data.status === 'نشط'
      }
    });
  }

  /**
   * Delete Lookup
   */
  deleteLookup(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/smlookup`, {
      reqType: 'DeleteLookUp',
      reqObject: {
        lookUpId: id
      }
    });
  }

  /**
   * Get lookup type ID by tab index
   */
  getLookupTypeByTabIndex(tabIndex: number): number {
    const lookupTypes: { [key: number]: number } = {
      1: 2, // Banks
      2: 5, // Check Status
      3: 3, // Addresses
      4: 4  // Payment Types
    };
    return lookupTypes[tabIndex] || 0;
  }
}