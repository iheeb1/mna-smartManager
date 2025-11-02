export interface PaymentItem {
  paymentItemId?: number;
  paymentId?: number;
  paymentItemMethodId?: number;
  paymentItemBankId?: number;
  paymentItemBankAccountNumber?: string;
  paymentItemBankBranchNumber?: string;
  paymentItemAmount?: number;
  paymentItemCheckNumber?: string;
  paymentItemNameOnCheck?: string;
  paymentItemCheckDueDate?: Date;
  paymentItemReference?: string;
  paymentItemCheckStatusId?: number;
  paymentItemStatusId?: number;
  paymentItemNotes?: string;
  createdBy?: number;
  modifiedBy?: number;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface PaymentListParams {
  paymentIds?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  searchTerm?: string;
  includeTotalRowsLength?: boolean;
}

export interface PaymentListResult {
  totalLength: number;
  rowsList: PaymentItem[];
}
