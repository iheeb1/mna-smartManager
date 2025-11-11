import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface CheckFilters {
  customerIds?: string;
  fromDate?: string;
  toDate?: string;
  paymentItemMethodIds?: string;
  paymentItemCheckStatusIds?: string;
  paymentItemBankIds?: string;
  fromPaymentItemCheckDueDate?: string;
  toPaymentItemCheckDueDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChecksService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get Cleared Checks with filters
   */
  async getClearedChecks(filters: CheckFilters = {}): Promise<ClearedCheck[]> {
    let params = new HttpParams();

    // Add filters to params
    if (filters.customerIds) {
      params = params.set('customerIds', filters.customerIds);
    }
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }
    if (filters.paymentItemMethodIds) {
      params = params.set('paymentItemMethodIds', filters.paymentItemMethodIds);
    }
    if (filters.paymentItemCheckStatusIds) {
      params = params.set('paymentItemCheckStatusIds', filters.paymentItemCheckStatusIds);
    }
    if (filters.paymentItemBankIds) {
      params = params.set('paymentItemBankIds', filters.paymentItemBankIds);
    }
    if (filters.fromPaymentItemCheckDueDate) {
      params = params.set('fromPaymentItemCheckDueDate', filters.fromPaymentItemCheckDueDate);
    }
    if (filters.toPaymentItemCheckDueDate) {
      params = params.set('toPaymentItemCheckDueDate', filters.toPaymentItemCheckDueDate);
    }

    // Pagination
    params = params.set('itemsPerPage', (filters.itemsPerPage || 100).toString());
    params = params.set('pageNumber', (filters.pageNumber || 1).toString());

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<ClearedCheck[]>>(
          `${this.apiUrl}/smdashboard/cleared-checks`,
          { params }
        )
      );

      return response?.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Error loading cleared checks:', error);
      return [];
    }
  }

  /**
   * Get all cleared checks (no pagination)
   */
  async getAllClearedChecks(): Promise<ClearedCheck[]> {
    return this.getClearedChecks({
      paymentItemCheckStatusIds: '2', // 2 = Cleared status
      itemsPerPage: 1000,
      pageNumber: 1
    });
  }

  /**
   * Search cleared checks
   */
  async searchClearedChecks(
    searchQuery: string,
    filters: CheckFilters = {}
  ): Promise<ClearedCheck[]> {
    const allChecks = await this.getClearedChecks(filters);

    if (!searchQuery || !searchQuery.trim()) {
      return allChecks;
    }

    const query = searchQuery.toLowerCase().trim();
    return allChecks.filter(check =>
      check.customerName.toLowerCase().includes(query) ||
      check.checkNumber.toLowerCase().includes(query) ||
      check.accountNumber.toLowerCase().includes(query) ||
      check.amount.includes(query) ||
      check.bank.toLowerCase().includes(query) ||
      (check.notes && check.notes.toLowerCase().includes(query))
    );
  }

  /**
   * Delete a check (you'll need to implement this endpoint)
   */
  async deleteCheck(checkId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}/smpaymentitem/${checkId}`
        )
      );
      return response?.success || false;
    } catch (error) {
      console.error('Error deleting check:', error);
      return false;
    }
  }

  /**
   * Get date range for default filter (last year)
   */
  getDefaultDateRange(): { fromDate: string; toDate: string } {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);

    return {
      fromDate: this.formatDate(yearAgo),
      toDate: this.formatDate(today)
    };
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}