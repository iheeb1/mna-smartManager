export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
  }
  
  export interface ApiRequest {
    ReqType: string;
    ReqObject: any;
  }