import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderItemsService } from './order-items.service';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { OrderItemRequestDto, GetOrderItemsListDto } from './dto/order-item.dto';

@Controller('api/SMOrderItem')
@UseGuards(AuthGuard('jwt'))
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  async post(@Body() body: OrderItemRequestDto): Promise<ApiResponse> {
    try {
      const { reqType, reqObject } = body;

      switch (reqType) {
        case 'SaveOrderItemDetails':
          return await this.handleSaveOrderItemDetails(reqObject);

        case 'GetOrderItemsList':
          return await this.handleGetOrderItemsList(body);

        case 'GetOrderItemDetails':
          return await this.handleGetOrderItemDetails(reqObject);

        case 'GetLastOrderItemDetails':
          return await this.handleGetLastOrderItemDetails(reqObject);

        case 'DeleteOrderItem':
          return await this.handleDeleteOrderItem(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveOrderItemDetails request
   */
  private async handleSaveOrderItemDetails(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const isNew = !reqObject.orderItemId || reqObject.orderItemId <= 0;
      const savedOrderItem = await this.orderItemsService.save(reqObject);

      if (!isNew) {
        // Reload order item with all details for update
        const orderItemDetails = await this.orderItemsService.getOrderItemDetails(
          savedOrderItem.orderItemId
        );
        return ApiResponse.success(orderItemDetails);
      }

      return ApiResponse.success(savedOrderItem);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetOrderItemsList request with grouping
   */
  private async handleGetOrderItemsList(body: any): Promise<ApiResponse> {
    try {
      if (!body.reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const params: GetOrderItemsListDto = body.reqObject;
      const orderItems = await this.orderItemsService.getOrderItemsList(params);

      // Get total count if requested
      let totalLength = 0;
      if (body.reqObject.includeTotalRowsLength) {
        totalLength = await this.orderItemsService.getOrderItemsListCount(params);
      }

      // Handle grouping
      const groupBy = body.reqObject.groupBy || '';
      
      switch (groupBy) {
        case 'Date':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByDate(orderItems),
          });

        case 'Customer':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByCustomer(orderItems),
          });

        case 'Car':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByCar(orderItems),
          });

        case 'Supplier':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupBySupplier(orderItems),
          });

        case 'OrderId':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByOrderId(orderItems),
          });

        case 'None':
          return ApiResponse.success({
            totalLength,
            rowsList: orderItems,
          });

        default:
          // Group by OrderItemId (default)
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByOrderItemId(orderItems),
          });
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetOrderItemDetails request
   */
  private async handleGetOrderItemDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const orderItemId = parseInt(reqObject.orderItemId || reqObject.OrderItemId);

      if (!orderItemId) {
        return ApiResponse.error('OrderItemId is required');
      }

      const orderItemData = await this.orderItemsService.getOrderItemDetails(orderItemId);

      if (orderItemData) {
        return ApiResponse.success(orderItemData);
      }

      return ApiResponse.error('Order item not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetLastOrderItemDetails request
   */
  private async handleGetLastOrderItemDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const customerId = parseInt(reqObject.customerId || reqObject.CustomerId);
      const orderTypeId = parseInt(reqObject.orderTypeId || reqObject.OrderTypeId);

      if (!customerId || !orderTypeId) {
        return ApiResponse.error('CustomerId and OrderTypeId are required');
      }

      const lastOrderData = await this.orderItemsService.getLastOrderItemDetails(
        customerId,
        orderTypeId
      );

      if (lastOrderData) {
        return ApiResponse.success(lastOrderData);
      }

      return ApiResponse.error('Last order item not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteOrderItem request
   */
  private async handleDeleteOrderItem(reqObject: any): Promise<ApiResponse> {
    try {
      const orderItemId = parseInt(reqObject.orderItemId || reqObject.OrderItemId);

      if (!orderItemId) {
        return ApiResponse.error('OrderItemId is required');
      }

      await this.orderItemsService.deleteOrderItem(orderItemId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Group order items by date
   */
  private groupByDate(orderItems: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const item of orderItems) {
      const shortDate = item.orderDate?.shortDate || '';
      if (!grouped.has(shortDate)) {
        grouped.set(shortDate, []);
      }
      grouped.get(shortDate)!.push(item);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group order items by customer
   */
  private groupByCustomer(orderItems: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const item of orderItems) {
      const customerName = item.customer?.customerName || '';
      if (!grouped.has(customerName)) {
        grouped.set(customerName, []);
      }
      grouped.get(customerName)!.push(item);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group order items by car
   */
  private groupByCar(orderItems: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const item of orderItems) {
      const carNumber = item.order?.car?.carNumber || '';
      if (!grouped.has(carNumber)) {
        grouped.set(carNumber, []);
      }
      grouped.get(carNumber)!.push(item);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group order items by supplier (agent)
   */
  private groupBySupplier(orderItems: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const item of orderItems) {
      const agentName = item.agent?.customerName || '';
      if (!grouped.has(agentName)) {
        grouped.set(agentName, []);
      }
      grouped.get(agentName)!.push(item);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group order items by OrderId
   */
  private groupByOrderId(orderItems: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const item of orderItems) {
      const key = `${item.order?.orderId}_${item.orderDate?.shortDate}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    }

    const result = Array.from(grouped.entries()).map(([key, subList]) => {
      const [orderId, shortDate] = key.split('_');
      return {
        item: parseInt(orderId),
        orderDate: shortDate,
        subList: subList.sort((a, b) => 
          new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
        ),
      };
    });

    // Sort by orderDate, then by orderId
    return result.sort((a, b) => {
      const dateCompare = (a.orderDate || '').localeCompare(b.orderDate || '');
      if (dateCompare !== 0) return dateCompare;
      return a.item - b.item;
    });
  }

  /**
   * Group order items by OrderItemId (default)
   */
  private groupByOrderItemId(orderItems: any[]): any[] {
    return orderItems.map(item => ({
      item: item.orderItemId,
      subList: [item],
    }));
  }
}