export class SMDateDto {
    fromDate?: string;
    toDate?: string;
    fullDate?: Date;
    shortDate?: string;
  }
  
  export class SMLookUpDto {
    lookUpId?: number;
    lookUpIds?: string;
    lookUpName?: string;
  }
  
  export class SMUserDto {
    userId?: number;
    userIds?: string;
    userName?: string;
  }
  
  export class SMCustomerDto {
    customerId?: number;
    customerIds?: string;
    customerIdz?: string;
    customerName?: string;
  }
  
  export class SMExpenseItemDto {
    expenseItemId?: number;
    expenseItemIds?: string;
    expense?: {
      expenseId?: number;
      expenseIds?: string;
    };
    expenseItemMethod?: SMLookUpDto;
    expenseItemBank?: SMLookUpDto;
    expenseItemBankAccountNumber?: string;
    expenseItemBankBranchNumber?: string;
    expenseItemAmount?: number;
    expenseItemCheckNumber?: string;
    expenseItemCheckDueDate?: SMDateDto;
    expenseItemCheckStatus?: SMLookUpDto;
    expenseItemReference?: string;
    expenseItemStatusId?: number;
    expenseItemNotes?: string;
    createdBy?: SMUserDto;
    modifiedBy?: SMUserDto;
    createdDate?: SMDateDto;
    modifiedDate?: SMDateDto;
  }
  
  export class SaveExpenseDto {
    expenseId?: number;
    customer: SMCustomerDto;
    expenseType: SMLookUpDto;
    expenseDate: SMDateDto;
    expenseDiscount: number;
    expenseStatusId: number;
    expenseNotes?: string;
    createdBy: SMUserDto;
    modifiedBy?: SMUserDto;
    expenseItems?: SMExpenseItemDto[];
  }
  
  export class GetExpensesListDto {
    expenseIds?: string;
    customer?: SMCustomerDto;
    expenseType?: SMLookUpDto;
    expenseStatusId?: number;
    expenseDate?: SMDateDto;
    createdBy?: SMUserDto;
    modifiedBy?: SMUserDto;
    createdDate?: SMDateDto;
    modifiedDate?: SMDateDto;
    itemsPerPage?: number;
    pageNumber?: number;
    includeTotalRowsLength?: boolean;
    groupBy?: string;
  }
  
  export class GetExpenseDetailsDto {
    expenseId: number;
    includeExpenseItems?: boolean;
  }
  
  export class DeleteExpenseDto {
    expenseId: number;
  }
  
  export class ExpenseRequestDto {
    reqType: 'SaveExpenseDetails' | 'GetExpensesList' | 'GetExpenseDetails' | 'DeleteExpense';
    reqObject: SaveExpenseDto | GetExpensesListDto | GetExpenseDetailsDto | DeleteExpenseDto | any;
  }