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
export class CarsService {
  private readonly apiUrl = `${environment.apiUrl}/SMCar`;

  constructor(private http: HttpClient) {}

  getCarsByCustomerId(customerId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetCarsByCustomerId',
      reqObject: { customerId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  getCarDetails(carId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'GetCarDetails',
      reqObject: { carId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  saveCar(carData: any): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'SaveCarDetails',
      reqObject: carData
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }

  deleteCar(carId: number): Observable<any> {
    return this.http.post<ApiResponse>(this.apiUrl, {
      reqType: 'DeleteCar',
      reqObject: { carId }
    }).pipe(
      map(response => ({
        success: response.result,
        data: response.result_data,
        message: response.message
      }))
    );
  }
}