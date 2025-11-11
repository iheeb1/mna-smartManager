import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { DashboardRequestDto, ClearedChecksQueryDto, AlertsClaimsQueryDto, SystemBackupsQueryDto } from './dto/reports.dto';


@Controller('api/smdashboard')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async handleRequest(@Body() body: DashboardRequestDto): Promise<ApiResponse<any>> {
    try {
      
      const reqType = body.ReqType;
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'GetDashboardTotals':
          return await this.getDashboardTotals(reqObject);

        case 'GetDashboardTotalsBarChart':
          return await this.getDashboardTotalsBarChart(reqObject);

        default:
          return ApiResponse.error(`Invalid request type: ${reqType}`);
      }
    } catch (error) {
      console.error('Error in handleRequest:', error);
      return ApiResponse.error(error.message || 'An error occurred');
    }
  }

  /**
   * Get Dashboard Totals
   */
  private async getDashboardTotals(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const dto = {
      customerIds: reqObject.TotalsLayoutCustomer?.CustomerIds || '',
      fromDate: reqObject.TotalsLayoutDate?.FromDate || '',
      toDate: reqObject.TotalsLayoutDate?.ToDate || '',
    };

    const totals = await this.reportsService.getDashboardTotals(dto);

    const response = {
      TotalOrders: totals.totalOrders,
      TotalPayments: totals.totalPayments,
      TotalExpenses: totals.totalExpenses,
      TotalAccount: totals.totalAccount,
      TotalsLayoutCustomer: reqObject.TotalsLayoutCustomer || {},
      TotalsLayoutDate: reqObject.TotalsLayoutDate || {},
    };

    return ApiResponse.success(response, 'Success');
  }

  /**
   * Get Dashboard Totals Bar Chart
   */
  private async getDashboardTotalsBarChart(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const dto = {
      customerIds: reqObject.TotalsLayoutCustomer?.CustomerIds || '',
      fromDate: reqObject.TotalsLayoutDate?.FromDate || '',
      toDate: reqObject.TotalsLayoutDate?.ToDate || '',
    };

    const barChartData = await this.reportsService.getDashboardTotalsBarChart(dto);

    const formattedData = barChartData.map((item) => ({
      Month: item.month,
      Totals: {
        TotalIncomes: item.totals.totalIncomes,
        TotalOutcomes: item.totals.totalOutcomes,
        TotalProfit: item.totals.totalProfit,
      },
    }));

    return ApiResponse.success(formattedData, 'Success');
  }

  /**
   * Get Cleared Checks - RESTful endpoint
   */
  @Get('cleared-checks')
  async getClearedChecks(
    @Query() query: ClearedChecksQueryDto
  ): Promise<ApiResponse<any>> {
    try {
      const dto = {
        customerIds: query.customerIds,
        fromDate: query.fromDate,
        toDate: query.toDate,
        paymentItemMethodIds: query.paymentItemMethodIds,
        paymentItemCheckStatusIds: query.paymentItemCheckStatusIds,
        paymentItemBankIds: query.paymentItemBankIds,
        fromPaymentItemCheckDueDate: query.fromPaymentItemCheckDueDate,
        toPaymentItemCheckDueDate: query.toPaymentItemCheckDueDate,
        itemsPerPage: query.itemsPerPage,
        pageNumber: query.pageNumber,
      };

      const checks = await this.reportsService.getClearedChecksList(dto);
      return ApiResponse.success(checks, 'Success');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Get Alerts and Claims - RESTful endpoint
   */
  @Get('alerts-claims')
  async getAlertsAndClaims(
    @Query() query: AlertsClaimsQueryDto
  ): Promise<ApiResponse<any>> {
    try {
      const dto = {
        customerIds: query.customerIds,
        fromDate: query.fromDate,
        toDate: query.toDate,
        itemsPerPage: query.itemsPerPage,
        pageNumber: query.pageNumber,
      };

      const alerts = await this.reportsService.getAlertsAndClaims(dto);
      return ApiResponse.success(alerts, 'Success');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  /**
   * Get System Backups - RESTful endpoint
   */
  @Get('system-backups')
  async getSystemBackups(
    @Query() query: SystemBackupsQueryDto
  ): Promise<ApiResponse<any>> {
    try {
      const backups = await this.reportsService.getSystemBackups(
        query.itemsPerPage,
        query.pageNumber,
      );
      return ApiResponse.success(backups, 'Success');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }
}