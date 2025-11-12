import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TransactionSearchParams {
  customerId?: number;
  carCarNumber?: string;
  fromDate?: string;
  toDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  includeItems?: boolean;
  groupBy?: 'Date' | 'Customer' | 'TransactionType' | '';
}

export interface TransactionResponse {
  transactionId: number;
  customerId: number;
  customerName: string;
  carNumber?: string;
  transactionDate: string;
  shortDate: string;
  transactionType: string;
  transactionTypeId: number;
  transactionOrderAmount: number;
  transactionPaymentAmount: number;
  transactionTotal: number;
  transactionData?: any;
}

export interface GroupedTransaction {
  item: string | number;
  subList: TransactionResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/SMTransaction`;

  constructor(private http: HttpClient) {}

  getGroupedTransactionsList(params: TransactionSearchParams): Observable<ApiResponse<{ totalLength: number; rowsList: TransactionResponse[] | GroupedTransaction[] }>> {
    return this.http.post<ApiResponse<{ totalLength: number; rowsList: any }>>(this.apiUrl, {
      reqType: 'GetGroupedTransactionsList',
      reqObject: { itemsPerPage: 30, pageNumber: 0, includeItems: false, groupBy: '', ...params }
    });
  }

  getDetailedTransactionsList(params: TransactionSearchParams): Observable<ApiResponse<{ totalLength: number; rowsList: TransactionResponse[] | GroupedTransaction[] }>> {
    return this.http.post<ApiResponse<{ totalLength: number; rowsList: any }>>(this.apiUrl, {
      reqType: 'GetDetailedTransactionsList',
      reqObject: { itemsPerPage: 30, pageNumber: 0, groupBy: '', ...params }
    });
  }

  getCustomerTransactions(customerId: number, fromDate?: string, toDate?: string, groupBy?: string): Observable<ApiResponse<{ totalLength: number; rowsList: any }>> {
    return this.getGroupedTransactionsList({ customerId, fromDate, toDate, groupBy: groupBy as any || '', includeItems: true, itemsPerPage: 100, pageNumber: 0 });
  }

  formatDateForApi(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateTotals(transactions: TransactionResponse[]): { totalOrders: number; totalPayments: number; balance: number } {
    const totals = transactions.reduce((acc, t) => {
      acc.totalOrders += t.transactionOrderAmount;
      acc.totalPayments += t.transactionPaymentAmount;
      return acc;
    }, { totalOrders: 0, totalPayments: 0, balance: 0 });
    totals.balance = totals.totalOrders - totals.totalPayments;
    return totals;
  }

  isGroupedResponse(rowsList: any[]): rowsList is GroupedTransaction[] {
    return rowsList.length > 0 && 'subList' in rowsList[0];
  }

  flattenGroupedTransactions(groupedList: GroupedTransaction[]): TransactionResponse[] {
    return groupedList.flatMap(group => group.subList);
  }
}