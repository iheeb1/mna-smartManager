import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { GetOrdersListDto, OrderDto } from './dto/order.dto';
import { StringUtils } from '../shared/utils/string.utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  /**
   * Save or update an order - FIXED to handle flat structure from frontend
   */
  async save(orderDto: any): Promise<Order> {
    const isNew = !orderDto.orderId || orderDto.orderId <= 0;

    console.log('Received orderDto:', JSON.stringify(orderDto, null, 2));

    // Create order entity from flat structure
    const orderEntity: Partial<Order> = {
      orderId: orderDto.orderId || undefined,
      customerId: orderDto.customerId,
      driverId: orderDto.driverId || null,
      locationAddress: orderDto.locationAddress || null,
      orderNotes: orderDto.orderNotes || null,
      orderDate: orderDto.orderDate ? new Date(orderDto.orderDate) : new Date(),
      orderIncludeVat: orderDto.orderIncludeVat || 0,
      orderTotalPriceWithOutVat: orderDto.orderTotalPriceWithOutVat || 0,
      orderTotalPriceVat: orderDto.orderTotalPriceVat || 0,
      orderTotalPriceWithVat: orderDto.orderTotalPriceWithVat || 0,
      orderStatusId: orderDto.orderStatusId || 1,
      createdBy: orderDto.createdBy || 1,
      modifiedBy: orderDto.modifiedBy || 1,
    };

    console.log('Saving order entity:', orderEntity);

    // Save the order
    const savedOrder = await this.ordersRepository.save(orderEntity);

    console.log('Saved order:', savedOrder);

    // Handle order items if present
    if (savedOrder.orderId && orderDto.orderItems && orderDto.orderItems.length > 0) {
      console.log('Processing order items...');
      
      for (const itemDto of orderDto.orderItems) {
        const orderItemEntity: Partial<OrderItem> = {
          orderItemId: itemDto.orderItemId > 0 ? itemDto.orderItemId : undefined,
          orderId: savedOrder.orderId,
          orderTypeId: itemDto.orderTypeId,
          orderUnitsNumber: itemDto.orderUnitsNumber || 0,
          orderPrice: itemDto.orderPrice || 0,
          orderVat: itemDto.orderVat || 0,
          orderIncludeVat: itemDto.orderIncludeVat || 0,
          orderTotalPriceWithOutVat: itemDto.orderTotalPriceWithOutVat || 0,
          orderTotalPriceVat: itemDto.orderTotalPriceVat || 0,
          orderTotalPriceWithVat: itemDto.orderTotalPriceWithVat || 0,
          orderCost: itemDto.orderCost || 0,
          orderTotalCost: itemDto.orderTotalCost || 0,
          orderStatusId: itemDto.orderStatusId || 1,
          orderDate: savedOrder.orderDate,
          createdBy: orderDto.createdBy || 1,
          modifiedBy: orderDto.modifiedBy || 1,
        };

        console.log('Saving order item:', orderItemEntity);
        await this.orderItemsRepository.save(orderItemEntity);
      }
    }

    // Return fresh data with items
    return this.getOrderDetails(savedOrder.orderId, true);
  }

  /**
   * Get orders list with complex filtering
   */
  async getOrdersList(params: GetOrdersListDto): Promise<any[]> {
    const queryBuilder = this.buildOrdersQuery(params);

    // Apply pagination
    const itemsPerPage = params.itemsPerPage || 30;
    const pageNumber = params.pageNumber || 0;
    queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage);

    const orders = await queryBuilder.getMany();

    // Load order items if requested
    if (params.includeOrderItems) {
      for (const order of orders) {
        order.orderItems = await this.orderItemsRepository.find({
          where: {
            orderId: order.orderId,
            orderStatusId: 1,
          },
        });
      }
    }

    return this.mapEntitiesToDtos(orders);
  }

  /**
   * Get orders count
   */
  async getOrdersListCount(params: GetOrdersListDto): Promise<number> {
    const queryBuilder = this.buildOrdersQuery(params);
    return queryBuilder.getCount();
  }

  /**
   * Get single order details - FIXED to return proper structure
   */
  async getOrderDetails(orderId: number, includeOrderItems: boolean = false): Promise<any> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('customer', 'c', 'order.customerId = c.customerId')
      .leftJoinAndSelect('car', 'car', 'order.driverId = car.carId')
      .where('order.orderId = :orderId', { orderId })
      .getOne();

    if (!order) {
      return null;
    }

    const orderDto: any = {
      orderId: order.orderId,
      customerId: order.customerId,
      carId: order.driverId,
      locationAddress: order.locationAddress,
      orderNotes: order.orderNotes,
      contractNumber: order.shippingCertificateId,
      orderDate: {
        fullDate: order.orderDate,
        shortDate: this.formatDate(order.orderDate),
      },
      orderPrice: {
        itemIncludeVat: order.orderIncludeVat === 1,
        totalItemPriceWithOutVat: order.orderTotalPriceWithOutVat,
        totalItemPriceVat: order.orderTotalPriceVat,
        totalItemPriceWithVat: order.orderTotalPriceWithVat,
      },
      orderStatus: {
        lookUpId: order.orderStatusId,
      },
    };

    if (includeOrderItems) {
      const items = await this.orderItemsRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect('product', 'p', 'item.orderTypeId = p.productId')
        .where('item.orderId = :orderId', { orderId })
        .andWhere('item.orderStatusId = 1')
        .getRawAndEntities();

      orderDto.orderItems = items.entities.map((item, index) => {
        const raw = items.raw[index];
        return {
          orderItemId: item.orderItemId,
          productId: item.orderTypeId,
          productCode: raw?.p_productCode || '',
          productName: raw?.p_productName || '',
          quantity: item.orderUnitsNumber,
          price: item.orderPrice,
          totalBeforeTax: item.orderTotalPriceWithOutVat,
          taxAmount: item.orderTotalPriceVat,
          totalWithTax: item.orderTotalPriceWithVat,
        };
      });
    }

    return orderDto;
  }

  /**
   * Delete single order
   */
  async deleteOrder(orderId: number): Promise<void> {
    // Delete order items first
    await this.orderItemsRepository.delete({ orderId });
    // Then delete order
    await this.ordersRepository.delete(orderId);
  }

  /**
   * Delete multiple orders (matching C# DeleteOrders)
   */
  async deleteOrders(orderIds: string): Promise<void> {
    const ids = StringUtils.toIntArray(orderIds);
    if (ids.length > 0) {
      // Delete order items first
      await this.orderItemsRepository
        .createQueryBuilder()
        .delete()
        .where('orderId IN (:...ids)', { ids })
        .execute();
      // Then delete orders
      await this.ordersRepository.delete(ids);
    }
  }

  /**
   * Change status of multiple orders (matching C# ChangeOrdersStatus)
   */
  async changeOrdersStatus(orderIds: string, statusId: number): Promise<void> {
    const ids = StringUtils.toIntArray(orderIds);
    if (ids.length > 0) {
      await this.ordersRepository
        .createQueryBuilder()
        .update(Order)
        .set({ orderStatusId: statusId })
        .whereInIds(ids)
        .execute();
    }
  }

  /**
   * Build complex query with all filters
   */
  private buildOrdersQuery(params: GetOrdersListDto): SelectQueryBuilder<Order> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');

    if (params.orderIds) {
      const ids = StringUtils.toIntArray(params.orderIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.orderId IN (:...orderIds)', { orderIds: ids });
      }
    }

    if (params.customer?.customerIds) {
      const ids = StringUtils.toIntArray(params.customer.customerIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.customerId IN (:...customerIds)', { customerIds: ids });
      }
    }

    if (params.orderDate?.fromDate && params.orderDate?.toDate) {
      queryBuilder.andWhere('order.orderDate BETWEEN :fromOrderDate AND :toOrderDate', {
        fromOrderDate: `${params.orderDate.fromDate} 00:00:00`,
        toOrderDate: `${params.orderDate.toDate} 23:59:59`,
      });
    }

    return queryBuilder;
  }

  /**
   * Map Entity to DTO for response
   */
  private mapEntityToDto(entity: Order): any {
    return {
      orderId: entity.orderId,
      customerId: entity.customerId,
      carId: entity.driverId,
      locationAddress: entity.locationAddress,
      orderNotes: entity.orderNotes,
      totalBeforeTax: entity.orderTotalPriceWithOutVat || 0,
      totalTax: entity.orderTotalPriceVat || 0,
      totalWithTax: entity.orderTotalPriceWithVat || 0,
      orderDate: {
        fullDate: entity.orderDate,
        shortDate: this.formatDate(entity.orderDate),
      },
      orderItems: entity.orderItems || [],
    };
  }

  private mapEntitiesToDtos(entities: Order[]): any[] {
    return entities.map((entity) => this.mapEntityToDto(entity));
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}