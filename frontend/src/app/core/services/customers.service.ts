import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum CustomerRequestType {
  SaveCustomerDetails = 'SaveCustomerDetails',
  GetCustomersList = 'GetCustomersList',
  GetCustomerDetails = 'GetCustomerDetails',
  DeleteCustomer = 'DeleteCustomer',
  DeleteCustomerTransactions = 'DeleteCustomerTransactions',
  DeleteCustomers = 'DeleteCustomers',
  ChangeCustomersStatus = 'ChangeCustomersStatus'
}

export interface CustomerSearchDto {
  CustomerIds?: string;
  CustomerParentIds?: string;
  CustomerStatusIds?: string;
  CustomerType?: { LookUpIds?: string };
  CustomerIdz?: string;
  CustomerName?: string;
  CustomerPhoneNumber?: string;
  CustomerMobileNumber?: string;
  CustomerFaxNumber?: string;
  CustomerCity?: string;
  CustomerCountry?: string;
  CreatedBy?: { UserIds?: string };
  ModifiedBy?: { UserIds?: string };
  CreatedDate?: { FromDate?: string; ToDate?: string };
  ModifiedDate?: { FromDate?: string; ToDate?: string };
  ItemsPerPage?: number;
  PageNumber?: number;
  IncludeTotalRowsLength?: boolean;
  GroupBy?: string;
}

export interface CustomerRequestDto {
  ReqType: CustomerRequestType;
  ReqObject: any;
}

export interface Customer {
  customerId?: number;
  customerParentId?: number;
  customerStatusId?: number;
  customerTypeId?: number;
  customerIdz?: string;
  customerName: string;
  customerOpeningBalance?: number;
  customerAllowedExcessAmount?: number;
  customerAllowedExcessDays?: number;
  customerNotes?: string;
  customerProfileImage?: string;
  customerEmails?: string;
  customerPhoneNumber?: string;
  customerMobileNumber?: string;
  customerFaxNumber?: string;
  customerAddressLine1?: string;
  customerAddressLine2?: string;
  customerCity?: string;
  customerState?: string;
  customerZIP?: string;
  customerCountry?: string;
  createdBy?: number;
  modifiedBy?: number;
}

export interface CustomerListResponse {
  TotalLength: number;
  RowsList: Customer[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/smcustomer`;

  constructor(private http: HttpClient) {}

  getCustomersList(searchParams: CustomerSearchDto): Observable<CustomerListResponse> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.GetCustomersList,
      ReqObject: searchParams
    };
    return this.http.post<CustomerListResponse>(this.apiUrl, requestDto);
  }

  getCustomerDetails(customerId: number): Observable<Customer> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.GetCustomerDetails,
      ReqObject: { CustomerId: customerId }
    };
    return this.http.post<Customer>(this.apiUrl, requestDto);
  }

  saveCustomer(customer: Customer): Observable<any> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.SaveCustomerDetails,
      ReqObject: customer
    };
    return this.http.post(this.apiUrl, requestDto);
  }

  deleteCustomer(customerId: number): Observable<any> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.DeleteCustomer,
      ReqObject: { CustomerId: customerId }
    };
    return this.http.post(this.apiUrl, requestDto);
  }

  deleteCustomers(customerIds: string): Observable<any> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.DeleteCustomers,
      ReqObject: { CustomerIds: customerIds }
    };
    return this.http.post(this.apiUrl, requestDto);
  }

  changeCustomersStatus(customerIds: string, statusId: number): Observable<any> {
    const requestDto: CustomerRequestDto = {
      ReqType: CustomerRequestType.ChangeCustomersStatus,
      ReqObject: { CustomerIds: customerIds, StatusId: statusId }
    };
    return this.http.post(this.apiUrl, requestDto);
  }
}