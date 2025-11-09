import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { PaymentRequestDto } from './dto/payment.dto';

@Controller('api/smpayment')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async handleRequest(@Body() body: PaymentRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SavePaymentDetails':
          return await this.savePaymentDetails(reqObject);

        case 'GetPaymentsList':
          return await this.getPaymentsList(reqObject);

        case 'GetPaymentDetails':
          return await this.getPaymentDetails(reqObject);

        case 'DeletePayment':
          return await this.deletePayment(reqObject);

        case 'DeletePayments':
          return await this.deletePayments(reqObject);

        case 'ChangePaymentsStatus':
          return await this.changePaymentsStatus(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async savePaymentDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const payment = await this.paymentsService.savePaymentDetails(reqObject);

    if (payment) {
      return ApiResponse.success(payment, 'Success');
    }

    return ApiResponse.error('Failed to save payment');
  }

  private async getPaymentsList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      paymentIds: StringUtils.toString(reqObject.PaymentIds),
      customerIds: StringUtils.toString(reqObject.Customer?.CustomerIds),
      customerIdz: StringUtils.toString(reqObject.Customer?.CustomerIdz),
      customerName: StringUtils.toString(reqObject.Customer?.CustomerName),
      paymentTypeIds: StringUtils.toString(reqObject.PaymentType?.LookUpIds),
      paymentStatusIds: StringUtils.toString(
        reqObject.PaymentStatusId < 0 ? '' : reqObject.PaymentStatusId?.toString(),
      ),
      fromPaymentDate: StringUtils.toString(reqObject.PaymentDate?.FromDate),
      toPaymentDate: StringUtils.toString(reqObject.PaymentDate?.ToDate),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const payments = await this.paymentsService.getPaymentsList(searchParams);

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? payments.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Date':
        const groupedByDate = this.groupByDate(payments);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDate }, 'Success');

      case 'Customer':
        const groupedByCustomer = this.groupByCustomer(payments);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByCustomer }, 'Success');

      default:
        const groupedById = this.groupById(payments);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedById }, 'Success');
    }
  }

  private async getPaymentDetails(reqObject: any): Promise<ApiResponse<any>> {
    const paymentId = StringUtils.toInt(reqObject.PaymentId);
    const includePaymentItems = StringUtils.toBoolean(reqObject.IncludePaymentItems);

    if (!paymentId) {
      return ApiResponse.error('Payment ID is required');
    }

    const payment = await this.paymentsService.getPaymentDetails(paymentId, includePaymentItems);

    if (payment) {
      return ApiResponse.success(payment, 'Success');
    }

    return ApiResponse.error('Payment not found');
  }

  private async deletePayment(reqObject: any): Promise<ApiResponse<any>> {
    const paymentId = StringUtils.toInt(reqObject.PaymentId);

    if (!paymentId) {
      return ApiResponse.error('Payment ID is required');
    }

    await this.paymentsService.deletePayment(paymentId);
    return ApiResponse.success(null, 'Success');
  }

  private async deletePayments(reqObject: any): Promise<ApiResponse<any>> {
    const paymentIds = StringUtils.toString(reqObject.PaymentIds);

    if (!paymentIds) {
      return ApiResponse.error('Payment IDs are required');
    }

    try {
      await this.paymentsService.deletePayments(paymentIds);
      return ApiResponse.success(null, 'Success');
    } catch (error) {
      return ApiResponse.error('Failed');
    }
  }

  private async changePaymentsStatus(reqObject: any): Promise<ApiResponse<any>> {
    const paymentIds = StringUtils.toString(reqObject.PaymentIds);
    const statusId = StringUtils.toInt(reqObject.StatusId);

    if (!paymentIds) {
      return ApiResponse.error('Payment IDs are required');
    }

    if (!statusId) {
      return ApiResponse.error('Status ID is required');
    }

    try {
      await this.paymentsService.changePaymentsStatus(paymentIds, statusId);
      return ApiResponse.success(null, 'Success');
    } catch (error) {
      return ApiResponse.error('Failed');
    }
  }

  private groupByDate(payments: any[]): any[] {
    const grouped = payments.reduce((acc, payment) => {
      const date = new Date(payment.paymentDate);
      const shortDate = date.toISOString().split('T')[0];

      if (!acc[shortDate]) {
        acc[shortDate] = [];
      }

      acc[shortDate].push(payment);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((shortDate) => ({
        Item: shortDate,
        SubList: grouped[shortDate].sort(
          (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
        ),
      }));
  }

  private groupByCustomer(payments: any[]): any[] {
    const grouped = payments.reduce((acc, payment) => {
      const customerName = payment.customerId?.toString() || 'Unknown';

      if (!acc[customerName]) {
        acc[customerName] = [];
      }

      acc[customerName].push(payment);
      return acc;
    }, {});

    return Object.keys(grouped).map((customerName) => ({
      Item: customerName,
      SubList: grouped[customerName].sort(
        (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
      ),
    }));
  }

  private groupById(payments: any[]): any[] {
    return payments.map((payment) => ({
      Item: payment.paymentId,
      SubList: [payment],
    }));
  }
}