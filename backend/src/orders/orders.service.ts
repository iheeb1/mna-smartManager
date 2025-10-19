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
   * Save or update an order (matching C# Save method)
   */
  async save(orderDto: OrderDto): Promise<Order> {
    const isNew = !orderDto.orderId || orderDto.orderId <= 0;

    // Map DTO to entity
    const order = this.mapDtoToEntity(orderDto);

    // Save the order
    const savedOrder = await this.ordersRepository.save(order);

    // Handle order items if present
    if (savedOrder.orderId > 0 && orderDto.orderItems && orderDto.orderItems.length > 0) {
      // Filter items: keep existing items or new items with status != 99
      const filteredItems = orderDto.orderItems.filter(
        (item) => item.orderItemId > 0 || (item.orderItemId <= 0 && item.orderStatus?.lookUpId !== 99)
      );

      for (const itemDto of filteredItems) {
        if (itemDto.orderStatus?.lookUpId === 99) {
          // Delete item if status is 99
          if (itemDto.orderItemId > 0) {
            await this.orderItemsRepository.delete(itemDto.orderItemId);
          }
        } else {
          // Save or update item
          const orderItem = this.orderItemsRepository.create({
            ...itemDto,
            orderId: savedOrder.orderId,
            orderDate: new Date(),
          });
          await this.orderItemsRepository.save(orderItem);
        }
      }
    }

    // Return fresh data if updating
    if (!isNew) {
      return this.getOrderDetails(savedOrder.orderId, false);
    }

    return savedOrder;
  }

  /**
   * Get orders list with complex filtering (matching C# GetOrdersList)
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
            orderStatusId: 1, // Active status
          },
        });
      }
    }

    return this.mapEntitiesToDtos(orders);
  }

  /**
   * Get orders count (matching C# GetOrdersListCount)
   */
  async getOrdersListCount(params: GetOrdersListDto): Promise<number> {
    const queryBuilder = this.buildOrdersQuery(params);
    return queryBuilder.getCount();
  }

  /**
   * Get single order details (matching C# GetOrderDetails)
   */
  async getOrderDetails(orderId: number, includeOrderItems: boolean = false): Promise<any> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.orderId = :orderId', { orderId })
      .getOne();

    if (!order) {
      return null;
    }

    if (includeOrderItems) {
      order.orderItems = await this.orderItemsRepository.find({
        where: {
          orderId: order.orderId,
          orderStatusId: 1,
        },
      });
    }

    return this.mapEntityToDto(order);
  }

  /**
   * Delete single order (matching C# DeleteOrder)
   */
  async deleteOrder(orderId: number): Promise<void> {
    await this.ordersRepository.delete(orderId);
  }

  /**
   * Delete multiple orders (matching C# DeleteOrders)
   */
  async deleteOrders(orderIds: string): Promise<void> {
    const ids = StringUtils.toIntArray(orderIds);
    if (ids.length > 0) {
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
   * Build complex query with all filters (matching C# stored procedure)
   */
  private buildOrdersQuery(params: GetOrdersListDto): SelectQueryBuilder<Order> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');

    // OrderIds filter
    if (params.orderIds) {
      const ids = StringUtils.toIntArray(params.orderIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.orderId IN (:...orderIds)', { orderIds: ids });
      }
    }

    // CustomerIds filter
    if (params.customer?.customerIds) {
      const ids = StringUtils.toIntArray(params.customer.customerIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.customerId IN (:...customerIds)', { customerIds: ids });
      }
    }

    // CustomerIdz filter (ID number search)
    if (params.customer?.customerIdz) {
      queryBuilder.andWhere('order.customerId IN (SELECT customerId FROM mng_customers WHERE customerIdz LIKE :customerIdz)', {
        customerIdz: `%${params.customer.customerIdz}%`,
      });
    }

    // CustomerName filter
    if (params.customer?.customerName) {
      queryBuilder.andWhere('order.customerId IN (SELECT customerId FROM mng_customers WHERE customerName LIKE :customerName)', {
        customerName: `%${params.customer.customerName}%`,
      });
    }

    // CarIds filter
    if (params.car?.carIds) {
      const ids = StringUtils.toIntArray(params.car.carIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.driverId IN (:...carIds)', { carIds: ids });
      }
    }

    // CarNumber filter
    if (params.car?.carNumber) {
      queryBuilder.andWhere('order.driverId IN (SELECT carId FROM mng_cars WHERE carNumber LIKE :carNumber)', {
        carNumber: `%${params.car.carNumber}%`,
      });
    }

    // OrderTypeIds filter
    if (params.orderType?.productIds) {
      const ids = StringUtils.toIntArray(params.orderType.productIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.orderTypeId IN (:...orderTypeIds)', { orderTypeIds: ids });
      }
    }

    // Order date range
    if (params.orderDate?.fromDate && params.orderDate?.toDate) {
      queryBuilder.andWhere('order.orderDate BETWEEN :fromOrderDate AND :toOrderDate', {
        fromOrderDate: `${params.orderDate.fromDate} 00:00:00`,
        toOrderDate: `${params.orderDate.toDate} 23:59:59`,
      });
    }

    // OrderStatusIds filter
    if (params.orderStatus?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.orderStatus.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.orderStatusId IN (:...orderStatusIds)', { orderStatusIds: ids });
      }
    }

    // ShippingCertificateId filter
    if (params.shippingCertificateId) {
      queryBuilder.andWhere('order.shippingCertificateId LIKE :shippingCertificateId', {
        shippingCertificateId: `%${params.shippingCertificateId}%`,
      });
    }

    // FromLocationIds filter
    if (params.fromLocation?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.fromLocation.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.fromLocationId IN (:...fromLocationIds)', { fromLocationIds: ids });
      }
    }

    // ToLocationIds filter
    if (params.toLocation?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.toLocation.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.toLocationId IN (:...toLocationIds)', { toLocationIds: ids });
      }
    }

    // CreatedByIds filter
    if (params.createdBy?.userIds) {
      const ids = StringUtils.toIntArray(params.createdBy.userIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.createdBy IN (:...createdByIds)', { createdByIds: ids });
      }
    }

    // ModifiedByIds filter
    if (params.modifiedBy?.userIds) {
      const ids = StringUtils.toIntArray(params.modifiedBy.userIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('order.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
      }
    }

    // Created date range
    if (params.createdDate?.fromDate && params.createdDate?.toDate) {
      queryBuilder.andWhere('order.createdDate BETWEEN :fromCreatedDate AND :toCreatedDate', {
        fromCreatedDate: `${params.createdDate.fromDate} 00:00:00`,
        toCreatedDate: `${params.createdDate.toDate} 23:59:59`,
      });
    }

    // Modified date range
    if (params.modifiedDate?.fromDate && params.modifiedDate?.toDate) {
      queryBuilder.andWhere('order.modifiedDate BETWEEN :fromModifiedDate AND :toModifiedDate', {
        fromModifiedDate: `${params.modifiedDate.fromDate} 00:00:00`,
        toModifiedDate: `${params.modifiedDate.toDate} 23:59:59`,
      });
    }

    return queryBuilder;
  }

  /**
   * Map DTO to Entity for saving
   */
  private mapDtoToEntity(dto: OrderDto): Partial<Order> {
    return {
      orderId: dto.orderId,
      customerId: dto.customer?.customerId,
      driverId: dto.car?.carId,
      orderTypeId: dto.orderType?.productId,
      orderUnitsNumber: dto.orderUnitsNumber,
      orderPrice: dto.orderPrice?.itemPrice,
      orderVat: dto.orderPrice?.itemVat,
      orderIncludeVat: dto.orderPrice?.itemIncludeVat ? 1 : 0,
      orderTotalPriceWithOutVat: dto.orderPrice?.totalItemPriceWithOutVat,
      orderTotalPriceVat: dto.orderPrice?.totalItemPriceVat,
      orderTotalPriceWithVat: dto.orderPrice?.totalItemPriceWithVat,
      orderTotalCost: dto.orderPrice?.totalItemCost,
      orderStatusId: dto.orderStatus?.lookUpId,
      shippingCertificateId: dto.shippingCertificateId,
      meters: dto.meters,
      cubes: dto.cubes,
      fromLocationId: dto.fromLocation?.lookUpId,
      toLocationId: dto.toLocation?.lookUpId,
      orderNotes: dto.orderNotes,
      orderDate: dto.orderDate?.fullDate || new Date(),
      createdBy: dto.createdBy?.userId,
      modifiedBy: dto.modifiedBy?.userId,
    };
  }

  /**
   * Map Entity to DTO for response
   */
  private mapEntityToDto(entity: Order): any {
    return {
      orderId: entity.orderId,
      customer: {
        customerId: entity.customerId,
      },
      car: {
        carId: entity.driverId,
      },
      orderType: {
        productId: entity.orderTypeId,
      },
      orderDate: {
        fullDate: entity.orderDate,
        shortDate: entity.orderDate ? this.formatDate(entity.orderDate) : '',
      },
      orderUnitsNumber: entity.orderUnitsNumber,
      orderPrice: {
        itemPrice: entity.orderPrice,
        itemVat: entity.orderVat,
        itemIncludeVat: entity.orderIncludeVat === 1,
        totalItemPriceWithOutVat: entity.orderTotalPriceWithOutVat,
        totalItemPriceVat: entity.orderTotalPriceVat,
        totalItemPriceWithVat: entity.orderTotalPriceWithVat,
        totalItemCost: entity.orderTotalCost,
      },
      orderStatus: {
        lookUpId: entity.orderStatusId,
      },
      orderNotes: entity.orderNotes,
      fromLocation: {
        lookUpId: entity.fromLocationId,
      },
      toLocation: {
        lookUpId: entity.toLocationId,
      },
      shippingCertificateId: entity.shippingCertificateId,
      meters: entity.meters,
      cubes: entity.cubes,
      createdBy: {
        userId: entity.createdBy,
      },
      modifiedBy: {
        userId: entity.modifiedBy,
      },
      createdDate: {
        fullDate: entity.createdDate,
        shortDate: this.formatDate(entity.createdDate),
      },
      modifiedDate: {
        fullDate: entity.modifiedDate,
        shortDate: this.formatDate(entity.modifiedDate),
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