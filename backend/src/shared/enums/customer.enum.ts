
export enum CustomerRequestType {
    SaveCustomerDetails = 'SaveCustomerDetails',
    GetCustomersList = 'GetCustomersList',
    GetCustomerDetails = 'GetCustomerDetails',
    DeleteCustomer = 'DeleteCustomer',
    DeleteCustomerTransactions = 'DeleteCustomerTransactions',
    DeleteCustomers = 'DeleteCustomers',
    ChangeCustomersStatus = 'ChangeCustomersStatus',
  }
  

  export enum CustomerStatus {
    Active = 1,
    Inactive = 2,
    Pending = 3,
    Suspended = 4,
  }
  

  export enum CustomerType {
    Regular = 1,
    VIP = 2,
    Wholesale = 3,
  }