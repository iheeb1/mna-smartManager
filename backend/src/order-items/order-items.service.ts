import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { GetOrderItemsListDto, OrderItemDto } from './dto/order-item.dto';
import { StringUtils } from '../shared/utils/string.utils';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  /**
   * Save or update an order item (matching C# Save method)
   */
  async save(orderItemDto: OrderItemDto): Promise<OrderItem> {
    const isNew = !orderItemDto.orderItemId || orderItemDto.orderItemId <= 0;

    // Map DTO to entity
    const orderItem = this.mapDtoToEntity(orderItemDto);

    // Save the order item
    const savedOrderItem = await this.orderItemsRepository.save(orderItem);

    // Return fresh data if updating
    if (!isNew) {
      return this.getOrderItemDetails(savedOrderItem.orderItemId);
    }

    return savedOrderItem;
  }

  /**
   * Get order items list with complex filtering (matching C# GetOrderItemsList)
   */
  async getOrderItemsList(params: GetOrderItemsListDto): Promise<any[]> {
    const queryBuilder = this.buildOrderItemsQuery(params);

    // Apply pagination
    const itemsPerPage = params.itemsPerPage || 30;
    const pageNumber = params.pageNumber || 0;
    queryBuilder.skip(pageNumber * itemsPerPage).take(itemsPerPage);

    const orderItems = await queryBuilder.getMany();
    return this.mapEntitiesToDtos(orderItems);
  }

  /**
   * Get order items count (matching C# GetOrderItemsListCount)
   */
  async getOrderItemsListCount(params: GetOrderItemsListDto): Promise<number> {
    const queryBuilder = this.buildOrderItemsQuery(params);
    return queryBuilder.getCount();
  }

  /**
   * Get single order item details (matching C# GetOrderItemDetails)
   */
  async getOrderItemDetails(orderItemId: number): Promise<any> {
    const orderItem = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .where('orderItem.orderItemId = :orderItemId', { orderItemId })
      .getOne();

    if (!orderItem) {
      return null;
    }

    return this.mapEntityToDto(orderItem);
  }

  /**
   * Get last order item details for customer and order type (matching C# GetLastOrderItemDetails)
   */
  async getLastOrderItemDetails(customerId: number, orderTypeId: number): Promise<any> {
    const orderItem = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .leftJoin('mng_orders', 'order', 'orderItem.orderId = order.OrderId')
      .where('order.CustomerId = :customerId', { customerId })
      .andWhere('orderItem.orderTypeId = :orderTypeId', { orderTypeId })
      .orderBy('orderItem.orderItemId', 'DESC')
      .getOne();

    if (!orderItem) {
      return null;
    }

    return this.mapEntityToDto(orderItem);
  }

  /**
   * Delete single order item (matching C# DeleteOrderItem)
   */
  async deleteOrderItem(orderItemId: number): Promise<void> {
    await this.orderItemsRepository.delete(orderItemId);
  }

  /**
   * Build complex query with all filters (matching C# stored procedure)
   */
  private buildOrderItemsQuery(params: GetOrderItemsListDto): SelectQueryBuilder<OrderItem> {
    const queryBuilder = this.orderItemsRepository.createQueryBuilder('orderItem');

    // OrderItemIds filter
    if (params.orderItemIds) {
      const ids = StringUtils.toIntArray(params.orderItemIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.orderItemId IN (:...orderItemIds)', { orderItemIds: ids });
      }
    }

    // OrderIds filter
    if (params.order?.orderIds) {
      const ids = StringUtils.toIntArray(params.order.orderIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.orderId IN (:...orderIds)', { orderIds: ids });
      }
    }

    // CustomerIds filter (need to join with orders table)
    if (params.customer?.customerIds) {
      const ids = StringUtils.toIntArray(params.customer.customerIds);
      if (ids.length > 0) {
        queryBuilder.andWhere(
          'orderItem.orderId IN (SELECT orderId FROM mng_orders WHERE customerId IN (:...customerIds))',
          { customerIds: ids }
        );
      }
    }

    // CustomerIdz filter
    if (params.customer?.customerIdz) {
      queryBuilder.andWhere(
        'orderItem.orderId IN (SELECT o.orderId FROM mng_orders o INNER JOIN mng_customers c ON o.customerId = c.customerId WHERE c.customerIdz LIKE :customerIdz)',
        { customerIdz: `%${params.customer.customerIdz}%` }
      );
    }

    // CustomerName filter
    if (params.customer?.customerName) {
      queryBuilder.andWhere(
        'orderItem.orderId IN (SELECT o.orderId FROM mng_orders o INNER JOIN mng_customers c ON o.customerId = c.customerId WHERE c.customerName LIKE :customerName)',
        { customerName: `%${params.customer.customerName}%` }
      );
    }

    // AgentIds filter
    if (params.agent?.customerIds) {
      const ids = StringUtils.toIntArray(params.agent.customerIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.agentId IN (:...agentIds)', { agentIds: ids });
      }
    }

    // CarIds filter (from order)
    if (params.car?.carIds) {
      const ids = StringUtils.toIntArray(params.car.carIds);
      if (ids.length > 0) {
        queryBuilder.andWhere(
          'orderItem.orderId IN (SELECT orderId FROM mng_orders WHERE driverId IN (:...carIds))',
          { carIds: ids }
        );
      }
    }

    // CarNumber filter
    if (params.car?.carNumber) {
      queryBuilder.andWhere(
        'orderItem.orderId IN (SELECT o.orderId FROM mng_orders o INNER JOIN mng_cars c ON o.driverId = c.carId WHERE c.carNumber LIKE :carNumber)',
        { carNumber: `%${params.car.carNumber}%` }
      );
    }

    // OrderTypeIds filter
    if (params.orderType?.productIds) {
      const ids = StringUtils.toIntArray(params.orderType.productIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.orderTypeId IN (:...orderTypeIds)', { orderTypeIds: ids });
      }
    }

    // Order date range
    if (params.orderDate?.fromDate && params.orderDate?.toDate) {
      queryBuilder.andWhere('orderItem.orderDate BETWEEN :fromOrderDate AND :toOrderDate', {
        fromOrderDate: `${params.orderDate.fromDate} 00:00:00`,
        toOrderDate: `${params.orderDate.toDate} 23:59:59`,
      });
    }

    // OrderStatusIds filter
    if (params.orderStatus?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.orderStatus.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.orderStatusId IN (:...orderStatusIds)', { orderStatusIds: ids });
      }
    }

    // ShippingCertificateId filter
    if (params.shippingCertificateId) {
      queryBuilder.andWhere('orderItem.shippingCertificateId LIKE :shippingCertificateId', {
        shippingCertificateId: `%${params.shippingCertificateId}%`,
      });
    }

    // FromLocationIds filter
    if (params.fromLocation?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.fromLocation.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.fromLocationId IN (:...fromLocationIds)', { fromLocationIds: ids });
      }
    }

    // ToLocationIds filter
    if (params.toLocation?.lookUpIds) {
      const ids = StringUtils.toIntArray(params.toLocation.lookUpIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.toLocationId IN (:...toLocationIds)', { toLocationIds: ids });
      }
    }

    // CreatedByIds filter
    if (params.createdBy?.userIds) {
      const ids = StringUtils.toIntArray(params.createdBy.userIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.createdBy IN (:...createdByIds)', { createdByIds: ids });
      }
    }

    // ModifiedByIds filter
    if (params.modifiedBy?.userIds) {
      const ids = StringUtils.toIntArray(params.modifiedBy.userIds);
      if (ids.length > 0) {
        queryBuilder.andWhere('orderItem.modifiedBy IN (:...modifiedByIds)', { modifiedByIds: ids });
      }
    }

    // Created date range
    if (params.createdDate?.fromDate && params.createdDate?.toDate) {
      queryBuilder.andWhere('orderItem.createdDate BETWEEN :fromCreatedDate AND :toCreatedDate', {
        fromCreatedDate: `${params.createdDate.fromDate} 00:00:00`,
        toCreatedDate: `${params.createdDate.toDate} 23:59:59`,
      });
    }

    // Modified date range
    if (params.modifiedDate?.fromDate && params.modifiedDate?.toDate) {
      queryBuilder.andWhere('orderItem.modifiedDate BETWEEN :fromModifiedDate AND :toModifiedDate', {
        fromModifiedDate: `${params.modifiedDate.fromDate} 00:00:00`,
        toModifiedDate: `${params.modifiedDate.toDate} 23:59:59`,
      });
    }

    return queryBuilder;
  }

  /**
   * Map DTO to Entity for saving
   */
  private mapDtoToEntity(dto: OrderItemDto): Partial<OrderItem> {
    return {
      orderItemId: dto.orderItemId,
      orderId: dto.order?.orderId,
      orderTypeId: dto.orderType?.productId,
      orderUnitsNumber: dto.orderUnitsNumber,
      orderPrice: dto.orderPrice?.itemPrice,
      orderVat: dto.orderPrice?.itemVat,
      orderIncludeVat: dto.orderPrice?.itemIncludeVat ? 1 : 0,
      orderTotalPriceWithOutVat: dto.orderPrice?.totalItemPriceWithOutVat,
      orderTotalPriceVat: dto.orderPrice?.totalItemPriceVat,
      orderTotalPriceWithVat: dto.orderPrice?.totalItemPriceWithVat,
      orderCost: dto.orderPrice?.itemCost,
      orderTotalCost: dto.orderPrice?.totalItemCost,
      orderStatusId: dto.orderStatus?.lookUpId,
      shippingCertificateId: dto.shippingCertificateId,
      agentId: dto.agent?.customerId,
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
  private mapEntityToDto(entity: OrderItem): any {
    return {
      orderItemId: entity.orderItemId,
      order: {
        orderId: entity.orderId,
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
        itemCost: entity.orderCost,
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
      agent: {
        customerId: entity.agentId,
      },
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
    };
  }

  /**
   * Map multiple entities to DTOs
   */
  private mapEntitiesToDtos(entities: OrderItem[]): any[] {
    return entities.map((entity) => this.mapEntityToDto(entity));
  }

  /**
   * Format date to dd/MM/yyyy (matching C# ShortDate)
   */
  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}