export class ApiResponse<T = any> {
    result: boolean;
    code: number;
    message: string;
    result_data?: T;
  
    constructor(result: boolean, code: number, message: string, resultData?: T) {
      this.result = result;
      this.code = code;
      this.message = message;
      if (result && resultData !== undefined) {
        this.result_data = resultData;
      }
    }
  
    static success<T>(data?: T, message: string = 'Success'): ApiResponse<T> {
      return new ApiResponse<T>(true, -1, message, data);
    }
  
    static error(message: string, code: number = -1): ApiResponse {
      return new ApiResponse(false, code, message);
    }
  }