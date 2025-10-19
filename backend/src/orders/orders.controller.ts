import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { OrderRequestDto, GetOrdersListDto } from './dto/order.dto';

@Controller('api/SMOrder')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async post(@Body() body: OrderRequestDto): Promise<ApiResponse> {
    try {
      const { reqType, reqObject } = body;

      switch (reqType) {
        case 'SaveOrderDetails':
          return await this.handleSaveOrderDetails(reqObject);

        case 'GetOrdersList':
          return await this.handleGetOrdersList(body);

        case 'GetOrderDetails':
          return await this.handleGetOrderDetails(reqObject);

        case 'DeleteOrder':
          return await this.handleDeleteOrder(reqObject);

        case 'DeleteOrders':
          return await this.handleDeleteOrders(reqObject);

        case 'ChangeOrdersStatus':
          return await this.handleChangeOrdersStatus(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle SaveOrderDetails request
   */
  private async handleSaveOrderDetails(reqObject: any): Promise<ApiResponse> {
    try {
      if (!reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const isNew = !reqObject.orderId || reqObject.orderId <= 0;
      const savedOrder = await this.ordersService.save(reqObject);

      if (!isNew) {
        // Reload order with all details for update
        const orderDetails = await this.ordersService.getOrderDetails(
          savedOrder.orderId,
          false
        );
        return ApiResponse.success(orderDetails);
      }

      return ApiResponse.success(savedOrder);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetOrdersList request with grouping
   */
  private async handleGetOrdersList(body: any): Promise<ApiResponse> {
    try {
      if (!body.reqObject) {
        return ApiResponse.error('ReqObject is required');
      }

      const params: GetOrdersListDto = body.reqObject;
      const orders = await this.ordersService.getOrdersList(params);

      // Get total count if requested
      let totalLength = 0;
      if (body.reqObject.includeTotalRowsLength) {
        totalLength = await this.ordersService.getOrdersListCount(params);
      }

      // Handle grouping
      const groupBy = body.reqObject.groupBy || '';
      
      switch (groupBy) {
        case 'Date':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByDate(orders),
          });

        case 'Customer':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByCustomer(orders),
          });

        case 'Car':
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByCar(orders),
          });

        case 'None':
          return ApiResponse.success({
            totalLength,
            rowsList: orders,
          });

        default:
          // Group by OrderId and OrderDate
          return ApiResponse.success({
            totalLength,
            rowsList: this.groupByOrderId(orders),
          });
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle GetOrderDetails request
   */
  private async handleGetOrderDetails(reqObject: any): Promise<ApiResponse> {
    try {
      const orderId = parseInt(reqObject.orderId || reqObject.OrderId);
      const includeOrderItems = reqObject.includeOrderItems || false;

      if (!orderId) {
        return ApiResponse.error('OrderId is required');
      }

      const orderData = await this.ordersService.getOrderDetails(
        orderId,
        includeOrderItems
      );

      if (orderData) {
        return ApiResponse.success(orderData);
      }

      return ApiResponse.error('Order not found');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteOrder request
   */
  private async handleDeleteOrder(reqObject: any): Promise<ApiResponse> {
    try {
      const orderId = parseInt(reqObject.orderId || reqObject.OrderId);

      if (!orderId) {
        return ApiResponse.error('OrderId is required');
      }

      await this.ordersService.deleteOrder(orderId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle DeleteOrders request
   */
  private async handleDeleteOrders(reqObject: any): Promise<ApiResponse> {
    try {
      const orderIds = reqObject.orderIds || reqObject.OrderIds;

      if (!orderIds) {
        return ApiResponse.error('OrderIds is required');
      }

      await this.ordersService.deleteOrders(orderIds);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Handle ChangeOrdersStatus request
   */
  private async handleChangeOrdersStatus(reqObject: any): Promise<ApiResponse> {
    try {
      const orderIds = reqObject.orderIds || reqObject.OrderIds;
      const statusId = parseInt(reqObject.statusId || reqObject.StatusId);

      if (!orderIds || !statusId) {
        return ApiResponse.error('OrderIds and StatusId are required');
      }

      await this.ordersService.changeOrdersStatus(orderIds, statusId);
      return ApiResponse.success(null);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Group orders by date
   */
  private groupByDate(orders: any[]): any[] {
    const grouped = new Map<string, any[]>();
  
    for (const order of orders) {
      const shortDate = order.orderDate?.shortDate || '';
      if (!grouped.has(shortDate)) {
        grouped.set(shortDate, []);
      }
      grouped.get(shortDate)!.push(order);
    }
  
    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) =>
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group orders by customer
   */
  private groupByCustomer(orders: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const order of orders) {
      const customerName = order.customer?.customerName || '';
      if (!grouped.has(customerName)) {
        grouped.set(customerName, []);
      }
      grouped.get(customerName)!.push(order);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group orders by car
   */
  private groupByCar(orders: any[]): any[] {
    const grouped = new Map<string, any[]>();

    for (const order of orders) {
      const carNumber = order.car?.carNumber || '';
      if (!grouped.has(carNumber)) {
        grouped.set(carNumber, []);
      }
      grouped.get(carNumber)!.push(order);
    }

    return Array.from(grouped.entries()).map(([item, subList]) => ({
      item,
      subList: subList.sort((a, b) => 
        new Date(a.orderDate?.fullDate).getTime() - new Date(b.orderDate?.fullDate).getTime()
      ),
    }));
  }

  /**
   * Group orders by OrderId
   */
  private groupByOrderId(orders: any[]): any[] {
    const grouped = orders.map(order => ({
      item: order.orderId,
      orderDate: order.orderDate?.shortDate,
      subList: [order],
    }));

    // Sort by orderDate, then by orderId
    return grouped.sort((a, b) => {
      const dateCompare = (a.orderDate || '').localeCompare(b.orderDate || '');
      if (dateCompare !== 0) return dateCompare;
      return a.item - b.item;
    });
  }
}