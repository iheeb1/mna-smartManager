import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardTotals {
  totalOrders: number;
  totalPayments: number;
  totalExpenses: number;
  totalAccount: number;
}

export interface ClearedCheck {
  id: string;
  date: string;
  collectionDate: string;
  customerName: string;
  bank: string;
  accountNumber: string;
  checkNumber: string;
  paymentDate: string;
  notes: string;
  amount: string;
  description: string;
}

export interface AlertAndClaim {
  date: string;
  description: string;
}

export interface SystemBackup {
  date: string;
  time: string;
  createdBy: string;
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}

export interface ApiResponse<T> {
  IsSuccess: boolean;
  RespObject: T;
  Message?: string;
}

export interface BackupResponse {
  id: number;
  createdById: number;
  createdAt: string;
  filePath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Get Dashboard Totals
   */
  async getDashboardTotals(
    customerIds: string,
    dateRange: DateRange
  ): Promise<DashboardTotals> {
    const requestBody = {
      ReqType: 'GetDashboardTotals',
      ReqObject: {
        TotalsLayoutCustomer: {
          CustomerIds: customerIds,
        },
        TotalsLayoutDate: {
          FromDate: dateRange.fromDate,
          ToDate: dateRange.toDate,
        },
      },
    };

    const response = await firstValueFrom(
      this.http.post<ApiResponse<any>>(`${this.apiUrl}/smdashboard`, requestBody)
    );

    if (response?.IsSuccess && response.RespObject) {
      return {
        totalOrders: response.RespObject.TotalOrders || 0,
        totalPayments: response.RespObject.TotalPayments || 0,
        totalExpenses: response.RespObject.TotalExpenses || 0,
        totalAccount: response.RespObject.TotalAccount || 0,
      };
    }

    return {
      totalOrders: 0,
      totalPayments: 0,
      totalExpenses: 0,
      totalAccount: 0,
    };
  }

  /**
   * Get Cleared Checks
   */
  async getClearedChecks(
    dateRange: DateRange,
    customerIds?: string,
    itemsPerPage: number = 8,
    pageNumber: number = 1
  ): Promise<ClearedCheck[]> {
    let params = new HttpParams()
      .set('fromDate', dateRange.fromDate)
      .set('toDate', dateRange.toDate)
      .set('itemsPerPage', itemsPerPage.toString())
      .set('pageNumber', pageNumber.toString());

    if (customerIds) {
      params = params.set('customerIds', customerIds);
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<ClearedCheck[]>>(
        `${this.apiUrl}/smdashboard/cleared-checks`,
        { params }
      )
    );

    return response?.IsSuccess && response.RespObject ? response.RespObject : [];
  }

  /**
   * Get Alerts and Claims
   */
  async getAlertsAndClaims(
    dateRange: DateRange,
    customerIds?: string,
    itemsPerPage: number = 8,
    pageNumber: number = 1
  ): Promise<AlertAndClaim[]> {
    let params = new HttpParams()
      .set('fromDate', dateRange.fromDate)
      .set('toDate', dateRange.toDate)
      .set('itemsPerPage', itemsPerPage.toString())
      .set('pageNumber', pageNumber.toString());

    if (customerIds) {
      params = params.set('customerIds', customerIds);
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<AlertAndClaim[]>>(
        `${this.apiUrl}/smdashboard/alerts-claims`,
        { params }
      )
    );

    return response?.IsSuccess && response.RespObject ? response.RespObject : [];
  }

  /**
   * Get System Backups
   */
  async getSystemBackups(
    itemsPerPage: number = 8,
    pageNumber: number = 1
  ): Promise<SystemBackup[]> {
    const params = new HttpParams()
      .set('itemsPerPage', itemsPerPage.toString())
      .set('pageNumber', pageNumber.toString());

    const response = await firstValueFrom(
      this.http.get<ApiResponse<SystemBackup[]>>(
        `${this.apiUrl}/smdashboard/system-backups`,
        { params }
      )
    );

    return response?.IsSuccess && response.RespObject ? response.RespObject : [];
  }

  /**
   * Execute System Backup
   * @param createdById - ID of the user creating the backup
   */
  async executeBackup(createdById: number): Promise<BackupResponse> {
    const response = await firstValueFrom(
      this.http.post<BackupResponse>(
        `${this.apiUrl}/backups/execute`,
        { createdById }
      )
    );

    return response;
  }

  /**
   * Get date range based on time range option
   */
  getDateRange(timeRange: string): DateRange {
    const today = new Date();
    const toDate = this.formatDateForAPI(today);
    let fromDate: string;

    switch (timeRange) {
      case 'today':
        fromDate = toDate;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        fromDate = this.formatDateForAPI(weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        fromDate = this.formatDateForAPI(monthAgo);
        break;
      default: // 'all'
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        fromDate = this.formatDateForAPI(yearAgo);
        break;
    }

    return { fromDate, toDate };
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}