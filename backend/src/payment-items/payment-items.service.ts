import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentItem } from './payment-item.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetPaymentItemsListParams {
  paymentItemIds?: string;
  paymentIds?: string;
  customerIds?: string;
  customerIdz?: string;
  customerName?: string;
  paymentTypeIds?: string;
  paymentStatusIds?: string;
  paymentItemMethodIds?: string;
  paymentItemBankIds?: string;
  paymentItemBankAccountNumber?: string;
  paymentItemBankBranchNumber?: string;
  paymentItemCheckNumber?: string;
  paymentItemNameOnCheck?: string;
  fromPaymentDate?: string;
  toPaymentDate?: string;
  fromPaymentItemCheckDueDate?: string;
  toPaymentItemCheckDueDate?: string;
  paymentItemCheckStatusIds?: string;
  paymentItemReference?: string;
  paymentItemStatusIds?: string;
  createdByIds?: string;
  modifiedByIds?: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromModifiedDate?: string;
  toModifiedDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

@Injectable()
export class PaymentItemsService {
  constructor(
    @InjectRepository(PaymentItem)
    private readonly paymentItemRepository: Repository<PaymentItem>,
  ) {}

  async savePaymentItemDetails(paymentItemDto: any): Promise<PaymentItem> {
    try {
      const paymentItem = this.paymentItemRepository.create({
        ...(paymentItemDto.PaymentItemId && { paymentItemId: Number(paymentItemDto.PaymentItemId) }),
        paymentId: paymentItemDto.PaymentId || paymentItemDto.paymentId,
        paymentItemMethodId: paymentItemDto.PaymentItemMethodId || paymentItemDto.paymentItemMethodId,
        paymentItemBankId: paymentItemDto.PaymentItemBankId || paymentItemDto.paymentItemBankId,
        paymentItemBankAccountNumber: paymentItemDto.PaymentItemBankAccountNumber || paymentItemDto.paymentItemBankAccountNumber,
        paymentItemBankBranchNumber: paymentItemDto.PaymentItemBankBranchNumber || paymentItemDto.paymentItemBankBranchNumber,
        paymentItemAmount: paymentItemDto.PaymentItemAmount || paymentItemDto.paymentItemAmount,
        paymentItemCheckNumber: paymentItemDto.PaymentItemCheckNumber || paymentItemDto.paymentItemCheckNumber,
        paymentItemNameOnCheck: paymentItemDto.PaymentItemNameOnCheck || paymentItemDto.paymentItemNameOnCheck,
        paymentItemCheckDueDate: paymentItemDto.PaymentItemCheckDueDate || paymentItemDto.paymentItemCheckDueDate,
        paymentItemReference: paymentItemDto.PaymentItemReference || paymentItemDto.paymentItemReference,
        paymentItemCheckStatusId: paymentItemDto.PaymentItemCheckStatusId || paymentItemDto.paymentItemCheckStatusId,
        paymentItemStatusId: paymentItemDto.PaymentItemStatusId || paymentItemDto.paymentItemStatusId,
        paymentItemNotes: paymentItemDto.PaymentItemNotes || paymentItemDto.paymentItemNotes,
        createdBy: paymentItemDto.CreatedBy || paymentItemDto.createdBy,
        modifiedBy: paymentItemDto.ModifiedBy || paymentItemDto.modifiedBy,
      });
  
      const savedItem: any = await this.paymentItemRepository.save(paymentItem);
      return savedItem;
    } catch (error) {
      throw new Error(`Failed to save payment item: ${error.message}`);
    }
  }

  async getPaymentItemsList(params: GetPaymentItemsListParams): Promise<PaymentItem[]> {
    try {
      const query = this.paymentItemRepository.createQueryBuilder('paymentItem');

      if (params.paymentItemIds) {
        const ids = StringUtils.toIntArray(params.paymentItemIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentItemId IN (:...paymentItemIds)', { paymentItemIds: ids });
        }
      }

      if (params.paymentIds) {
        const ids = StringUtils.toIntArray(params.paymentIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentId IN (:...paymentIds)', { paymentIds: ids });
        }
      }

      if (params.paymentItemMethodIds) {
        const ids = StringUtils.toIntArray(params.paymentItemMethodIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentItemMethodId IN (:...paymentItemMethodIds)', { paymentItemMethodIds: ids });
        }
      }

      if (params.paymentItemBankIds) {
        const ids = StringUtils.toIntArray(params.paymentItemBankIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentItemBankId IN (:...paymentItemBankIds)', { paymentItemBankIds: ids });
        }
      }

      if (params.paymentItemBankAccountNumber) {
        query.andWhere('paymentItem.paymentItemBankAccountNumber LIKE :accountNumber', {
          accountNumber: `%${params.paymentItemBankAccountNumber}%`,
        });
      }

      if (params.paymentItemBankBranchNumber) {
        query.andWhere('paymentItem.paymentItemBankBranchNumber LIKE :branchNumber', {
          branchNumber: `%${params.paymentItemBankBranchNumber}%`,
        });
      }

      if (params.paymentItemCheckNumber) {
        query.andWhere('paymentItem.paymentItemCheckNumber LIKE :checkNumber', {
          checkNumber: `%${params.paymentItemCheckNumber}%`,
        });
      }

      if (params.paymentItemNameOnCheck) {
        query.andWhere('paymentItem.paymentItemNameOnCheck LIKE :nameOnCheck', {
          nameOnCheck: `%${params.paymentItemNameOnCheck}%`,
        });
      }

      if (params.fromPaymentItemCheckDueDate) {
        query.andWhere('paymentItem.paymentItemCheckDueDate >= :fromDueDate', {
          fromDueDate: params.fromPaymentItemCheckDueDate,
        });
      }

      if (params.toPaymentItemCheckDueDate) {
        query.andWhere('paymentItem.paymentItemCheckDueDate <= :toDueDate', {
          toDueDate: params.toPaymentItemCheckDueDate,
        });
      }

      if (params.paymentItemCheckStatusIds) {
        const ids = StringUtils.toIntArray(params.paymentItemCheckStatusIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentItemCheckStatusId IN (:...checkStatusIds)', { checkStatusIds: ids });
        }
      }

      if (params.paymentItemReference) {
        query.andWhere('paymentItem.paymentItemReference LIKE :reference', {
          reference: `%${params.paymentItemReference}%`,
        });
      }

      if (params.paymentItemStatusIds) {
        const ids = StringUtils.toIntArray(params.paymentItemStatusIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.paymentItemStatusId IN (:...statusIds)', { statusIds: ids });
        }
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('paymentItem.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('paymentItem.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('paymentItem.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('paymentItem.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('paymentItem.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('paymentItem.paymentItemId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get payment items list: ${error.message}`);
    }
  }

  async getPaymentItemDetails(paymentItemId: number): Promise<PaymentItem | null> {
    try {
      return await this.paymentItemRepository.findOne({
        where: { paymentItemId },
      });
    } catch (error) {
      throw new Error(`Failed to get payment item details: ${error.message}`);
    }
  }

  async deletePaymentItem(paymentItemId: number): Promise<void> {
    try {
      await this.paymentItemRepository.delete(paymentItemId);
    } catch (error) {
      throw new Error(`Failed to delete payment item: ${error.message}`);
    }
  }
}