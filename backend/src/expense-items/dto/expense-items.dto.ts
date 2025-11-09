import { SMDateDto, SMLookUpDto, SMUserDto, SMCustomerDto } from "src/expenses/dto/expense.dto";

export class SaveExpenseItemDto {
    expenseItemId?: number;
    expense: {
      expenseId: number;
      expenseDate?: SMDateDto;
    };
    expenseItemMethod: SMLookUpDto;
    expenseItemBank: SMLookUpDto;
    expenseItemBankAccountNumber?: string;
    expenseItemBankBranchNumber?: string;
    expenseItemAmount: number;
    expenseItemCheckNumber?: string;
    expenseItemCheckDueDate: SMDateDto;
    expenseItemCheckStatus: SMLookUpDto;
    expenseItemReference?: string;
    expenseItemStatusId: number;
    expenseItemNotes?: string;
    createdBy: SMUserDto;
    modifiedBy?: SMUserDto;
  }
  
  export class GetExpenseItemsListDto {
    expenseItemIds?: string;
    expenseIds?: string;
    expense?: {
      customer?: SMCustomerDto;
      expenseType?: SMLookUpDto;
      expenseDate?: SMDateDto;
      expenseStatusIds?: string;
    };
    expenseItemMethod?: SMLookUpDto;
    expenseItemBank?: SMLookUpDto;
    expenseItemBankAccountNumber?: string;
    expenseItemBankBranchNumber?: string;
    expenseItemCheckNumber?: string;
    expenseItemCheckDueDate?: SMDateDto;
    expenseItemCheckStatus?: SMLookUpDto;
    expenseItemReference?: string;
    expenseItemStatusIds?: string;
    createdBy?: SMUserDto;
    modifiedBy?: SMUserDto;
    createdDate?: SMDateDto;
    modifiedDate?: SMDateDto;
    itemsPerPage?: number;
    pageNumber?: number;
    includeTotalRowsLength?: boolean;
    groupBy?: string;
  }
  
  export class GetExpenseItemDetailsDto {
    expenseItemId: number;
  }
  
  export class DeleteExpenseItemDto {
    expenseItemId: number;
  }
  
  export class ExpenseItemRequestDto {
    reqType:
      | 'SaveExpenseItemDetails'
      | 'GetExpenseItemsList'
      | 'GetExpenseItemDetails'
      | 'DeleteExpenseItem';
    reqObject:
      | SaveExpenseItemDto
      | GetExpenseItemsListDto
      | GetExpenseItemDetailsDto
      | DeleteExpenseItemDto
      | any;
  }
  