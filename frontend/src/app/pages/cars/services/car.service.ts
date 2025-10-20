import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  result: boolean;
  code: number;
  message: string;
  result_data?: T;
  errorMessage?: string;
}

export interface CarResponse {
  carId?: number;
  objectId?: number;
  carStatusId?: number;
  carNumber: string;
  carNotes?: string;
  createdBy?: number;
  modifiedBy?: number;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface CarsListResponse {
  totalLength: number;
  rowsList: CarResponse[];
}

export interface GetCarsListParams {
  objectIds?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  searchTerm?: string;
  includeTotalRowsLength?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private apiUrl = `${environment.apiUrl}/SMCar`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get list of cars with pagination and filtering
   */
  getCarsList(params?: GetCarsListParams): Observable<CarsListResponse> {
    const body = {
      reqType: 'GetCarsList',
      reqObject: {
        objectIds: params?.objectIds || '',
        itemsPerPage: params?.itemsPerPage || 50,
        pageNumber: params?.pageNumber || 0,
        searchTerm: params?.searchTerm || '',
        includeTotalRowsLength: params?.includeTotalRowsLength ?? true
      }
    };

    return this.http.post<ApiResponse<CarsListResponse>>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.result && response.result_data) {
          return response.result_data;
        }
        throw new Error(response.errorMessage || response.message || 'Failed to fetch cars');
      }),
      catchError(error => {
        console.error('Error fetching cars:', error);
        return throwError(() => new Error(error.error?.message || error.message || 'Failed to fetch cars'));
      })
    );
  }

  /**
   * Get car details by ID
   */
  getCarDetails(carId: number): Observable<CarResponse> {
    const body = {
      reqType: 'GetCarDetails',
      reqObject: { 
        carId: carId
      }
    };

    return this.http.post<ApiResponse<CarResponse>>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.result && response.result_data) {
          return response.result_data;
        }
        throw new Error(response.errorMessage || response.message || 'Car not found');
      }),
      catchError(error => {
        console.error('Error fetching car details:', error);
        return throwError(() => new Error(error.error?.message || error.message || 'Failed to fetch car details'));
      })
    );
  }

  /**
   * Get cars by customer ID
   */
  getCarsByCustomerId(customerId: number): Observable<CarResponse[]> {
    const body = {
      reqType: 'GetCarsByCustomerId',
      reqObject: { 
        customerId: customerId
      }
    };

    return this.http.post<ApiResponse<CarResponse[]>>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.result && response.result_data) {
          return response.result_data;
        }
        throw new Error(response.errorMessage || response.message || 'Cars not found');
      }),
      catchError(error => {
        console.error('Error fetching cars by customer:', error);
        return throwError(() => new Error(error.error?.message || error.message || 'Failed to fetch cars'));
      })
    );
  }

  /**
   * Save or update car
   */
  saveCar(car: Partial<CarResponse>): Observable<CarResponse> {
    const body = {
      reqType: 'SaveCarDetails',
      reqObject: {
        carId: car.carId || 0,
        objectId: car.objectId || 0,
        carStatusId: car.carStatusId || 1,
        carNumber: car.carNumber || '',
        carNotes: car.carNotes || '',
        createdBy: car.createdBy || 1,
        modifiedBy: car.modifiedBy || 1
      }
    };

    return this.http.post<ApiResponse<CarResponse>>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.result && response.result_data) {
          return response.result_data;
        }
        throw new Error(response.errorMessage || response.message || 'Failed to save car');
      }),
      catchError(error => {
        console.error('Error saving car:', error);
        return throwError(() => new Error(error.error?.message || error.message || 'Failed to save car'));
      })
    );
  }

  /**
   * Delete car
   */
  deleteCar(carId: number): Observable<void> {
    const body = {
      reqType: 'DeleteCar',
      reqObject: { 
        carId: carId
      }
    };

    return this.http.post<ApiResponse>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.result) {
          return;
        }
        throw new Error(response.errorMessage || response.message || 'Failed to delete car');
      }),
      catchError(error => {
        console.error('Error deleting car:', error);
        return throwError(() => new Error(error.error?.message || error.message || 'Failed to delete car'));
      })
    );
  }
}