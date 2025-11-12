import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CustomerSearchParams {
  customerIds?: string;
  customerName?: string;
  customerStatusId?: number;
  customerTypeId?: number;
  itemsPerPage?: number;
  pageNumber?: number;
  groupBy?: 'Name' | '';
  phone?: string;
  fax?: string;
  mobile?: string;
  email?: string;
}

export interface SaveCustomerDto {
  customerId?: number;
  customerName: string;
  customerPhoneNumber?: string;
  customerMobileNumber?: string;
  customerEmails?: string;
  customerAddressLine1?: string;
  customerAddressLine2?: string;
  customerCity?: string;
  customerState?: string;
  customerZIP?: string;
  customerCountry?: string;
  customerNotes?: string;
  customerOpeningBalance?: number;
  customerAllowedExcessAmount?: number;
  customerAllowedExcessDays?: number;
  customerStatusId?: number;
  customerTypeId?: number;
}

export interface CustomerResponse {
  customerId: number;
  customerName: string;
  customerPhoneNumber: string;
  customerMobileNumber: string;
  customerEmails: string;
  customerAddressLine1: string;
  customerAddressLine2: string;
  customerCity: string;
  customerState: string;
  customerZIP: string;
  customerCountry: string;
  customerNotes: string;
  customerOpeningBalance: number;
  customerAllowedExcessAmount: number;
  customerAllowedExcessDays: number;
  customerStatusId: number;
  customerTypeId: number;
  createdDate: string;
  modifiedDate: string;
  customerFax?: string;
}

export interface CustomerListResponse {
  TotalLength: number;
  RowsList: CustomerResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/smcustomer`;

  constructor(private http: HttpClient) {}

  getCustomersList(params: CustomerSearchParams): Observable<CustomerListResponse> {
    return this.http.post<CustomerListResponse>(this.apiUrl, {
      ReqType: 'GetCustomersList',
      ReqObject: {
        CustomerIds: params.customerIds || '',
        CustomerName: params.customerName || '',
        CustomerStatusId: params.customerStatusId || 0,
        CustomerTypeId: params.customerTypeId || 0,
        ItemsPerPage: params.itemsPerPage || 30,
        PageNumber: params.pageNumber || 0,
        GroupBy: params.groupBy || ''
      }
    });
  }

  getCustomerDetails(customerId: number): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, {
      ReqType: 'GetCustomerDetails',
      ReqObject: {
        CustomerId: customerId
      }
    });
  }

  saveCustomer(customer: SaveCustomerDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ReqType: 'SaveCustomerDetails',
      ReqObject: {
        Customer: customer
      }
    });
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ReqType: 'DeleteCustomer',
      ReqObject: {
        CustomerId: customerId
      }
    });
  }

  deleteCustomerTransactions(customerId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ReqType: 'DeleteCustomerTransactions',
      ReqObject: {
        CustomerId: customerId
      }
    });
  }

  deleteCustomers(customerIds: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ReqType: 'DeleteCustomers',
      ReqObject: {
        CustomerIds: customerIds
      }
    });
  }

  changeCustomersStatus(customerIds: string, statusId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ReqType: 'ChangeCustomersStatus',
      ReqObject: {
        CustomerIds: customerIds,
        StatusId: statusId
      }
    });
  }

  searchCustomers(searchTerm: string): Observable<CustomerListResponse> {
    return this.getCustomersList({
      customerName: searchTerm,
      itemsPerPage: 100,
      pageNumber: 0
    });
  }
}