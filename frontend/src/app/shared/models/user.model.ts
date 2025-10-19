export interface User {
    userId: number;
    userStatus: number;
    userType: number;
    fullName: string;
    userName: string;
    password?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    faxNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    profileImage?: string;
    resetGuId?: string;
    createdBy?: number;
    modifiedBy?: number;
    createdDate?: Date;
    modifiedDate?: Date;
    token?: string;
  }
  
  export interface LoginRequest {
    UserName: string;
    Password: string;
  }
  
  export interface LoginResponse extends User {
    token: string;
  }