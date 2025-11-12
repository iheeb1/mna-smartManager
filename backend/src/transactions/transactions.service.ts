import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { OrderItem } from 'src/order-items/order-item.entity';
import { Order } from 'src/orders/order.entity';
import { PaymentItem } from 'src/payment-items/payment-item.entity';
import { Payment } from 'src/payments/payment.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { TransactionSearchDto, TransactionListResponseDto, TransactionResponseDto, GroupByType, GroupedTransactionResponseDto } from './dto/transaction.dto';
import { TransactionType } from './transactions.entity';


@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentItem)
    private paymentItemRepository: Repository<PaymentItem>,
  ) {}

  async getGroupedTransactionsList(searchDto: TransactionSearchDto): Promise<TransactionListResponseDto> {
    try {
      const { customerId, carCarNumber, fromDate, toDate, itemsPerPage, pageNumber, includeItems, groupBy } = searchDto;

      const [orders, payments] = await Promise.all([
        this.getOrders(customerId, carCarNumber, fromDate, toDate, itemsPerPage, pageNumber, includeItems),
        this.getPayments(customerId, fromDate, toDate, itemsPerPage, pageNumber, includeItems)
      ]);

      const transactions: TransactionResponseDto[] = [
        ...this.transformOrders(orders),
        ...this.transformPayments(payments)
      ];

      transactions.sort((a, b) => {
        if (a.transactionDate !== b.transactionDate) {
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        }
        if (a.transactionTypeId !== b.transactionTypeId) return a.transactionTypeId - b.transactionTypeId;
        return a.transactionId - b.transactionId;
      });

      const rowsList = this.groupTransactions(transactions, groupBy);

      return { totalLength: transactions.length, rowsList };
    } catch (error) {
      this.logger.error(`Error in getGroupedTransactionsList: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getDetailedTransactionsList(searchDto: TransactionSearchDto): Promise<TransactionListResponseDto> {
    try {
      const { customerId, fromDate, toDate, itemsPerPage, pageNumber, groupBy } = searchDto;

      const [orderItems, paymentItems] = await Promise.all([
        this.getOrderItems(customerId, fromDate, toDate, itemsPerPage, pageNumber),
        this.getPaymentItems(customerId, fromDate, toDate, itemsPerPage, pageNumber)
      ]);

      const transactions: TransactionResponseDto[] = [
        ...this.transformOrderItems(orderItems),
        ...this.transformPaymentItems(paymentItems)
      ];

      transactions.sort((a, b) => {
        if (a.transactionDate !== b.transactionDate) {
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        }
        if (a.transactionTypeId !== b.transactionTypeId) return a.transactionTypeId - b.transactionTypeId;
        return a.transactionId - b.transactionId;
      });

      const rowsList = this.groupTransactions(transactions, groupBy);

      return { totalLength: transactions.length, rowsList };
    } catch (error) {
      this.logger.error(`Error in getDetailedTransactionsList: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getOrders(customerId?: number, carCarNumber?: string, fromDate?: string, toDate?: string, itemsPerPage: number = 30, pageNumber: number = 0, includeItems: boolean = false): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (includeItems) queryBuilder.leftJoinAndSelect('order.orderItems', 'orderItems');
    if (customerId && customerId > 0) queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    if (carCarNumber) queryBuilder.andWhere('order.carNumber = :carCarNumber', { carCarNumber });
    if (fromDate) queryBuilder.andWhere('order.orderDate >= :fromDate', { fromDate });
    if (toDate) queryBuilder.andWhere('order.orderDate <= :toDate', { toDate });

    return await queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage).orderBy('order.orderDate', 'ASC').getMany();
  }

  private async getPayments(customerId?: number, fromDate?: string, toDate?: string, itemsPerPage: number = 30, pageNumber: number = 0, includeItems: boolean = false): Promise<Payment[]> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customer', 'customer');

    if (includeItems) queryBuilder.leftJoinAndSelect('payment.paymentItems', 'paymentItems');
    if (customerId && customerId > 0) queryBuilder.andWhere('payment.customerId = :customerId', { customerId });
    if (fromDate) queryBuilder.andWhere('payment.paymentDate >= :fromDate', { fromDate });
    if (toDate) queryBuilder.andWhere('payment.paymentDate <= :toDate', { toDate });

    return await queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage).orderBy('payment.paymentDate', 'ASC').getMany();
  }

  private async getOrderItems(customerId?: number, fromDate?: string, toDate?: string, itemsPerPage: number = 30, pageNumber: number = 0): Promise<OrderItem[]> {
    const queryBuilder = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (customerId && customerId > 0) queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    if (fromDate) queryBuilder.andWhere('orderItem.orderDate >= :fromDate', { fromDate });
    if (toDate) queryBuilder.andWhere('orderItem.orderDate <= :toDate', { toDate });

    return await queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage).orderBy('orderItem.orderDate', 'ASC').getMany();
  }

  private async getPaymentItems(customerId?: number, fromDate?: string, toDate?: string, itemsPerPage: number = 30, pageNumber: number = 0): Promise<PaymentItem[]> {
    const queryBuilder = this.paymentItemRepository
      .createQueryBuilder('paymentItem')
      .leftJoinAndSelect('paymentItem.payment', 'payment')
      .leftJoinAndSelect('payment.customer', 'customer');

    if (customerId && customerId > 0) queryBuilder.andWhere('payment.customerId = :customerId', { customerId });
    if (fromDate) queryBuilder.andWhere('payment.paymentDate >= :fromDate', { fromDate });
    if (toDate) queryBuilder.andWhere('payment.paymentDate <= :toDate', { toDate });

    return await queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage).orderBy('payment.paymentDate', 'ASC').getMany();
  }

  private transformOrders(orders: Order[]): TransactionResponseDto[] {
    return orders.map(order => ({
      transactionId: order.orderId,
      customerId: order.customerId,
      customerName: order['customer']?.customerName || '',
      carNumber: order['car']?.carNumber,
      transactionDate: order.orderDate.toISOString(),
      shortDate: format(new Date(order.orderDate), 'dd/MM/yy'),
      transactionType: TransactionType.ORDER,
      transactionTypeId: 1,
      transactionOrderAmount: Number(order.orderTotalPriceWithVat || 0),
      transactionPaymentAmount: 0,
      transactionTotal: Number(order.orderTotalPriceWithVat || 0),
      transactionData: order
    }));
  }

  private transformPayments(payments: Payment[]): TransactionResponseDto[] {
    return payments.map(payment => {
      let totalPayments = Number(payment.paymentAmount || 0);
      if (payment.paymentItems && payment.paymentItems.length > 0) {
        totalPayments = payment.paymentItems.reduce((sum, item) => sum + Number(item.paymentItemAmount || 0), 0);
      }
      return {
        transactionId: payment.paymentId,
        customerId: payment.customerId,
        customerName: payment.customer?.customerName || '',
        transactionDate: payment.paymentDate.toISOString(),
        shortDate: format(new Date(payment.paymentDate), 'dd/MM/yy'),
        transactionType: TransactionType.PAYMENT,
        transactionTypeId: 2,
        transactionOrderAmount: 0,
        transactionPaymentAmount: totalPayments,
        transactionTotal: totalPayments,
        transactionData: payment
      };
    });
  }

  private transformOrderItems(orderItems: OrderItem[]): TransactionResponseDto[] {
    return orderItems.map(item => {
      const order = item['order'];
      return {
        transactionId: item.orderItemId,
        customerId: order?.customerId || 0,
        customerName: order?.['customer']?.customerName || '',
        transactionDate: item.orderDate?.toISOString() || new Date().toISOString(),
        shortDate: format(new Date(item.orderDate || new Date()), 'dd/MM/yy'),
        transactionType: TransactionType.ORDER_DETAILED,
        transactionTypeId: 3,
        transactionOrderAmount: Number(item.orderTotalPriceWithVat || 0),
        transactionPaymentAmount: 0,
        transactionTotal: Number(item.orderTotalPriceWithVat || 0),
        transactionData: item
      };
    });
  }

  private transformPaymentItems(paymentItems: PaymentItem[]): TransactionResponseDto[] {
    return paymentItems.map(item => {
      const payment = item['payment'];
      return {
        transactionId: item.paymentItemId,
        customerId: payment?.customerId || 0,
        customerName: payment?.['customer']?.customerName || '',
        transactionDate: payment?.paymentDate?.toISOString() || new Date().toISOString(),
        shortDate: format(new Date(payment?.paymentDate || new Date()), 'dd/MM/yy'),
        transactionType: TransactionType.PAYMENT_DETAILED,
        transactionTypeId: 4,
        transactionOrderAmount: 0,
        transactionPaymentAmount: Number(item.paymentItemAmount || 0),
        transactionTotal: Number(item.paymentItemAmount || 0),
        transactionData: item
      };
    });
  }

  private groupTransactions(transactions: TransactionResponseDto[], groupBy: GroupByType | GroupByType.NONE = GroupByType.NONE): TransactionResponseDto[] | GroupedTransactionResponseDto[] {
    if (!groupBy) return transactions;

    const grouped = new Map<string | number, TransactionResponseDto[]>();

    transactions.forEach(transaction => {
      let key: string | number;
      switch (groupBy) {
        case GroupByType.DATE: key = transaction.shortDate; break;
        case GroupByType.CUSTOMER: key = transaction.customerName; break;
        case GroupByType.TRANSACTION_TYPE: key = transaction.transactionType; break;
        default: key = 0;
      }
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(transaction);
    });

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => {
        if (a.transactionDate !== b.transactionDate) return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        if (a.transactionTypeId !== b.transactionTypeId) return a.transactionTypeId - b.transactionTypeId;
        return a.transactionId - b.transactionId;
      })
    }));
  }
}