import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Payment } from '../payments/payment.entity';
import { PaymentItem } from '../payment-items/payment-item.entity';
import { Backup } from '../backups/backup.entity';

export interface DashboardTotalsDto {
  customerIds?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DashboardTotalsResponse {
  totalOrders: number;
  totalPayments: number;
  totalExpenses: number;
  totalAccount: number;
}

export interface BarChartDataPoint {
  month: string;
  totals: {
    totalIncomes: number;
    totalOutcomes: number;
    totalProfit: number;
  };
}

export interface ClearedCheckDto {
  paymentItemMethodIds?: string;
  paymentItemCheckStatusIds?: string;
  paymentItemBankIds?: string;
  fromPaymentItemCheckDueDate?: string;
  toPaymentItemCheckDueDate?: string;
  customerIds?: string;
  fromDate?: string;
  toDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

export interface AlertsAndClaimsDto {
  customerIds?: string;
  fromDate?: string;
  toDate?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentItem)
    private paymentItemRepository: Repository<PaymentItem>,
    @InjectRepository(Backup)
    private backupRepository: Repository<Backup>,
  ) {}

  /**
   * Get Dashboard Totals
   */
  async getDashboardTotals(dto: DashboardTotalsDto): Promise<DashboardTotalsResponse> {
    const totalOrders = await this.getDashboardTotalOrders(
      dto.customerIds,
      dto.fromDate,
      dto.toDate,
    );
    const totalPayments = await this.getDashboardTotalPayments(
      dto.customerIds,
      dto.fromDate,
      dto.toDate,
    );
    const totalExpenses = await this.getDashboardTotalExpenses(
      dto.customerIds,
      dto.fromDate,
      dto.toDate,
    );
    const totalAccount = totalPayments - totalOrders;

    return {
      totalOrders,
      totalPayments,
      totalExpenses,
      totalAccount,
    };
  }

