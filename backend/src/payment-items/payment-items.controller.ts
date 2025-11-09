import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentItemsService } from './payment-items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { PaymentItemRequestDto } from './dto/payment-item.dto';

@Controller('api/smpaymentitem')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PaymentItemsController {
  constructor(private readonly paymentItemsService: PaymentItemsService) {}

  @Post()
  async handleRequest(@Body() body: PaymentItemRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SavePaymentItemDetails':
          return await this.savePaymentItemDetails(reqObject);

        case 'GetPaymentItemsList':
          return await this.getPaymentItemsList(reqObject);

        case 'GetPaymentItemDetails':
          return await this.getPaymentItemDetails(reqObject);

        case 'DeletePaymentItem':
          return await this.deletePaymentItem(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async savePaymentItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const paymentItem = await this.paymentItemsService.savePaymentItemDetails(reqObject);

    if (paymentItem) {
      return ApiResponse.success(paymentItem, 'Success');
    }

    return ApiResponse.error('Failed to save payment item');
  }

  private async getPaymentItemsList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      paymentItemIds: StringUtils.toString(reqObject.PaymentItemIds),
      paymentIds: StringUtils.toString(reqObject.Payment?.PaymentIds),
      customerIds: StringUtils.toString(reqObject.Payment?.Customer?.CustomerIds),
      customerIdz: StringUtils.toString(reqObject.Payment?.Customer?.CustomerIdz),
      customerName: StringUtils.toString(reqObject.Payment?.Customer?.CustomerName),
      paymentTypeIds: StringUtils.toString(reqObject.Payment?.PaymentType?.LookUpIds),
      paymentStatusIds: '1',
      paymentItemMethodIds: StringUtils.toString(reqObject.PaymentItemMethod?.LookUpIds),
      paymentItemBankIds: StringUtils.toString(reqObject.PaymentItemBank?.LookUpIds),
      paymentItemBankAccountNumber: StringUtils.toString(reqObject.PaymentItemBankAccountNumber),
      paymentItemBankBranchNumber: StringUtils.toString(reqObject.PaymentItemBankBranchNumber),
      paymentItemCheckNumber: StringUtils.toString(reqObject.PaymentItemCheckNumber),
      paymentItemNameOnCheck: StringUtils.toString(reqObject.PaymentItemNameOnCheck),
      fromPaymentDate: StringUtils.toString(reqObject.Payment?.PaymentDate?.FromDate),
      toPaymentDate: StringUtils.toString(reqObject.Payment?.PaymentDate?.ToDate),
      fromPaymentItemCheckDueDate: StringUtils.toString(reqObject.PaymentItemCheckDueDate?.FromDate),
      toPaymentItemCheckDueDate: StringUtils.toString(reqObject.PaymentItemCheckDueDate?.ToDate),
      paymentItemCheckStatusIds: StringUtils.toString(reqObject.PaymentItemCheckStatus?.LookUpIds),
      paymentItemReference: StringUtils.toString(reqObject.PaymentItemReference),
      paymentItemStatusIds: '1',
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const paymentItems = await this.paymentItemsService.getPaymentItemsList(searchParams);

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? paymentItems.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Date':
        const groupedByDate = this.groupByDate(paymentItems);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDate }, 'Success');

      default:
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: paymentItems }, 'Success');
    }
  }

  private async getPaymentItemDetails(reqObject: any): Promise<ApiResponse<any>> {
    const paymentItemId = StringUtils.toInt(reqObject.PaymentItemId);

    if (!paymentItemId) {
      return ApiResponse.error('Payment Item ID is required');
    }

    const paymentItem = await this.paymentItemsService.getPaymentItemDetails(paymentItemId);

    if (paymentItem) {
      return ApiResponse.success(paymentItem, 'Success');
    }

    return ApiResponse.error('Payment item not found');
  }

  private async deletePaymentItem(reqObject: any): Promise<ApiResponse<any>> {
    const paymentItemId = StringUtils.toInt(reqObject.PaymentItemId);

    if (!paymentItemId) {
      return ApiResponse.error('Payment Item ID is required');
    }

    await this.paymentItemsService.deletePaymentItem(paymentItemId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByDate(paymentItems: any[]): any[] {
    const grouped = paymentItems.reduce((acc, item) => {
      const date = new Date(item.createdDate);
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
        ShortDate: shortDate,
        SubList: grouped[shortDate].sort(
          (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        ),
      }));
  }
}