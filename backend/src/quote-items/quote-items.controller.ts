import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuoteItemsService } from './quote-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { QuoteItemRequestDto } from './dto/quote-item.dto';

@Controller('api/smquoteitem')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuoteItemsController {
  constructor(private readonly quoteItemsService: QuoteItemsService) {}

  @Post()
  async handleRequest(@Body() body: QuoteItemRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveOrderItemDetails':
          return await this.saveQuoteItemDetails(reqObject);

        case 'GetOrderItemsList':
          return await this.getQuoteItemsList(reqObject);

        case 'GetOrderItemDetails':
          return await this.getQuoteItemDetails(reqObject);

        case 'DeleteOrderItem':
          return await this.deleteQuoteItem(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveQuoteItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const quoteItem = await this.quoteItemsService.saveQuoteItemDetails(reqObject);

    if (quoteItem) {
      return ApiResponse.success(quoteItem, 'Success');
    }

    return ApiResponse.error('Failed to save quote item');
  }

  private async getQuoteItemsList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      orderItemIds: StringUtils.toString(reqObject.OrderItemIds),
      orderIds: StringUtils.toString(reqObject.Order?.OrderIds),
      customerIds: StringUtils.toString(reqObject.Customer?.CustomerIds),
      customerIdz: StringUtils.toString(reqObject.Customer?.CustomerIdz),
      customerName: StringUtils.toString(reqObject.Customer?.CustomerName),
      carIds: StringUtils.toString(reqObject.Car?.CarIds),
      carCarNumber: StringUtils.toString(reqObject.Car?.CarNumber),
      orderTypeIds: StringUtils.toString(reqObject.OrderType?.ProductIds),
      fromOrderDate: StringUtils.toString(reqObject.OrderDate?.FromDate),
      toOrderDate: StringUtils.toString(reqObject.OrderDate?.ToDate),
      orderStatusIds: StringUtils.toString(reqObject.OrderStatus?.LookUpIds),
      shippingCertificateId: StringUtils.toString(reqObject.ShippingCertificateId),
      fromLocationIds: StringUtils.toString(reqObject.FromLocation?.LookUpIds),
      toLocationIds: StringUtils.toString(reqObject.ToLocation?.LookUpIds),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const quoteItems = await this.quoteItemsService.getQuoteItemsList(searchParams);

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? quoteItems.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Date':
        const groupedByDate = this.groupByDate(quoteItems);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDate }, 'Success');

      case 'OrderId':
        const groupedByOrderId = this.groupByOrderId(quoteItems);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByOrderId }, 'Success');

      case 'None':
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: quoteItems }, 'Success');

      default:
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: quoteItems }, 'Success');
    }
  }

  private async getQuoteItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    const orderItemId = StringUtils.toInt(reqObject.OrderItemId);

    if (!orderItemId) {
      return ApiResponse.error('Order Item ID is required');
    }

    const quoteItem = await this.quoteItemsService.getQuoteItemDetails(orderItemId);

    if (quoteItem) {
      return ApiResponse.success(quoteItem, 'Success');
    }

    return ApiResponse.error('Quote item not found');
  }

  private async deleteQuoteItem(reqObject: any): Promise<ApiResponse<any>> {
    const orderItemId = StringUtils.toInt(reqObject.OrderItemId);

    if (!orderItemId) {
      return ApiResponse.error('Order Item ID is required');
    }

    await this.quoteItemsService.deleteQuoteItem(orderItemId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByDate(quoteItems: any[]): any[] {
    const grouped = quoteItems.reduce((acc, item) => {
      const date = new Date(item.orderDate);
      const shortDate = date.toISOString().split('T')[0];

      if (!acc[shortDate]) {
        acc[shortDate] = [];
      }

      acc[shortDate].push(item);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((shortDate) => ({
        Item: shortDate,
        SubList: grouped[shortDate].sort(
          (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
        ),
      }));
  }

  private groupByOrderId(quoteItems: any[]): any[] {
    const grouped = quoteItems.reduce((acc, item) => {
      const orderId = item.orderId || 0;
      const date = new Date(item.orderDate);
      const shortDate = date.toISOString().split('T')[0];
      const key = `${orderId}_${shortDate}`;

      if (!acc[key]) {
        acc[key] = {
          orderId,
          shortDate,
          items: [],
        };
      }

      acc[key].items.push(item);
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a: any, b: any) => {
        const dateCompare = new Date(b.shortDate).getTime() - new Date(a.shortDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return b.orderId - a.orderId;
      })
      .map((group: any) => ({
        Item: group.orderId,
        OrderDate: group.shortDate,
        SubList: group.items.sort(
          (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
        ),
      }));
  }
}