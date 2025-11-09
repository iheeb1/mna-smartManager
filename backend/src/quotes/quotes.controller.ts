import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { QuoteRequestDto } from './dto/quote.dto';

@Controller('api/smquote')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async handleRequest(@Body() body: QuoteRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveOrderDetails':
          return await this.saveQuoteDetails(reqObject);

        case 'GetOrdersList':
          return await this.getQuotesList(reqObject);

        case 'GetOrderDetails':
          return await this.getQuoteDetails(reqObject);

        case 'DeleteOrder':
          return await this.deleteQuote(reqObject);

        case 'DeleteOrders':
          return await this.deleteQuotes(reqObject);

        case 'ChangeOrdersStatus':
          return await this.changeQuotesStatus(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveQuoteDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const quote = await this.quotesService.saveQuoteDetails(reqObject);

    if (quote) {
      return ApiResponse.success(quote, 'Success');
    }

    return ApiResponse.error('Failed to save quote');
  }

  private async getQuotesList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      orderIds: StringUtils.toString(reqObject.OrderIds),
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

    const quotes = await this.quotesService.getQuotesList(searchParams);

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? quotes.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Date':
        const groupedByDate = this.groupByDate(quotes);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDate }, 'Success');

      case 'Customer':
        const groupedByCustomer = this.groupByCustomer(quotes);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByCustomer }, 'Success');

      case 'None':
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: quotes }, 'Success');

      default:
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: quotes }, 'Success');
    }
  }

  private async getQuoteDetails(reqObject: any): Promise<ApiResponse<any>> {
    const orderId = StringUtils.toInt(reqObject.OrderId);
    const includeQuoteItems = StringUtils.toBoolean(reqObject.IncludeOrderItems);

    if (!orderId) {
      return ApiResponse.error('Order ID is required');
    }

    const quote = await this.quotesService.getQuoteDetails(orderId, includeQuoteItems);

    if (quote) {
      return ApiResponse.success(quote, 'Success');
    }

    return ApiResponse.error('Quote not found');
  }

  private async deleteQuote(reqObject: any): Promise<ApiResponse<any>> {
    const orderId = StringUtils.toInt(reqObject.OrderId);

    if (!orderId) {
      return ApiResponse.error('Order ID is required');
    }

    await this.quotesService.deleteQuote(orderId);
    return ApiResponse.success(null, 'Success');
  }

  private async deleteQuotes(reqObject: any): Promise<ApiResponse<any>> {
    const orderIds = StringUtils.toString(reqObject.OrderIds);

    if (!orderIds) {
      return ApiResponse.error('Order IDs are required');
    }

    await this.quotesService.deleteQuotes(orderIds);
    return ApiResponse.success(null, 'Success');
  }

  private async changeQuotesStatus(reqObject: any): Promise<ApiResponse<any>> {
    const orderIds = StringUtils.toString(reqObject.OrderIds);
    const statusId = StringUtils.toInt(reqObject.StatusId);

    if (!orderIds || !statusId) {
      return ApiResponse.error('Order IDs and Status ID are required');
    }

    await this.quotesService.changeQuotesStatus(orderIds, statusId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByDate(quotes: any[]): any[] {
    const grouped = quotes.reduce((acc, item) => {
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

  private groupByCustomer(quotes: any[]): any[] {
    const grouped = quotes.reduce((acc, item) => {
      const customerName = item.customerId || 'Unknown';

      if (!acc[customerName]) {
        acc[customerName] = [];
      }

      acc[customerName].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((customerName) => ({
      Item: customerName,
      SubList: grouped[customerName].sort(
        (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
      ),
    }));
  }
}