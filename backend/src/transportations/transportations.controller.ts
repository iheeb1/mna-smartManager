import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransportationsService } from './transportations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { TransportationRequestDto } from './dto/transportation.dto';

@Controller('api/smtransportation')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TransportationsController {
  constructor(private readonly transportationsService: TransportationsService) {}

  @Post()
  async handleRequest(@Body() body: TransportationRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveTransportationDetails':
          return await this.saveTransportationDetails(reqObject);

        case 'GetTransportationsList':
          return await this.getTransportationsList(reqObject);

        case 'GetTransportationDetails':
          return await this.getTransportationDetails(reqObject);

        case 'DeleteTransportation':
          return await this.deleteTransportation(reqObject);

        case 'DeleteTransportations':
          return await this.deleteTransportations(reqObject);

        case 'ChangeTransportationsStatus':
          return await this.changeTransportationsStatus(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveTransportationDetails(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const transportation = await this.transportationsService.saveTransportationDetails(reqObject);

    if (transportation) {
      return ApiResponse.success(transportation, 'Success');
    }

    return ApiResponse.error('Failed to save transportation');
  }

  private async getTransportationsList(reqObject: any): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      transportationIds: StringUtils.toString(reqObject.TransportationIds),
      driverIds: StringUtils.toString(reqObject.Driver?.DriverIds),
      driverName: StringUtils.toString(reqObject.Driver?.DriverName),
      driverCarNumber: StringUtils.toString(reqObject.Driver?.CarNumber),
      fromTransportationDate: StringUtils.toString(reqObject.TransportationDate?.FromDate),
      toTransportationDate: StringUtils.toString(reqObject.TransportationDate?.ToDate),
      transportationStatusIds: StringUtils.toString(reqObject.TransportationStatus?.LookUpIds),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const transportations = await this.transportationsService.getTransportationsList(searchParams);

    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    const totalRowsLength = includeTotalRowsLength ? transportations.length : 0;
    const groupBy = StringUtils.toString(reqObject.GroupBy);

    switch (groupBy) {
      case 'Date':
        const groupedByDate = this.groupByDate(transportations);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDate }, 'Success');

      case 'Driver':
        const groupedByDriver = this.groupByDriver(transportations);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedByDriver }, 'Success');

      default:
        const groupedDefault = this.groupByDefault(transportations);
        return ApiResponse.success({ TotalLength: totalRowsLength, RowsList: groupedDefault }, 'Success');
    }
  }

  private async getTransportationDetails(reqObject: any): Promise<ApiResponse<any>> {
    const transportationId = StringUtils.toInt(reqObject.TransportationId);
    const includeTransportationItems = StringUtils.toBoolean(reqObject.IncludeTransportationItems);

    if (!transportationId) {
      return ApiResponse.error('Transportation ID is required');
    }

    const transportation = await this.transportationsService.getTransportationDetails(
      transportationId,
      includeTransportationItems,
    );

    if (transportation) {
      return ApiResponse.success(transportation, 'Success');
    }

    return ApiResponse.error('Transportation not found');
  }

  private async deleteTransportation(reqObject: any): Promise<ApiResponse<any>> {
    const transportationId = StringUtils.toInt(reqObject.TransportationId);

    if (!transportationId) {
      return ApiResponse.error('Transportation ID is required');
    }

    await this.transportationsService.deleteTransportation(transportationId);
    return ApiResponse.success(null, 'Success');
  }

  private async deleteTransportations(reqObject: any): Promise<ApiResponse<any>> {
    const transportationIds = StringUtils.toString(reqObject.TransportationIds);

    if (!transportationIds) {
      return ApiResponse.error('Transportation IDs are required');
    }

    await this.transportationsService.deleteTransportations(transportationIds);
    return ApiResponse.success(null, 'Success');
  }

  private async changeTransportationsStatus(reqObject: any): Promise<ApiResponse<any>> {
    const transportationIds = StringUtils.toString(reqObject.TransportationIds);
    const statusId = StringUtils.toInt(reqObject.StatusId);

    if (!transportationIds || !statusId) {
      return ApiResponse.error('Transportation IDs and Status ID are required');
    }

    await this.transportationsService.changeTransportationsStatus(transportationIds, statusId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByDate(transportations: any[]): any[] {
    const grouped = transportations.reduce((acc, item) => {
      const date = new Date(item.transportationDate);
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
          (a, b) => new Date(a.transportationDate).getTime() - new Date(b.transportationDate).getTime(),
        ),
      }));
  }

  private groupByDriver(transportations: any[]): any[] {
    const grouped = transportations.reduce((acc, item) => {
      const driverName = item.driverId || 'Unknown';

      if (!acc[driverName]) {
        acc[driverName] = [];
      }

      acc[driverName].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((driverName) => ({
      Item: driverName,
      SubList: grouped[driverName].sort(
        (a, b) => new Date(a.transportationDate).getTime() - new Date(b.transportationDate).getTime(),
      ),
    }));
  }

  private groupByDefault(transportations: any[]): any[] {
    const grouped = transportations.reduce((acc, item) => {
      const date = new Date(item.transportationDate);
      const shortDate = date.toISOString().split('T')[0];
      const key = `${item.transportationId}_${shortDate}`;

      if (!acc[key]) {
        acc[key] = {
          transportationId: item.transportationId,
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
        return b.transportationId - a.transportationId;
      })
      .map((group: any) => ({
        Item: group.transportationId,
        transportationDate: group.shortDate,
        SubList: group.items.sort(
          (a, b) => new Date(a.transportationDate).getTime() - new Date(b.transportationDate).getTime(),
        ),
      }));
  }
}