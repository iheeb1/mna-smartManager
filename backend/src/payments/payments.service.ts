import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Payment } from './payment.entity';
import { StringUtils } from 'src/shared/utils/string.utils';

export interface GetPaymentsListParams {
  paymentIds?: string;
  customerIds?: string;
  customerIdz?: string;
  customerName?: string;
  paymentTypeIds?: string;
  paymentStatusIds?: string;
  fromPaymentDate?: string;
  toPaymentDate?: string;
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
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async savePaymentDetails(paymentDto: any): Promise<Payment> {
    try {
      const payment = this.paymentRepository.create({
        ...(paymentDto.PaymentId && { paymentId: Number(paymentDto.PaymentId) }),
        customerId: paymentDto.CustomerId || paymentDto.customerId,
        paymentTypeId: paymentDto.PaymentTypeId || paymentDto.paymentTypeId,
        paymentDiscount: paymentDto.PaymentDiscount || paymentDto.paymentDiscount,
        paymentStatusId: paymentDto.PaymentStatusId || paymentDto.paymentStatusId,
        paymentNotes: paymentDto.PaymentNotes || paymentDto.paymentNotes,
        paymentDate: paymentDto.PaymentDate || paymentDto.paymentDate,
        createdBy: paymentDto.CreatedBy || paymentDto.createdBy,
        modifiedBy: paymentDto.ModifiedBy || paymentDto.modifiedBy,
      });
  
      const savedPayment: any = await this.paymentRepository.save(payment);
      return savedPayment;
    } catch (error) {
      throw new Error(`Failed to save payment: ${error.message}`);
    }
  }
  async getPaymentsList(params: GetPaymentsListParams): Promise<Payment[]> {
    try {
      const query = this.paymentRepository.createQueryBuilder('payment');

      if (params.paymentIds) {
        const ids = StringUtils.toIntArray(params.paymentIds);
        if (ids.length > 0) {
          query.andWhere('payment.paymentId IN (:...paymentIds)', { paymentIds: ids });
        }
      }

      if (params.customerIds) {
        const ids = StringUtils.toIntArray(params.customerIds);
        if (ids.length > 0) {
          query.andWhere('payment.customerId IN (:...customerIds)', { customerIds: ids });
        }
      }

      if (params.paymentTypeIds) {
        const ids = StringUtils.toIntArray(params.paymentTypeIds);
        if (ids.length > 0) {
          query.andWhere('payment.paymentTypeId IN (:...paymentTypeIds)', { paymentTypeIds: ids });
        }
      }

      if (params.paymentStatusIds) {
        const ids = StringUtils.toIntArray(params.paymentStatusIds);
        if (ids.length > 0) {
          query.andWhere('payment.paymentStatusId IN (:...paymentStatusIds)', { paymentStatusIds: ids });
        }
      }

      if (params.fromPaymentDate) {
        query.andWhere('payment.paymentDate >= :fromPaymentDate', {
          fromPaymentDate: params.fromPaymentDate,
        });
      }

      if (params.toPaymentDate) {
        query.andWhere('payment.paymentDate <= :toPaymentDate', {
          toPaymentDate: params.toPaymentDate,
        });
      }

      if (params.createdByIds) {
        const ids = StringUtils.toIntArray(params.createdByIds);
        if (ids.length > 0) {
          query.andWhere('payment.createdBy IN (:...createdByIds)', { createdByIds: ids });
        }
      }

      if (params.modifiedByIds) {
        const ids = StringUtils.toIntArray(params.modifiedByIds);
        if (ids.length > 0) {
          query.andWhere('payment.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
        }
      }

      if (params.fromCreatedDate) {
        query.andWhere('payment.createdDate >= :fromCreatedDate', {
          fromCreatedDate: params.fromCreatedDate,
        });
      }

      if (params.toCreatedDate) {
        query.andWhere('payment.createdDate <= :toCreatedDate', {
          toCreatedDate: params.toCreatedDate,
        });
      }

      if (params.fromModifiedDate) {
        query.andWhere('payment.modifiedDate >= :fromModifiedDate', {
          fromModifiedDate: params.fromModifiedDate,
        });
      }

      if (params.toModifiedDate) {
        query.andWhere('payment.modifiedDate <= :toModifiedDate', {
          toModifiedDate: params.toModifiedDate,
        });
      }

      if (params.itemsPerPage && params.pageNumber) {
        const skip = (params.pageNumber - 1) * params.itemsPerPage;
        query.skip(skip).take(params.itemsPerPage);
      }

      query.orderBy('payment.paymentId', 'DESC');

      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to get payments list: ${error.message}`);
    }
  }

  async getPaymentDetails(paymentId: number, includePaymentItems: boolean = false): Promise<Payment | null> {
    try {
      const query = this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.paymentId = :paymentId', { paymentId });

      if (includePaymentItems) {
        query.leftJoinAndSelect('payment.paymentItems', 'items');
      }

      return await query.getOne();
    } catch (error) {
      throw new Error(`Failed to get payment details: ${error.message}`);
    }
  }

  async deletePayment(paymentId: number): Promise<void> {
    try {
      await this.paymentRepository.delete(paymentId);
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
  }

  async deletePayments(paymentIds: string): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(paymentIds);
      if (ids.length > 0) {
        await this.paymentRepository.delete(ids);
      }
    } catch (error) {
      throw new Error(`Failed to delete payments: ${error.message}`);
    }
  }

  async changePaymentsStatus(paymentIds: string, statusId: number): Promise<void> {
    try {
      const ids = StringUtils.toIntArray(paymentIds);
      if (ids.length > 0) {
        await this.paymentRepository.update(
          { paymentId: In(ids) },
          { paymentStatusId: statusId },
        );
      }
    } catch (error) {
      throw new Error(`Failed to change payments status: ${error.message}`);
    }
  }
}