  /**
   * Get Dashboard Total Orders (from Orders or related table)
   */
  private async getDashboardTotalOrders(
    customerIds?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<number> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.paymentAmount), 0)', 'total')
      .where('payment.paymentStatusId = :statusId', { statusId: 1 })
      .andWhere('payment.paymentTypeId = :typeId', { typeId: 2 }); // Assuming type 2 is orders

    if (customerIds) {
      const ids = customerIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('payment.customerId IN (:...ids)', { ids });
    }

    if (fromDate) {
      query.andWhere('payment.paymentDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      query.andWhere('payment.paymentDate <= :toDate', { toDate });
    }

    const result = await query.getRawOne();
    return parseFloat(result?.total || 0);
  }

  /**
   * Get Dashboard Total Payments
   */
  private async getDashboardTotalPayments(
    customerIds?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<number> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.paymentAmount), 0)', 'total')
      .where('payment.paymentStatusId = :statusId', { statusId: 1 })
      .andWhere('payment.paymentTypeId = :typeId', { typeId: 1 }); // Assuming type 1 is income

    if (customerIds) {
      const ids = customerIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('payment.customerId IN (:...ids)', { ids });
    }

    if (fromDate) {
      query.andWhere('payment.paymentDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      query.andWhere('payment.paymentDate <= :toDate', { toDate });
    }

    const result = await query.getRawOne();
    return parseFloat(result?.total || 0);
  }

  /**
   * Get Dashboard Total Expenses
   */
  private async getDashboardTotalExpenses(
    customerIds?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<number> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.paymentAmount), 0)', 'total')
      .where('payment.paymentStatusId = :statusId', { statusId: 1 })
      .andWhere('payment.paymentTypeId = :typeId', { typeId: 3 }); // Assuming type 3 is expenses

    if (customerIds) {
      const ids = customerIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('payment.customerId IN (:...ids)', { ids });
    }

    if (fromDate) {
      query.andWhere('payment.paymentDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      query.andWhere('payment.paymentDate <= :toDate', { toDate });
    }

    const result = await query.getRawOne();
    return parseFloat(result?.total || 0);
  }

  /**
   * Get Dashboard Bar Chart Data
   */
  async getDashboardTotalsBarChart(dto: DashboardTotalsDto): Promise<BarChartDataPoint[]> {
    if (!dto.fromDate || !dto.toDate) {
      return [];
    }

    const date1 = new Date(dto.fromDate);
    const date2 = new Date(dto.toDate);
    
    const monthDiff = Math.abs(
      (date1.getFullYear() - date2.getFullYear()) * 12 + date1.getMonth() - date2.getMonth(),
    );

    const barChartResult: BarChartDataPoint[] = [];
    let currentDate = new Date(date2); // Start from toDate (most recent)

    for (let i = 0; i <= monthDiff; i++) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const totalIncomes = await this.getDashboardTotalPayments(
        dto.customerIds,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
      );

      const totalOutcomes = await this.getDashboardTotalExpenses(
        dto.customerIds,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
      );

      const totalProfit = totalIncomes - totalOutcomes;

      barChartResult.push({
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`,
        totals: {
          totalIncomes,
          totalOutcomes,
          totalProfit,
        },
      });

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return barChartResult.reverse();
  }

  /**
   * Get Cleared Checks List
   */
  async getClearedChecksList(dto: ClearedCheckDto) {
    const query = this.paymentItemRepository
      .createQueryBuilder('paymentItem')
      .leftJoinAndSelect('paymentItem.payment', 'payment')
      .leftJoinAndSelect('payment.customer', 'customer')
      .where('paymentItem.paymentItemStatusId = :statusId', { statusId: 1 })
      .andWhere('paymentItem.paymentItemCheckStatusId = :checkStatusId', { checkStatusId: 2 }); // Cleared status

    // Apply filters
    if (dto.paymentItemMethodIds) {
      const ids = dto.paymentItemMethodIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('paymentItem.paymentItemMethodId IN (:...ids)', { ids });
    }

    if (dto.paymentItemCheckStatusIds) {
      const ids = dto.paymentItemCheckStatusIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('paymentItem.paymentItemCheckStatusId IN (:...ids)', { ids });
    }

    if (dto.paymentItemBankIds) {
      const ids = dto.paymentItemBankIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('paymentItem.paymentItemBankId IN (:...ids)', { ids });
    }

    if (dto.fromPaymentItemCheckDueDate) {
      query.andWhere('paymentItem.paymentItemCheckDueDate >= :fromDate', {
        fromDate: dto.fromPaymentItemCheckDueDate,
      });
    }

    if (dto.toPaymentItemCheckDueDate) {
      query.andWhere('paymentItem.paymentItemCheckDueDate <= :toDate', {
        toDate: dto.toPaymentItemCheckDueDate,
      });
    }

    if (dto.customerIds) {
      const ids = dto.customerIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('payment.customerId IN (:...ids)', { ids });
    }

    if (dto.fromDate) {
      query.andWhere('payment.paymentDate >= :fromDate', { fromDate: dto.fromDate });
    }

    if (dto.toDate) {
      query.andWhere('payment.paymentDate <= :toDate', { toDate: dto.toDate });
    }

    query.orderBy('paymentItem.createdDate', 'DESC');

    // Pagination
    if (dto.itemsPerPage && dto.pageNumber) {
      const skip = (dto.pageNumber - 1) * dto.itemsPerPage;
      query.skip(skip).take(dto.itemsPerPage);
    }

    const checks = await query.getMany();

    return checks.map((item) => ({
      id: item.paymentItemId.toString(),
      date: this.formatDate(item.createdDate),
      collectionDate: this.formatDate(item.paymentItemCheckDueDate),
      customerName: item.payment?.customer?.customerName || 'N/A',
      bank: this.getBankName(item.paymentItemBankId),
      accountNumber: item.paymentItemBankAccountNumber || 'N/A',
      checkNumber: item.paymentItemCheckNumber || 'N/A',
      paymentDate: this.formatDate(item.paymentItemCheckDueDate),
      notes: item.paymentItemNotes || '',
      amount: item.paymentItemAmount?.toFixed(2) || '0.00',
      description: item.paymentItemReference || item.payment?.customer?.customerName || 'N/A',
    }));
  }

  /**
   * Get Alerts and Claims
   */
  async getAlertsAndClaims(dto: AlertsAndClaimsDto) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customer', 'customer')
      .where('payment.paymentStatusId = :statusId', { statusId: 1 })
      .orderBy('payment.paymentDate', 'DESC');

    if (dto.customerIds) {
      const ids = dto.customerIds.split(',').map((id) => parseInt(id.trim()));
      query.andWhere('payment.customerId IN (:...ids)', { ids });
    }

    if (dto.fromDate) {
      query.andWhere('payment.paymentDate >= :fromDate', { fromDate: dto.fromDate });
    }

    if (dto.toDate) {
      query.andWhere('payment.paymentDate <= :toDate', { toDate: dto.toDate });
    }

    // Pagination
    if (dto.itemsPerPage && dto.pageNumber) {
      const skip = (dto.pageNumber - 1) * dto.itemsPerPage;
      query.skip(skip).take(dto.itemsPerPage);
    }

    const alerts = await query.getMany();

    return alerts.map((payment) => ({
      date: this.formatDate(payment.paymentDate),
      description: payment.customer?.customerName || 'N/A',
    }));
  }

  /**
   * Get System Backups
   */
  async getSystemBackups(itemsPerPage?: number, pageNumber?: number) {
    const query = this.backupRepository
      .createQueryBuilder('backup')
      .orderBy('backup.createdDate', 'DESC');

    if (itemsPerPage && pageNumber) {
      const skip = (pageNumber - 1) * itemsPerPage;
      query.skip(skip).take(itemsPerPage);
    }

    const backups = await query.getMany();

    return backups.map((backup) => ({
      date: this.formatDate(backup.createdDate),
      time: this.formatTime(backup.createdDate),
      createdBy: 'مدير النظام', // You can join with users table if needed
    }));
  }

  /**
   * Helper: Format Date
   */
  private formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  /**
   * Helper: Format Time
   */
  private formatTime(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Helper: Get Bank Name by ID
   */
  private getBankName(bankId: number): string {
    const banks = {
      1: 'בנק לאומי',
      2: 'בנק דיסקונט',
      3: 'בנק הפועלים',
      4: 'בנק מזרחי',
    };
    return banks[bankId] || 'N/A';
  }
}