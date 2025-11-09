import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { StringUtils } from 'src/shared/utils/string.utils';
import { DriverRequestDto, SaveDriverDto, GetDriversListDto, GetDriverDetailsDto, DeleteDriverDto } from './dto/drivers.dto';


@Controller('api/smdriver')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async handleRequest(@Body() body: DriverRequestDto): Promise<ApiResponse<any>> {
    try {
      const reqType = StringUtils.toString(body.ReqType);
      const reqObject = body.ReqObject;

      switch (reqType) {
        case 'SaveDriverDetails':
          return await this.saveDriverDetails(reqObject);

        case 'GetDriversList':
          return await this.getDriversList(reqObject);

        case 'GetDriverDetails':
          return await this.getDriverDetails(reqObject);

        case 'DeleteDriver':
          return await this.deleteDriver(reqObject);

        default:
          return ApiResponse.error('Invalid request type');
      }
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  private async saveDriverDetails(reqObject: SaveDriverDto): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const driver = await this.driversService.saveDriverDetails(reqObject);
    
    if (driver) {
      return ApiResponse.success(driver, 'Success');
    }
    
    return ApiResponse.error('Failed to save driver');
  }

  private async getDriversList(reqObject: GetDriversListDto): Promise<ApiResponse<any>> {
    if (!reqObject) {
      return ApiResponse.error('Request object is required');
    }

    const searchParams = {
      driverIds: StringUtils.toString(reqObject.DriverIds),
      driverParentIds: StringUtils.toString(reqObject.DriverParent?.DriverIds),
      driverStatusIds: StringUtils.toString(reqObject.DriverStatusIds),
      driverTypeIds: StringUtils.toString(reqObject.DriverType?.LookUpIds),
      driverIdz: StringUtils.toString(reqObject.DriverIdz),
      carNumber: StringUtils.toString(reqObject.CarNumber),
      driverName: StringUtils.toString(reqObject.DriverName),
      driverPhoneNumber: StringUtils.toString(reqObject.DriverPhoneNumber),
      driverMobileNumber: StringUtils.toString(reqObject.DriverMobileNumber),
      driverFaxNumber: StringUtils.toString(reqObject.DriverFaxNumber),
      driverCity: StringUtils.toString(reqObject.DriverCity),
      driverCountry: StringUtils.toString(reqObject.DriverCountry),
      createdByIds: StringUtils.toString(reqObject.CreatedBy?.UserIds),
      modifiedByIds: StringUtils.toString(reqObject.ModifiedBy?.UserIds),
      fromCreatedDate: StringUtils.toString(reqObject.CreatedDate?.FromDate),
      toCreatedDate: StringUtils.toString(reqObject.CreatedDate?.ToDate),
      fromModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.FromDate),
      toModifiedDate: StringUtils.toString(reqObject.ModifiedDate?.ToDate),
      itemsPerPage: StringUtils.toInt(reqObject.ItemsPerPage),
      pageNumber: StringUtils.toInt(reqObject.PageNumber),
    };

    const drivers = await this.driversService.getDriversList(searchParams);
    
    const includeTotalRowsLength = StringUtils.toBoolean(reqObject.IncludeTotalRowsLength);
    let totalRowsLength = 0;
    
    if (includeTotalRowsLength) {
      totalRowsLength = await this.driversService.getDriversTotalRowsCount(searchParams);
    }

    const groupBy = StringUtils.toString(reqObject.GroupBy);

    if (groupBy === 'Name') {
      const grouped = this.groupByName(drivers);
      return ApiResponse.success({
        TotalLength: totalRowsLength,
        RowsList: grouped,
      }, 'Success');
    }

    return ApiResponse.success({
      TotalLength: totalRowsLength,
      RowsList: drivers,
    }, 'Success');
  }

  private async getDriverDetails(reqObject: GetDriverDetailsDto): Promise<ApiResponse<any>> {
    const driverId = StringUtils.toInt(reqObject.DriverId);
    
    if (!driverId) {
      return ApiResponse.error('Driver ID is required');
    }

    const driver = await this.driversService.getDriverDetails(driverId);
    
    if (driver) {
      return ApiResponse.success(driver, 'Success');
    }
    
    return ApiResponse.error('Driver not found');
  }

  private async deleteDriver(reqObject: DeleteDriverDto): Promise<ApiResponse<any>> {
    const driverId = StringUtils.toInt(reqObject.DriverId);
    
    if (!driverId) {
      return ApiResponse.error('Driver ID is required');
    }

    await this.driversService.deleteDriver(driverId);
    return ApiResponse.success(null, 'Success');
  }

  private groupByName(drivers: any[]): any[] {
    const grouped = drivers.reduce((acc, driver) => {
      if (!driver.driverName) return acc;
      
      const firstLetter = driver.driverName.substring(0, 1).toUpperCase();
      
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      
      acc[firstLetter].push(driver);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map(alphabet => ({
        Alphabet: alphabet,
        SubList: grouped[alphabet].sort((a, b) => 
          a.driverName.localeCompare(b.driverName)
        ),
      }));
  }
}