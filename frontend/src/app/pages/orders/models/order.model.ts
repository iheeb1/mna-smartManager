// API Response wrapper
export interface ApiListResponse<T = any> {
    totalLength: number;
    rowsList: T[];
  }
  
  // Main Order interface for display in table
  export interface Order {
    id: number;
    date: string;
    customerId?: number | null;
    carId?: number | null;
    client: string;
    vehicle: string;
    address: string;
    phoneNumber: string;
    fixedType: string;
    parking: string;
    taxAmount: number;
    totalBeforeTax: number;
    totalWithTax: number;
    items: OrderItem[];
  }
  
  // Order Item interface
  export interface OrderItem {
    orderItemId?: number;
    orderId?: number;
    productId?: number | null;
    productCode?: string;
    productName?: string;
    description?: string;
    duration?: string;
    quantity: number;
    price: number;
    totalBeforeTax: number; 
    taxAmount: number; 
    totalWithTax: number;
    beforeTax?: number;
    tax?: number;
    total?: number;
  }
  
  // Raw Order Item from API (before mapping)
  export interface RawOrderItem {
    orderItemId: number;
    orderId: number;
    productId?: number;
    quantity: number;
    price: number;
    totalBeforeTax: number;
    taxAmount: number;
    totalWithTax: number;
    duration?: string;
    orderDate?: {
      shortDate: string;
      longDate: string;
    };
    product?: {
      productId: number;
      productCode: string;
      productName: string;
      productPrice: number;
    };
    customer?: {
      customerId: number;
      customerName: string;
      phoneNumber: string;
      email: string;
    };
    order?: {
      orderId: number;
      customerId?: number;
      carId?: number;
      addressLine1: string;
      fixedType: string;
      parking: string;
      car?: {
        carId: number;
        carNumber: string;
      };
    };
  }
  
  // Grouped Order Items from API
  export interface GroupedOrderItems {
    item: string | number;
    orderDate?: string;
    subList: RawOrderItem[];
  }
  
  // Get Order Items List Request
  export interface GetOrderItemsRequest {
    customerIds?: string;
    carIds?: string;
    productIds?: string;
    fromDate?: string;
    toDate?: string;
    orderTypeIds?: string;
    searchText?: string;
    itemsPerPage?: number;
    pageNumber?: number;
    includeTotalRowsLength?: boolean;
    groupBy?: 'Date' | 'Customer' | 'Car' | 'OrderId' | 'Supplier' | 'None';
  }
  
  // Save Order Request
  export interface SaveOrderRequest {
    orderId?: number;
    customerId: number;
    carId?: number;
    driverId?: number;
    orderTypeId?: number;
    addressLine1?: string;
    orderDate: string;
    includeVAT: boolean;
    contractNumber?: string;
    notes?: string;
    orderStatusId?: number;
    items: SaveOrderItemRequest[];
  }
  
  // Save Order Item Request
  export interface SaveOrderItemRequest {
    orderItemId?: number;
    productId?: number | null;
    quantity: number;
    price: number;
    totalBeforeTax: number;
    taxAmount: number;
    totalWithTax: number;
  }
  
  // Customer model
  export interface Customer {
    customerId: number;
    customerName: string;
    customerIdz?: string;
    customerPhoneNumber?: string;
    customerMobileNumber?: string;
    customerEmails?: string;
    customerAddressLine1?: string;
    customerAddressLine2?: string;
    customerCity?: string;
    customerState?: string;
    customerZIP?: string;
    customerCountry?: string;
    customerStatusId?: number;
    customerTypeId?: number;
    customerOpeningBalance?: number;
    customerAllowedExcessAmount?: number;
    customerAllowedExcessDays?: number;
    customerNotes?: string;
    customerProfileImage?: string;
    addresses?: Address[];
    cars?: Car[];
  }
  
  // Car model
  export interface Car {
    carId: number;
    carNumber: string;
    carPlateNumber?: string;
    carNotes?: string;
    objectId?: number;
    carStatusId?: number;
    customerId?: number;
    customer?: {
      customerId: number;
      customerName: string;
    };
  }
  
  // Address model
  export interface Address {
    addressId?: number;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }
  
  // Product model
  export interface Product {
    productId: number;
    productCode: string;
    productName: string;
    productPrice: number;
    productCost?: number;
    productSize?: string;
    productImage?: string;
    returnableItem?: number;
    includeVariants?: number;
    productVariants?: any[];
    productStatusId?: number;
    categoryId?: number;
    manufacturerId?: number;
    brandId?: number;
    category?: {
      lookUpId: number;
      lookUpName: string;
    };
    brand?: {
      lookUpId: number;
      lookUpName: string;
    };
    manufacturer?: {
      lookUpId: number;
      lookUpName: string;
    };
    productStatus?: {
      lookUpId: number;
      lookUpName: string;
    };
    createdBy?: number;
    modifiedBy?: number;
    createdDate?: Date;
    modifiedDate?: Date;
  }
  
  // Lookup model
  export interface Lookup {
    lookUpId: number;
    lookUpName: string;
    lookUpCode?: string;
    lookUpTableName?: string;
    lookUpStatus?: number;
    lookUpTypeId?: number;
    lookUpTypeName?: string;
    param1?: string;
    param2?: string;
    param3?: string;
    lookUpData?: any;
    createdBy?: number;
    modifiedBy?: number;
    createdDate?: Date;
    modifiedDate?: Date;
  }
  
  // Dropdown option model
  export interface DropdownOption {
    label: string;
    value: any;
    data?: any;
    icon?: string;
    disabled?: boolean;
  }
  
  // Order Type enum
  export enum OrderType {
    IMMEDIATE = 'IMMEDIATE',
    REGULAR = 'REGULAR'
  }
  
  // Order Status enum
  export enum OrderStatus {
    PENDING = 1,
    CONFIRMED = 2,
    IN_PROGRESS = 3,
    COMPLETED = 4,
    CANCELLED = 5
  }
  
  // Customer Status enum
  export enum CustomerStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    SUSPENDED = 3
  }
  
  // Product Status enum
  export enum ProductStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    OUT_OF_STOCK = 3
  }
  
  // Car Status enum
  export enum CarStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    MAINTENANCE = 3
  }